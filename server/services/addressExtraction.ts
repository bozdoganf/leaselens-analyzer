const STREET_SUFFIX =
  "(?:Ave(?:nue)?|St(?:reet)?|Dr(?:ive)?|Rd|Road|Blvd|Boulevard|Ln|Lane|Way|Pl|Place|Ct|Court|Cir|Circle|Pkwy|Parkway)";

const UNIT_PREFIX = "(?:Apt|Apartment|Unit|Suite|Ste|#)";

const ADDRESS_SOURCE = [
  "\\b\\d{1,6}\\s+",
  "(?:[NSEW]\\.?\\s+)?",
  "[A-Za-z0-9.' -]+?\\s+",
  STREET_SUFFIX,
  "\\.?",
  `(?:\\s*,\\s*${UNIT_PREFIX}\\s*[A-Za-z0-9-]+)?`,
  "(?:\\s*,\\s*Tucson)?",
  "\\s*,\\s*(?:AZ|Arizona)",
  "(?:\\s+\\d{5}(?:-\\d{4})?)?",
].join("");

const ADDRESS_PATTERN = new RegExp(ADDRESS_SOURCE, "i");

const PROPERTY_LABEL_PATTERN = new RegExp(
  `\\b(?:property|premises)\\s*:\\s*(${ADDRESS_SOURCE})`,
  "i",
);

const PROPERTY_CUE_PATTERN = new RegExp(
  [
    "\\b(?:property|premises|housing unit|student housing unit|shared unit|bedroom|unit)",
    "[^\\n.]{0,120}?",
    "\\b(?:located\\s+at|at|address(?:\\s+is)?|is\\s+located\\s+at)\\b\\s*:?\\s*",
    `(${ADDRESS_SOURCE})`,
  ].join(""),
  "i",
);

const PROPERTY_HEADING_PATTERN =
  /^\s*(?:#{1,6}\s*)?(?:\d+\.\s*)?property\b/i;

function cleanAddress(address: string) {
  return address
    .replace(/\s+/g, " ")
    .replace(/\s+,/g, ",")
    .replace(/,\s*$/, "")
    .replace(/[.;:]$/, "")
    .trim();
}

function getFirstAddress(text: string) {
  const match = text.match(ADDRESS_PATTERN);
  return match ? cleanAddress(match[0]) : null;
}

function getCapturedAddress(pattern: RegExp, text: string) {
  const match = text.match(pattern);
  return match?.[1] ? cleanAddress(match[1]) : null;
}

function extractAddressFromPropertySection(text: string) {
  const lines = text.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    if (!PROPERTY_HEADING_PATTERN.test(lines[index])) {
      continue;
    }

    const nearbySection = lines.slice(index, index + 10).join("\n");
    const address = getFirstAddress(nearbySection);
    if (address) {
      return address;
    }
  }

  return null;
}

export function extractPropertyAddressFromText(text: string) {
  return (
    getCapturedAddress(PROPERTY_LABEL_PATTERN, text) ??
    extractAddressFromPropertySection(text) ??
    getCapturedAddress(PROPERTY_CUE_PATTERN, text) ??
    getFirstAddress(text)
  );
}

export function normalizePropertyAddress(value: string | null) {
  if (!value?.trim()) {
    return null;
  }

  return extractPropertyAddressFromText(value) ?? cleanAddress(value);
}
