import {
  combineReducers,
  legacy_createStore as createStore,
  legacy_createStore,
} from "redux";
import { reducer } from "./reducer";
import { reducer as newReducer } from "../redux/MyNewReducer/reducer";

const rootReducer = combineReducers({
  reducer,
  newReducer,
});

const store = legacy_createStore(rootReducer);

export default store;
