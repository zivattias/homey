import { create, test, enforce, only, skipWhen, omitWhen } from "vest";
import sendRequest from "../funcs/sendRequest";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "../consts";

export const doesUserExist = async (username: string) => {
    const response = await sendRequest(
        "get",
        FULL_API_ENDPOINT +
            API_ENDPOINTS.AUTH.USER_EXISTS +
            `?username=${username}`,
        "",
        {}
    );
    // response.data: boolean - true/false
    enforce(response.data).isFalsy();
};

export const doesEmailExist = async (email: string) => {
    const response = await sendRequest(
        "get",
        FULL_API_ENDPOINT + API_ENDPOINTS.AUTH.EMAIL_EXISTS + `?email=${email}`,
        "",
        {}
    );
    // response.data: boolean - true/false
    enforce(response.data).isFalsy();
};

export const registerSuite = create((data = {}, currentField) => {
    only(currentField);

    test("username", "Username is required", () => {
        enforce(data.username).isNotBlank();
    });

    skipWhen(!Boolean(data.username), () => {
        test.memo(
            "username",
            "Username already taken",
            () => {
                return doesUserExist(data.username);
            },
            [data.username]
        );
    });

    skipWhen(!Boolean(data.email), () => {
        test.memo(
            "email",
            "Email already taken",
            () => {
                return doesEmailExist(data.email);
            },
            [data.email]
        );
    });

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

    test("confirm_password", "Passwords must match", () => {
        enforce(data.confirm_password).equals(data.password);
    });

    test("email", "Email is required", () => {
        enforce(data.email).isNotBlank();
    });

    test("email", "Please enter a valid email address", () => {
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        enforce(data.email).matches(emailRegex);
    });

    test("first_name", "First name is required", () => {
        enforce(data.first_name).isNotBlank();
    });

    test("first_name", "First name must contain at least 2 characters", () => {
        enforce(data.first_name).longerThanOrEquals(2);
    });

    test("last_name", "Last name is required", () => {
        enforce(data.last_name).isNotBlank();
    });

    test("last_name", "Last name must contain at least 2 characters", () => {
        enforce(data.last_name).longerThanOrEquals(2);
    });
});
