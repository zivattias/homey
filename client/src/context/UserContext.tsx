import React, { useContext } from "react";

type Nullable<T> = T | null | undefined;

interface User {
    id: Nullable<number>;
    username: Nullable<string>;
    firstName: Nullable<string>;
    lastName: Nullable<string>;
    email: Nullable<string>;
    isStaff: Nullable<boolean>;
    accessToken: Nullable<string>;
    refreshToken: Nullable<string>;
}

export enum USER_ACTIONS {
    REFRESH_ACCESS_TOKEN = "refreshAccessToken",
    LOGIN = "login",
    BLACKLIST = "blacklist",
    POPULATE = "populate",
}

interface UserAction {
    type: USER_ACTIONS;
    payload?: Partial<User> | User;
}

export const INITIAL_USER_STATE: User = {
    id: null,
    username: null,
    firstName: null,
    lastName: null,
    email: null,
    isStaff: null,
    accessToken: null,
    refreshToken: null,
};

function userReducer(userState: User, action: UserAction) {
    switch (action.type) {
        case USER_ACTIONS.REFRESH_ACCESS_TOKEN: {
            return {
                ...userState,
                accessToken: action.payload!.accessToken,
            };
        }
        case USER_ACTIONS.BLACKLIST: {
            // TODO: add request to blacklist endpoint @ API
            return INITIAL_USER_STATE;
        }
        case USER_ACTIONS.LOGIN: {
            return {
                ...userState,
                accessToken: action.payload!.accessToken,
                refreshToken: action.payload!.refreshToken,
            };
        }
        case USER_ACTIONS.POPULATE: {
            return {
                ...userState,
                id: action.payload!.id,
                username: action.payload!.username,
                firstName: action.payload!.firstName,
                lastName: action.payload!.lastName,
                email: action.payload!.email,
                isStaff: action.payload!.isStaff,
            };
        }
        default: {
            throw new Error("Unknown action: " + action.type);
        }
    }
}

const UserContext = React.createContext(INITIAL_USER_STATE);
const UserDispatchContext = React.createContext(
    (() => {}) as React.Dispatch<UserAction>
);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [userState, dispatch] = React.useReducer(
        userReducer,
        INITIAL_USER_STATE
    );

    return (
        <UserContext.Provider value={userState}>
            <UserDispatchContext.Provider value={dispatch}>
                {children}
            </UserDispatchContext.Provider>
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}

export function useUserDispatch() {
    return useContext(UserDispatchContext);
}
