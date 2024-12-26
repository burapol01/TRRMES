import axios from "axios";
import imageCompression from "browser-image-compression";

export async function plg_uploadFileRename(
  element: File,
  path: string,
  rename: string,
  headFolderName: string,
  fileType?: string[]
) {
  if (!(element instanceof File)) {
    console.error("Invalid file element provided.");
    return { success: false, message: "Invalid file element provided." };
  }

  const originalFileName = element.name;
  const originalFileExtension = originalFileName.split(".").pop()?.toLowerCase();

  if (!originalFileExtension) {
    console.error("Unable to determine the file extension.");
    return { success: false, message: "Unable to determine the file extension." };
  }

  let fileToUpload: File = element;

  // เพิ่มตัวเลือกการข้ามการบีบอัดไฟล์เพื่อประหยัดเวลา
  const allowedImageExtensions = ["png", "jpg", "jpeg"];
  if (
    fileToUpload.type.startsWith("image/") &&
    allowedImageExtensions.includes(originalFileExtension) &&
    fileToUpload.size > 1024 * 1024 // บีบอัดเฉพาะไฟล์ที่ใหญ่กว่า 1MB
  ) {
    try {
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true };
      const compressedBlob = await imageCompression(fileToUpload, options);
      fileToUpload = new File([compressedBlob], originalFileName, {
        type: element.type,
        lastModified: element.lastModified,
      });
    } catch (error) {
      console.error("Error during image compression:", error);
      return { success: false, message: "Error during image compression." };
    }
  }

  if (fileType && !fileType.includes(originalFileExtension)) {
    console.error(`Invalid file type. Allowed types: ${fileType.join(", ")}`);
    return { success: false, message: "Invalid file type." };
  }

  // Validate environment variables
  const appCode = import.meta.env.VITE_APP_APPLICATION_CODE;
  const prodSite = import.meta.env.VITE_PROD_SITE;
  const apiUploadUrl = import.meta.env.VITE_APP_TRR_API_URL_UPLOAD;

  if (!appCode || !prodSite || !apiUploadUrl) {
    console.error("Missing required environment variables.");
    return { success: false, message: "Missing required environment variables." };
  }

  const data = new FormData();
  data.append("postedFile", fileToUpload);
  data.append("renamefile", rename);
  data.append(
    "viral",
    `\\\\10.100.77.237\\it\\AppUpload\\${appCode}\\${prodSite}\\${headFolderName}\\${path}\\`
  );

  const source = axios.CancelToken.source();
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${apiUploadUrl}/api_sys_tools/api_tool_upload/Upload/UploadFileRename`,
    data,
    timeout: 60000, // ลด Timeout ให้เหมาะสม
    cancelToken: source.token,
  };

  try {
    const response = await axios.request(config);
    if (response.status === 200) {
      console.log("Upload successful:", response.data);
      return { success: true, data: response.data };
    }
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.log("File upload was canceled.");
      return { success: false, status: "canceled", message: "Upload canceled by user." };
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timed out.");
      return { success: false, message: "Request timed out." };
    } else {
      console.error("Error during file upload:", error);
      return { success: false, message: "Error during file upload.", error };
    }
  }
}
