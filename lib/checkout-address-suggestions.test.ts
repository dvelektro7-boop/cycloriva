import assert from "node:assert/strict";
import test from "node:test";
import { parsePhotonSuggestions } from "./checkout-address-suggestions";
test("address results exclude other countries, duplicate entries and invented fields", () => {
  const feature = (properties: object) => ({ properties });
  const data = {
    features: [
      feature({
        countrycode: "FR",
        street: "Rue de Rivoli",
        housenumber: "10",
        city: "Paris",
        postcode: "75004",
      }),
      feature({
        countrycode: "FR",
        street: "Rue de Rivoli",
        housenumber: "10",
        city: "Paris",
        postcode: "75004",
      }),
      feature({ countrycode: "DE", street: "Andere Straße", city: "Berlin" }),
      feature({ countrycode: "FR", street: "Rue Exemple", city: "Paris" }),
    ],
  };
  const result = parsePhotonSuggestions(data, "FR");
  assert.equal(result.length, 2);
  assert.equal(result[0].addressLine1, "10 Rue de Rivoli");
  assert.equal(result[1].addressLine1, "Rue Exemple");
  assert.equal(result[1].postalCode, "");
});
test("postal suggestions offer the locality without replacing the street or inventing a postcode", () => {
  const data = {
    features: [
      {
        properties: {
          countrycode: "FR",
          osm_value: "postcode",
          name: "75004",
          city: "Paris",
        },
      },
      { properties: { countrycode: "FR", postcode: "75001", city: "Paris" } },
      { properties: { countrycode: "FR", city: "Paris" } },
    ],
  };
  assert.deepEqual(parsePhotonSuggestions(data, "FR", "75004"), [
    {
      label: "75004 Paris",
      addressLine1: "",
      city: "Paris",
      postalCode: "75004",
    },
  ]);
  assert.deepEqual(parsePhotonSuggestions(null, "FR"), []);
});
