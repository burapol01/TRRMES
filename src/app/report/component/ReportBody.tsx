
import React from "react";
import { _POST } from "../../../service/mas";
import { _formatNumber, _formatNumberNotdecimal } from "../../../../libs/datacontrol";

interface ReportBody {

  dataelement?: any

}


export default function ReportBody({
  dataelement,

}: ReportBody) {



  const VITE_APP_SITE = import.meta.env.VITE_APP_SITE;
  const VITE_APP = import.meta.env.VITE_APP;
  const VITE_SITE_PATH = import.meta.env.VITE_SITE_PATH;
  const VITE_APP_TRR_API_URL_REPORT = import.meta.env.VITE_APP_TRR_API_URL_REPORT;
  const ReportViewer = "/Pages/ReportViewer.aspx?/";
  const [showIframe, setShowIframe] = React.useState(false);

  const preViewReport = async () => {

    if (dataelement) {
        setTimeout(() => {
          setShowIframe(true);
        }, 0.1);
        
    }

  }
//----------https://trr-rep.trrgroup.com/ReportServer/Pages/ReportViewer.aspx?/SCSS_DEV/DEV/Report/Quota3_Bene

  React.useEffect(() => {
    preViewReport()
  }, [])


  return (
    <div className="col-12 px-5 h-auto w-auto">
      {showIframe && (
        <iframe
          height="600"
          width="100%"
          src={`${VITE_APP_TRR_API_URL_REPORT}${ReportViewer}${VITE_APP_SITE}/${VITE_APP}/${VITE_SITE_PATH}/Report/${dataelement?.report_code}`}>
        </iframe>
      )}
    </div>
  );
}

