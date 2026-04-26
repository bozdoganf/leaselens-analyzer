export interface Campus {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

export const DEFAULT_UNIVERSITY_ID = "university_of_arizona";

export const CAMPUSES: Campus[] = [
  {
    id: "university_of_arizona",
    name: "University of Arizona",
    shortName: "UArizona",
    city: "Tucson",
    state: "AZ",
    lat: 32.228941,
    lng: -110.95651,
  },
  {
    id: "asu_tempe",
    name: "Arizona State University - Tempe",
    shortName: "ASU Tempe",
    city: "Tempe",
    state: "AZ",
    lat: 33.424564,
    lng: -111.928001,
  },
  {
    id: "asu_downtown_phoenix",
    name: "Arizona State University - Downtown Phoenix",
    shortName: "ASU Downtown",
    city: "Phoenix",
    state: "AZ",
    lat: 33.453396,
    lng: -112.073787,
  },
  {
    id: "asu_polytechnic",
    name: "Arizona State University - Polytechnic",
    shortName: "ASU Polytechnic",
    city: "Mesa",
    state: "AZ",
    lat: 33.307575,
    lng: -111.679079,
  },
  {
    id: "nau_flagstaff",
    name: "Northern Arizona University",
    shortName: "NAU",
    city: "Flagstaff",
    state: "AZ",
    lat: 35.183562,
    lng: -111.654815,
  },
];

export function getCampusById(id: unknown): Campus {
  const defaultCampus =
    CAMPUSES.find((campus) => campus.id === DEFAULT_UNIVERSITY_ID) ?? CAMPUSES[0]!;

  if (typeof id !== "string") {
    return defaultCampus;
  }

  return CAMPUSES.find((campus) => campus.id === id) ?? defaultCampus;
}
