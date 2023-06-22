import { USER_DETAILS } from "./actionTypes";

const initialState = {
  user: {},
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_DETAILS: {
      return { ...state, user: action.payload };
    }

    default: {
      return state;
    }
  }
};
