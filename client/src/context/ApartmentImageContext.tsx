import React from "react";

export interface Image {
  key: number;
  src: string;
}

export enum IMAGE_ACTIONS {
  ADD_IMAGE = "addImage",
  REMOVE_IMAGE = "removeImage",
}

interface IApartmentImageActions {
  type: IMAGE_ACTIONS;
  payload: Partial<Image>;
}

export const INITIAL_IMAGES_STATE: Image[] = [];

const apartmentImagesReducer = (
  apartmentImagesState: Image[],
  action: IApartmentImageActions
) => {
  switch (action.type) {
    case IMAGE_ACTIONS.ADD_IMAGE: {
      return [...apartmentImagesState, action.payload as Image];
    }
    case IMAGE_ACTIONS.REMOVE_IMAGE: {
      return apartmentImagesState.filter(
        (image) => image.key !== action.payload.key
      );
    }
    default: {
      throw new Error("Unknown action: " + action.type);
    }
  }
};

const ImageContext = React.createContext(INITIAL_IMAGES_STATE);
const ImageDispatchContext = React.createContext((() => {
  throw new Error("Forgot to wrap component in ImageContext");
}) as React.Dispatch<IApartmentImageActions>);

export const ImageProvider = ({ children }: { children: React.ReactNode }) => {
  const [imagesState, dispatch] = React.useReducer(
    apartmentImagesReducer,
    INITIAL_IMAGES_STATE
  );

  return (
    <ImageContext.Provider value={imagesState}>
      <ImageDispatchContext.Provider value={dispatch}>
        {children}
      </ImageDispatchContext.Provider>
    </ImageContext.Provider>
  );
};

export const useImages = () => {
  return React.useContext(ImageContext);
};

export const useImagesDispatch = () => {
  return React.useContext(ImageDispatchContext);
};
