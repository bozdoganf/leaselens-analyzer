import { describe, expect, it } from "vitest";
import {
  extractPropertyAddressFromText,
  normalizePropertyAddress,
} from "../../server/services/addressExtraction";

describe("address extraction", () => {
  it("extracts the property address from an analysis summary sentence", () => {
    const text =
      "This lease agreement for an off-campus student housing unit at 920 N Tyndall Ave, Unit 3, Tucson, AZ, has a monthly rent of $850.";

    expect(extractPropertyAddressFromText(text)).toBe(
      "920 N Tyndall Ave, Unit 3, Tucson, AZ",
    );
  });

  it("normalizes a verbose model propertyAddress value", () => {
    const value =
      "The property is located at 1723 E Lester St, Tucson, Arizona 85719.";

    expect(normalizePropertyAddress(value)).toBe(
      "1723 E Lester St, Tucson, Arizona 85719",
    );
  });

  it("prefers the property address over a landlord address in full lease text", () => {
    const text = `
**Landlord:** Desert Campus Rentals LLC
**Address:** 1245 E Speedway Blvd, Tucson, AZ

### 1. PROPERTY

Address: 920 N Tyndall Ave, Unit 3, Tucson, AZ
`;

    expect(extractPropertyAddressFromText(text)).toBe(
      "920 N Tyndall Ave, Unit 3, Tucson, AZ",
    );
  });

  it("extracts direct property labels", () => {
    expect(
      extractPropertyAddressFromText(
        "Property: 1010 N Tyndall Ave, Unit 304, Tucson, AZ",
      ),
    ).toBe("1010 N Tyndall Ave, Unit 304, Tucson, AZ");
  });
});
