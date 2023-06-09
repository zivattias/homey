import React, { useContext } from "react";
import { API_ENDPOINTS, FULL_API_ENDPOINT } from "../utils/consts";
import sendRequest from "../utils/funcs/sendRequest";

type Nullable<T> = T | null | undefined;

export interface User {
  id: Nullable<number>;
  username: Nullable<string>;
  firstName: Nullable<string>;
  lastName: Nullable<string>;
  email: Nullable<string>;
  isStaff: Nullable<boolean>;
  accessToken: Nullable<string>;
  refreshToken: Nullable<string>;
  profilePic: Nullable<string>;
  likedListings: Nullable<number[]>;
}

export enum USER_ACTIONS {
  REFRESH_ACCESS_TOKEN = "refreshAccessToken",
  LOGIN = "login",
  BLACKLIST = "blacklist",
  POPULATE = "populate",
  UPDATE_FIELD = "updateField",
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
  profilePic: null,
  likedListings: null,
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
      localStorage.removeItem("refreshToken");
      return INITIAL_USER_STATE;
    }
    case USER_ACTIONS.LOGIN: {
      localStorage.setItem("refreshToken", action.payload!.refreshToken!);
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
        profilePic: action.payload!.profilePic,
        likedListings: action.payload!.likedListings,
      };
    }
    case USER_ACTIONS.UPDATE_FIELD: {
      return {
        ...userState,
        ...action.payload,
      };
    }
    default: {
      throw new Error("Unknown action: " + action.type);
    }
  }
}

const UserContext = React.createContext(INITIAL_USER_STATE);
const UserDispatchContext = React.createContext((() => {
  throw new Error("Forgot to wrap component in UserProvider");
}) as React.Dispatch<UserAction>);

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
