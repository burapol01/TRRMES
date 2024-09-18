import { jsx as _jsx } from "react/jsx-runtime";
import Backdrop from "@mui/material/Backdrop";
export default function LoadingScreen(props) {
    const { loading } = props;
    return (_jsx("div", { children: _jsx(Backdrop, { sx: {
                color: "#fff",
                backgroundColor: "white",
                zIndex: (theme) => theme.zIndex.drawer + 1,
            }, open: loading, children: _jsx("div", { className: "w-96 h-72", children: _jsx("img", { src: `${import.meta.env.VITE_APP_IMG_LOGO_URL}/INTRANET/PROD/Asset/LoadingGIF/loading.gif`, className: "light-logo", alt: "Metronic light logo" }) }) }) }));
}
