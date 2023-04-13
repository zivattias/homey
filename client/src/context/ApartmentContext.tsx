import React from "react";

export interface Apartment {
    street: string | null;
    streetNum: string | null;
    aptNum: number | null;
    zipCode: string | null;
    squareMeter: number | null;
    petFriendly: boolean | null;
    smokeFriendly: boolean | null;
    isWifi: boolean | null;
    isBalcony: boolean | null;
    isParking: boolean | null;
}

export enum ADD_APARTMENT_ACTIONS {
    CHANGE_ATTR = "changeAttribute",
}

interface AddApartmentAction {
    type: ADD_APARTMENT_ACTIONS;
    payload: Partial<Apartment>;
}

export const INITIAL_APARTMENT_STATE: Apartment = {
    street: null,
    streetNum: null,
    aptNum: null,
    zipCode: null,
    squareMeter: null,
    petFriendly: null,
    smokeFriendly: null,
    isWifi: null,
    isBalcony: null,
    isParking: null,
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
