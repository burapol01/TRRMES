import axios from "axios";


export async function plg_uploadFileRename(
  element: any,
  path: string,
  rename: string
) {
  const data = new FormData();
  const getFile = element;


  const configLogin = import.meta.env.VITE_APP_TRR_API_CONFIG_LOGIN;
  const jsonString = "{" + configLogin + "}";
  const obj = Function("return " + jsonString)();

  console.log(obj,'obj');
  

  data.append("postedFile", getFile);
  data.append("renamefile", rename);
  data.append(
    "viral",
    `\\\\\\\\10.100.77.237\\\\it\\\\AppUpload\\\\TRR-MES\\\\${import.meta.env.VITE_PROD_SITE}\\\\\ServiceRequest\\\\${path}\\\\`
  );
  data.append("Pro@dmin785", "");

  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_APP_TRR_API_URL_UPLOAD
      }/api_sys_tools/api_tool_upload/Upload/UploadFileRename`,
    data: data,
  };

  try {
    const reponse = await axios.request(config);
    if (reponse.status == 200) {
      console.log(reponse.data);
      return reponse.data;
    }
  } catch (e) {
    console.log(e);
  }
}