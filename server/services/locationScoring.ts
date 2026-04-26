import { getCampusById, type Campus } from "../../shared/campuses";

type Coordinates = {
  lat: number;
  lng: number;
};

type RouteMode = "WALK" | "BICYCLE" | "TRANSIT" | "DRIVE";

type RouteEstimate = {
  mode: RouteMode;
  minutes: number;
  distanceMiles: number | null;
};

type CommuteInsight = {
  headline: string;
  commute: string;
  transportNote: string;
};

type LocationScoringResult = {
  score: number | null;
  commuteInsight: CommuteInsight;
};

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
const geocodeCache = new Map<string, Coordinates | null>();
const routeCache = new Map<string, RouteEstimate | null>();

function normalizeAddress(address: string) {
  return address.toLowerCase().replace(/\s+/g, " ").trim();
}

function metersToMiles(meters: number) {
  return meters / 1609.344;
}

function roundToTenth(value: number) {
  return Math.round(value * 10) / 10;
}

function parseDurationMinutes(duration: unknown) {
  if (typeof duration !== "string") {
    return null;
  }

  const match = duration.match(/^(\d+(?:\.\d+)?)s$/);
  if (!match) {
    return null;
  }

  return Math.max(1, Math.round(Number(match[1]) / 60));
}

function formatMode(mode: RouteMode) {
  switch (mode) {
    case "WALK":
      return "walk";
    case "BICYCLE":
      return "bike";
    case "TRANSIT":
      return "transit";
    case "DRIVE":
      return "drive";
  }
}

function formatCommute(routes: RouteEstimate[]) {
  const order: RouteMode[] = ["BICYCLE", "WALK", "TRANSIT", "DRIVE"];

  return order
    .map((mode) => routes.find((route) => route.mode === mode))
    .filter((route): route is RouteEstimate => Boolean(route))
    .map((route) => `${route.minutes} min ${formatMode(route.mode)}`)
    .join(" / ");
}

function scoreFromCommute(routes: RouteEstimate[]) {
  const nonDrivingRoutes = routes.filter((route) => route.mode !== "DRIVE");
  const scoringRoutes = nonDrivingRoutes.length > 0 ? nonDrivingRoutes : routes;
  const bestRoute = scoringRoutes.reduce<RouteEstimate | null>(
    (best, route) => (!best || route.minutes < best.minutes ? route : best),
    null,
  );

  if (!bestRoute) {
    return null;
  }

  let score = 20;
  if (bestRoute.minutes <= 10) {
    score = 100;
  } else if (bestRoute.minutes <= 15) {
    score = 90;
  } else if (bestRoute.minutes <= 25) {
    score = 75;
  } else if (bestRoute.minutes <= 35) {
    score = 60;
  } else if (bestRoute.minutes <= 50) {
    score = 40;
  }

  if (nonDrivingRoutes.length === 0 && bestRoute.mode === "DRIVE") {
    score = Math.max(0, score - 15);
  }

  return score;
}

function describeLocationScore(score: number) {
  if (score >= 90) return "very close to campus";
  if (score >= 75) return "close to campus";
  if (score >= 60) return "manageable campus access";
  if (score >= 40) return "longer campus commute";
  return "far from campus";
}

async function geocodeAddress(address: string) {
  if (!googleMapsApiKey) {
    return null;
  }

  const cacheKey = normalizeAddress(address);
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey) ?? null;
  }

  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", address);
  url.searchParams.set("key", googleMapsApiKey);

  try {
    const response = await fetch(url);
    if (!response.ok) {
      geocodeCache.set(cacheKey, null);
      return null;
    }

    const data = await response.json();
    const location = data?.results?.[0]?.geometry?.location;

    if (
      typeof location?.lat !== "number" ||
      typeof location?.lng !== "number"
    ) {
      geocodeCache.set(cacheKey, null);
      return null;
    }

    const coordinates = { lat: location.lat, lng: location.lng };
    geocodeCache.set(cacheKey, coordinates);
    return coordinates;
  } catch (error) {
    console.error("Geocoding failed:", error);
    geocodeCache.set(cacheKey, null);
    return null;
  }
}

async function getRouteEstimate({
  origin,
  destination,
  mode,
}: {
  origin: Coordinates;
  destination: Coordinates;
  mode: RouteMode;
}) {
  if (!googleMapsApiKey) {
    return null;
  }

  const cacheKey = [
    mode,
    origin.lat.toFixed(5),
    origin.lng.toFixed(5),
    destination.lat.toFixed(5),
    destination.lng.toFixed(5),
  ].join(":");

  if (routeCache.has(cacheKey)) {
    return routeCache.get(cacheKey) ?? null;
  }

  try {
    const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": googleMapsApiKey,
        "X-Goog-FieldMask": "routes.duration,routes.distanceMeters",
      },
      body: JSON.stringify({
        origin: {
          location: {
            latLng: {
              latitude: origin.lat,
              longitude: origin.lng,
            },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: destination.lat,
              longitude: destination.lng,
            },
          },
        },
        travelMode: mode,
        ...(mode === "DRIVE" ? { routingPreference: "TRAFFIC_UNAWARE" } : {}),
      }),
    });

    if (!response.ok) {
      routeCache.set(cacheKey, null);
      return null;
    }

    const data = await response.json();
    const route = data?.routes?.[0];
    const minutes = parseDurationMinutes(route?.duration);
    const distanceMeters = route?.distanceMeters;

    if (!minutes) {
      routeCache.set(cacheKey, null);
      return null;
    }

    const estimate: RouteEstimate = {
      mode,
      minutes,
      distanceMiles:
        typeof distanceMeters === "number" ? roundToTenth(metersToMiles(distanceMeters)) : null,
    };

    routeCache.set(cacheKey, estimate);
    return estimate;
  } catch (error) {
    console.error("Route lookup failed:", error);
    routeCache.set(cacheKey, null);
    return null;
  }
}

async function getRouteEstimates(origin: Coordinates, campus: Campus) {
  const destination = { lat: campus.lat, lng: campus.lng };
  const modes: RouteMode[] = ["WALK", "BICYCLE", "TRANSIT", "DRIVE"];
  const routes = await Promise.all(
    modes.map((mode) => getRouteEstimate({ origin, destination, mode })),
  );

  return routes.filter((route): route is RouteEstimate => Boolean(route));
}

export async function calculateLocationScoring({
  propertyAddress,
  universityId,
}: {
  propertyAddress: string | null;
  universityId: unknown;
}): Promise<LocationScoringResult> {
  const campus = getCampusById(universityId);

  if (!propertyAddress?.trim()) {
    return {
      score: null,
      commuteInsight: {
        headline: `Campus set to ${campus.shortName}`,
        commute: "Lease address not found",
        transportNote:
          "Confirm the property address to calculate campus commute distance.",
      },
    };
  }

  if (!googleMapsApiKey) {
    return {
      score: null,
      commuteInsight: {
        headline: `Campus set to ${campus.shortName}`,
        commute: "Route lookup unavailable",
        transportNote:
          "Add GOOGLE_MAPS_API_KEY on the server to score location from the lease address.",
      },
    };
  }

  const propertyCoordinates = await geocodeAddress(propertyAddress);

  if (!propertyCoordinates) {
    return {
      score: null,
      commuteInsight: {
        headline: `Campus set to ${campus.shortName}`,
        commute: "Address could not be mapped",
        transportNote:
          "Ask the renter to confirm the full property address before relying on location scoring.",
      },
    };
  }

  const routes = await getRouteEstimates(propertyCoordinates, campus);
  const score = scoreFromCommute(routes);

  if (score === null) {
    return {
      score: null,
      commuteInsight: {
        headline: `Campus set to ${campus.shortName}`,
        commute: "Commute route unavailable",
        transportNote:
          "The address was mapped, but route data was not available for campus commute scoring.",
      },
    };
  }

  return {
    score,
    commuteInsight: {
      headline: `${campus.shortName} commute is ${describeLocationScore(score)}`,
      commute: formatCommute(routes),
      transportNote: `Location score is based on available walking, biking, transit, and driving routes to ${campus.name}.`,
    },
  };
}
