import axios from "axios";
import { log } from "console";

export async function plg_uploadFileRename(element: File, path: string, rename: string) {
  // Validate the file input
  if (!(element instanceof File)) {
    console.error("Invalid file element provided");
    return;
  }

  console.log(import.meta.env.VITE_PROD_SITE,'import.meta.env.VITE_PROD_SITE');
  

  // Prepare FormData for upload
  const data = new FormData();
  data.append("postedFile", element);
  data.append("renamefile", rename);
  
  const viralPath = `\\\\10.100.77.237\\it\\AppUpload\\TRR-MES\\${import.meta.env.VITE_PROD_SITE}\\ServiceRequest\\${path}\\`;
  data.append("viral", viralPath);
  data.append("Pro@dmin785", "");

  // Define the request configuration
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_APP_TRR_API_URL_UPLOAD}/api_sys_tools/api_tool_upload/Upload/UploadFileRename`,
    data: data,
    timeout: 10000, // Set a timeout of 10 seconds
  };

  try {
    // Start the upload
    const response = await axios.request(config);
    
    // Check response status
    if (response.status === 200) {
      console.log(response.data);
      return response.data;
    } else {
      console.error("Upload failed with status:", response.status);
    }
  } catch (error) {
    console.error("Error during file upload:", error);
    // Implement retry logic if needed
  }
}
