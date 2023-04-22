import { create, test, enforce, only } from "vest";

export const loginSuite = create((data = {}, currentField) => {
    only(currentField);

    test("username", "Username is required!", () => {
        enforce(data.username).isNotBlank();
    });

    test("password", "Password is required!", () => {
        enforce(data.password).isNotBlank();
    });
});
