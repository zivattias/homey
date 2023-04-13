import React from "react";

type Nullable<T> = T | null;

export interface Apartment {
    street: string;
    streetNum: Nullable<number>;
    aptNum: Nullable<number>;
    zipCode: string;
    squareMeter: Nullable<number>;
    petFriendly: boolean;
    smokeFriendly: boolean;
    isWifi: boolean;
    isBalcony: boolean;
    isParking: boolean;
}

export enum ADD_APARTMENT_ACTIONS {
    CHANGE_ATTR = "changeAttribute",
}

interface AddApartmentAction {
    type: ADD_APARTMENT_ACTIONS;
    payload: Partial<Apartment>;
}

export const INITIAL_APARTMENT_STATE: Apartment = {
    street: "",
    streetNum: null,
    aptNum: null,
    zipCode: "",
    squareMeter: null,
    petFriendly: false,
    smokeFriendly: false,
    isWifi: false,
    isBalcony: false,
    isParking: false,
};

function apartmentReducer(
    apartmentState: Apartment,
    action: AddApartmentAction
) {
    switch (action.type) {
        case ADD_APARTMENT_ACTIONS.CHANGE_ATTR: {
            return {
                ...apartmentState,
                ...action.payload,
            };
        }
        default: {
            throw new Error("Unknown action: " + action.type);
        }
    }
}

const ApartmentContext = React.createContext(INITIAL_APARTMENT_STATE);
const ApartmentDispatchContext = React.createContext((() => {
    throw new Error("Forgot to wrap component in ApartmentContext");
}) as React.Dispatch<AddApartmentAction>);

export function ApartmentProvider({ children }: { children: React.ReactNode }) {
    const [apartmentState, dispatch] = React.useReducer(
        apartmentReducer,
        INITIAL_APARTMENT_STATE
    );

    return (
        <ApartmentContext.Provider value={apartmentState}>
            <ApartmentDispatchContext.Provider value={dispatch}>
                {children}
            </ApartmentDispatchContext.Provider>
        </ApartmentContext.Provider>
    );
}

export function useApartment() {
    return React.useContext(ApartmentContext);
}

export function useApartmentDispatch() {
    return React.useContext(ApartmentDispatchContext);
}
