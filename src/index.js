import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
// import { DataLayer } from "./DataLayer/DataLayer";
// import reducerFn, { initialState } from "./DataLayer/ReducerFn";
import "antd/dist/antd.min.css";
import { Provider } from "react-redux";
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div>
    {/* <DataLayer initialState={initialState} reducerFn={reducerFn}>
    </DataLayer> */}
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </div>
);
