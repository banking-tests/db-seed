const faker = require("faker");

export function generateRandomDigits() {
  return Array.from({ length: 18 }, () => faker.datatype.number(9)).join("");
}
