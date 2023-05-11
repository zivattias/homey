import { create, test, enforce, only } from "vest";

export const apartmentSuite = create((data = {}, currentField) => {
  only(currentField);

  test("street", "Street name is required", () => {
    enforce(data.street).isNotBlank();
  });

  test("street", "Street name must be at least 5 letters", () => {
    enforce(data.street).longerThanOrEquals(5);
  });

  test("street_num", "Street number is required", () => {
    enforce(data.street_num).isNotBlank();
  });

  test("street_num", "Street number cannot be 0", () => {
    enforce(data.street_num).isNotValueOf(0);
  });

  test("apt_num", "Apartment number is required", () => {
    enforce(data.apt_num).isNotBlank();
  });

  test("apt_num", "Apartment number cannot be 0", () => {
    enforce(data.apt_num).isNotValueOf(0);
  });

  test("zip_code", "Zipcode is required", () => {
    enforce(data.zip_code).isNotBlank();
  });

  test("zip_code", "Zipcode is invalid", () => {
    enforce(data.zip_code).matches(/^[0-9]{7}$/);
  });

  test("square_meter", "Square meter is required", () => {
    enforce(data.square_meter).isNotBlank();
  });

  test("square_meter", "Square meter cannot be 0", () => {
    enforce(data.square_meter).isNotValueOf(0);
  });
});
