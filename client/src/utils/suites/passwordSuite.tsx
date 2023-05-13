import { create, test, enforce, only, include } from "vest";

export const passwordSuite = create((data = {}, currentField) => {
  only(currentField);

  include("confirm_password").when("password");

  test("password", "Password is required", () => {
    enforce(data.password).isNotBlank();
  });

  test("password", "Password must contain at least 8 characters", () => {
    enforce(data.password).longerThanOrEquals(8);
  });

  test(
    "password",
    "Password must contain at least 1 lower-case letter.",
    () => {
      enforce(data.password).matches(/[a-z]/);
    }
  );

  test(
    "password",
    "Password must contain at least 1 upper-case letter.",
    () => {
      enforce(data.password).matches(/[A-Z]/);
    }
  );

  test(
    "password",
    "Password must contain at least 1 special character.",
    () => {
      enforce(data.password).matches(/[!@#$%^&*(),.?":{}|<>]/);
    }
  );

  test("confirm_password", "Passwords must match.", () => {
    enforce(data.confirm_password).equals(data.password);
  });
});
