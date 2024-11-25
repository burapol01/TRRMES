import axios from "axios";
import imageCompression from "browser-image-compression";

export async function plg_uploadFileRename(element: File, path: string, rename: string) {
  // Validate the file input
  if (!(element instanceof File)) {
    console.error("Invalid file element provided");
    return;
  }

  console.log(import.meta.env.VITE_PROD_SITE, 'import.meta.env.VITE_PROD_SITE');

  // Get the file extension from the original file name
  const fileExtension = element.name.split(".").pop()?.toLowerCase();
  const fullRename = `${rename}.${fileExtension}`; // Append extension to rename

  // Check if the file is an image (PNG, JPG, or JPEG) and compress it
  const allowedExtensions = ["png", "jpg", "jpeg"];
  let fileToUpload = element;

  if (fileToUpload.type.startsWith("image/") && allowedExtensions.includes(fileExtension!)) {
    const options = {
      maxSizeMB: 1, // Set maximum file size (e.g., 1MB)
      maxWidthOrHeight: 1024, // Set maximum width or height for images
      useWebWorker: true,
    };

    try {
      fileToUpload = await imageCompression(fileToUpload, options);
      console.log("Image compressed successfully:", fileToUpload.size / 1024, "KB");
    } catch (error) {
      console.error("Error during image compression:", error);
      // If compression fails, continue with the original file
    }
  }

  // Prepare FormData for upload
  const data = new FormData();
  data.append("postedFile", fileToUpload);
  data.append("renamefile", fullRename); // Use fullRename with extension

  const viralPath = `\\\\10.100.77.237\\it\\AppUpload\\${import.meta.env.VITE_APP_APPLICATION_CODE}\\${import.meta.env.VITE_PROD_SITE}\\ServiceRequest\\${path}\\`;
  data.append("viral", viralPath);
  data.append("Pro@dmin785", "");

  // Define the request configuration
  const source = axios.CancelToken.source();
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_APP_TRR_API_URL_UPLOAD}/api_sys_tools/api_tool_upload/Upload/UploadFileRename`,
    data: data,
    timeout: 30000, // Increase timeout to 30 seconds or more
    cancelToken: source.token,
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
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.log("File upload was canceled.");
    } else if (error.code === 'ECONNABORTED') {
      console.error("Request timed out.");
      // Optionally implement retry logic or increase the timeout
    } else {
      console.error("Error during file upload:", error);
    }
  }

  // Optional: Cancel the request if needed
  return () => {
    source.cancel("Operation canceled by the user.");
  };
}
