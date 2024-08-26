// @ts-nocheck
import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import PropTypes from "prop-types";

interface LoadingScreen {
  loading: boolean;
}

export default function LoadingScreen(props: LoadingScreen) {
  const { loading } = props;
  return (
    <div>
      <Backdrop
        sx={{
          color: "#fff",
          backgroundColor: "white",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={loading}
      >
        {/* <img
            src="http://trr-web.trrgroup.com/storage/INTRANET/PROD/Asset/LoadingGIF/loadingWhite.gif"
            className="dark-logo "
            alt="Metronic dark logo"
          /> */}
        <div className="w-96 h-72">
          <img
            src="http://trr-web.trrgroup.com/storage/INTRANET/PROD/Asset/LoadingGIF/loading.gif"
            className="light-logo"
            alt="Metronic light logo"
          />
        </div>
      </Backdrop>
    </div>
  );
}
