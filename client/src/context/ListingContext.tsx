import React from "react";
import { MarkerCoordinates } from "../components/HomePage/Map/Map";

export interface IListing {
  id: null | number | undefined;
  location: null | MarkerCoordinates | undefined;
  mapActive: null | boolean | undefined;
}

export enum LISTING_ACTIONS {
  SET_ACTIVE = "setActive",
  RESET_ACTIVE = "resetActive",
  MAP_STATUS = "setMapStatus",
}

interface ListingAction {
  type: LISTING_ACTIONS;
  payload?: Partial<IListing>;
}

export const INITIAL_LISTING_STATE: IListing = {
  id: null,
  location: null,
  mapActive: false,
};

const listingReducer = (state: IListing, action: ListingAction) => {
  switch (action.type) {
    case LISTING_ACTIONS.SET_ACTIVE: {
      return {
        ...state,
        id: action.payload?.id,
        location: action.payload?.location,
      };
    }
    case LISTING_ACTIONS.MAP_STATUS: {
      return {
        ...state,
        mapActive: action.payload?.mapActive,
      };
    }
    case LISTING_ACTIONS.RESET_ACTIVE: {
      return INITIAL_LISTING_STATE;
    }
    default: {
      throw new Error("Unknown action: " + action.type);
    }
  }
};

const ListingContext = React.createContext(INITIAL_LISTING_STATE);
const ListingDispatchContext = React.createContext((() => {
  throw new Error("Forgot to wrap component in ListingProvider");
}) as React.Dispatch<ListingAction>);

export const ListingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = React.useReducer(
    listingReducer,
    INITIAL_LISTING_STATE
  );

  return (
    <ListingContext.Provider value={state}>
      <ListingDispatchContext.Provider value={dispatch}>
        {children}
      </ListingDispatchContext.Provider>
    </ListingContext.Provider>
  );
};

export const useListing = () => {
  return React.useContext(ListingContext);
};

export const useListingDispatch = () => {
  return React.useContext(ListingDispatchContext);
};
