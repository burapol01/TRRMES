import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./assets/fonticon/fonticon.css";
import "./assets/keenicons/duotone/style.css";
import "./assets/keenicons/outline/style.css";
import "./assets/keenicons/solid/style.css";
import "./assets/sass/style.scss";
import "./assets/sass/plugins.scss";
import "./assets/sass/style.react.scss";
import AppRoutes from "./routing/AppRoutes";
import { Provider } from "react-redux";
import { rootReducer } from "../redux/reducers/rootReducer";
import { applyMiddleware, createStore } from "redux";
import { thunk } from "redux-thunk";
import { AuthProvider } from "./core/Auth";
import MassengmodalProvider from "./components/MUI/Massengmodal";
import ConfirmModalDialog from "./components/MUI/Comfirmmodal";
/**
 * Creates `axios-mock-adapter` instance for provided `axios` instance, add
 * basic Metronic mocks and returns it.
 *
 * @see https://github.com/ctimmerm/axios-mock-adapter
 */
/**
 * Inject Metronic interceptors for axios.
 *
 * @see https://github.com/axios/axios#interceptors
 *
 */
const middlewares = [thunk];
const store = createStore(rootReducer, applyMiddleware(...middlewares));
const container = document.getElementById("root");
if (container)
    ReactDOM.createRoot(document.getElementById("root")).render(_jsx(Provider, { store: store, children: _jsxs(AuthProvider, { children: [_jsx(MassengmodalProvider, {}), _jsx(ConfirmModalDialog, {}), _jsx(AppRoutes, {})] }) }));
