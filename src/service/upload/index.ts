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
    return;
  }

  // Get the original file name and extension
  const originalFileName = element.name;
  const originalFileExtension = originalFileName.split(".").pop()?.toLowerCase();

  if (!originalFileExtension) {
    console.error("File extension could not be determined.");
    return;
  }

  
  let fileToUpload: File = element;

  // Compress image if it's an image file
  const allowedImageExtensions = ["png", "jpg", "jpeg"];
  if (
    fileToUpload.type.startsWith("image/") &&
    allowedImageExtensions.includes(originalFileExtension)
  ) {
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      // Compress the image
      const compressedBlob = await imageCompression(fileToUpload, options);

      // Create a new File with the original name and type
      fileToUpload = new File([compressedBlob], originalFileName, {
        type: element.type, // Preserve the original type
        lastModified: element.lastModified, // Preserve original timestamp
      });
    } catch (error) {
      console.error("Error during image compression:", error);
      return;
    }
  }

  if (fileType && !fileType.includes(originalFileExtension)) {
    console.error("Invalid file type. Allowed types:", fileType.join(", "));
    return;
  }

  // Log the files to inspect their content
  console.log(element, "fileToUpload (processed)");
  console.log(fileToUpload, "fileToUpload (processed)");

  // Prepare the data to send
  const data = new FormData();
  data.append("postedFile", fileToUpload); // Send the processed (possibly compressed) file
  data.append("renamefile", rename); // The rename (optional)
  data.append(
    "viral",
    `\\\\10.100.77.237\\it\\AppUpload\\${import.meta.env.VITE_APP_APPLICATION_CODE}\\${import.meta.env.VITE_PROD_SITE}\\${headFolderName}\\${path}\\`
  );

  const source = axios.CancelToken.source();
  const config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${import.meta.env.VITE_APP_TRR_API_URL_UPLOAD}/api_sys_tools/api_tool_upload/Upload/UploadFileRename`,
    data,
    timeout: 30000,
    cancelToken: source.token,
  };

  try {
    const response = await axios.request(config);
    if (response.status === 200) {
      console.log("Upload successful:", response.data);
      return response.data;
    } else {
      console.error("Upload failed with status:", response.status);
    }
  } catch (error: any) {
    if (axios.isCancel(error)) {
      console.log("File upload was canceled.");
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timed out.");
    } else {
      console.error("Error during file upload:", error);
    }
  }

  return () => {
    source.cancel("Operation canceled by the user.");
  };
}
