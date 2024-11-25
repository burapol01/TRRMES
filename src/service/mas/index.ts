import axios from "axios";


export async function _GET(datasend:any, path:string) {
  const url = `${
    import.meta.env.VITE_APP_TRR_API_URL
  }${path}`;
  
  const datasent = {
    data: datasend,
  };

  try {
    const res = await axios.post(url, datasent);
    const data = res.data;
    if(data && data.status == "success"){
      return data.data;
    }
  } catch {
    return false;
  }
}

export async function _GET_SCSS(datasend:any, path:string) {
  const url = `${
    import.meta.env.VITE_APP_TRR_API_URL_SCSS
  }${path}`;
  
  const datasent = {
    data: datasend,
  };

  try {
    const res = await axios.post(url, datasent);
    const data = res.data;
    if(data && data.status == "success"){
      return data.data;
    }
  } catch {
    return false;
  }
}

export async function _POST(datasend:any, path:string) {
  const url = `${
    import.meta.env.VITE_APP_TRR_API_URL
  }${path}`;
  
  const datasent = {
    ...datasend,
  };

  try {
    const res = await axios.post(url, datasent);
    const data = res.data;
    if(data && data.status == "success"){
      return data;
    }else if(data && data.status == "error") {
      return data;
    }
  } catch {
    return false;
  }
}

export async function _exportFileRequest(datasend:any, path:string) {
  const url = `${import.meta.env.VITE_APP_TRR_API_URL}${path}`;

  try {
    // ส่งคำขอไปยัง API ด้วย fetch
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datasend),
    });

    // ตรวจสอบสถานะของการตอบกลับ
    if (response.ok) {
      // ดึง Blob ที่ตอบกลับมาจาก API
      const blob = await response.blob();

      // คุณสามารถจัดการกับ blob ที่ได้รับจาก API เช่น ดาวน์โหลดไฟล์
      return { status: 'success', data: blob };
    } else {
      // หากเกิดข้อผิดพลาดใน API (สถานะไม่ใช่ 200 OK)
      const errorData = await response.json();
      return { status: 'error', message: errorData.message || 'Unexpected error' };
    }
  } catch (error) {
    console.error("Export file request failed:", error);
    return { status: 'error', message: 'Network or server error' };
  }
}




export async function _GET_ORGREPORT(datasend:any, path:string) {
  const url = `${
    import.meta.env.VITE_APP_TRR_API_URL_ORGREPORT
  }${path}`;
  
  try {
    const res = await axios.post(url, datasend);
    const data = res.data;
    if(data && data.status == "success"){
      return data.data;
    }
  } catch {
    return false;
  }
}


