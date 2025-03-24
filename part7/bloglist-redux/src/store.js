import { legacy_createStore as createStore } from "redux";
import notificationReducer from "./reducers/notificationReducer.js";

const store = createStore(notificationReducer);

export default store;
