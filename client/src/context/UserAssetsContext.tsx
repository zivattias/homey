import React from "react";

type EmptyArrayOrNums = [] | number[];

interface UserAssets {
    likedListings: EmptyArrayOrNums;
    apartments: EmptyArrayOrNums;
    listings: EmptyArrayOrNums;
    proposals: EmptyArrayOrNums;
}

export const USER_ASSETS_ACTIONS = {
    LIKE_APARTMENT: "likeApartment",
    UNLIKE_APARTMENT: "unlikeApartment",
    GET_LIKED_LISTINGS: "getLikedListings",
    UPLOAD_APARTMENT: "uploadApartment",
    EDIT_APARTMENT: "editApartment",
    DELETE_APARTMENT: "deleteApartment",
    GET_APARTMENTS: "getApartments",
    CREATE_LISTING: "createListing",
    EDIT_LISTING: "editListing",
    DELETE_LISTING: "deleteListing",
    GET_LISTINGS: "getListings",
    CREATE_PROPOSAL: "createProposal",
    DELETE_PROPOSAL: "deleteProposal",
};

export const INITIAL_USER_ASSETS: UserAssets = {
    likedListings: [],
    apartments: [],
    listings: [],
    proposals: [],
};
