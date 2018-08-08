import { createStore } from "redux";
import reducer from "./reducer";

export default (process.env.NODE_ENV === "production"
  ? createStore(reducer)
  : createStore(
      reducer,
      require("redux-devtools-extension").devToolsEnhancer()
    ));
