import dayjs from "dayjs";
import moment from "moment";

export function _formatNumber(input: any) {
  const value = String(input).replace(/[^0-9.-]/g, "");

  const number = Number(value);

  if (!isNaN(number)) {
    const formattedNumber = number.toFixed(2);
    return formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return "";
  }
}

// สำหรับกรอกแค่ตัวเลข
export function _number(input: any) {
  const value = String(input).replace(/[^0-9]/g, "");
  const number = parseFloat(value);

  if (!isNaN(number)) {
    const formattedNumber = number;
    return formattedNumber;
  } else {
    return "";
  }
}

// ทศนิยม
export function _formatNumberNotdecimal(input: any) {
  const value = String(input).replace(/[^0-9.]/g, "");

  const number = parseFloat(value);

  if (!isNaN(number)) {
    return number.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  } else {
    return "";
  }
}

export function removeCommas(input: any) {
  if (typeof input === 'string') {
    // ใช้ replace() เพื่อลบเครื่องหมายจุลภาค (,) ทั้งหมดออกจากข้อความ
    return input.replace(/,/g, "");
  } else {
    return input;
  }

}

export function stringWithCommas(input: any) {
  const stringWithoutCommas = input.replace(/,/g, ""); // Remove commas
  const numberValue = parseInt(stringWithoutCommas, 10);
  if (!isNaN(numberValue)) {
    // Format the number with commas
    return numberValue;
  } else {
    // If the input is not a valid number, clear the input field
    return "";
  }
}

type Format = "DD/MM/YYYY" | "DD/MM/YYYY HH:mm:ss" | "YYYY/MM/DD" | "YYYY-MM-DD" | "YYYY-MM-DD HH:mm:ss" | "YYYY-MM-DD HH:mm:ss:SSS";

export const dateFormatSlashReturnMUI = (date: any, format: Format) => {
  if (date == null) {
    return null;
  }

  try {
    const newDate = dayjs(date, format, true);
    if (!newDate.isValid()) {
      console.warn("dateFormatSlashReturnMUI : Invalasid date format. Returning null.");
      return null;
    }
    return newDate;
  } catch {
    return null;
  }
};

export const dateFormatTime = (date: any, format: Format) => {
  if (date == null) {
    return "";
  }
  try {
    const newdate = dayjs(date)
    return dayjs(newdate).format(format);
  } catch {
    return "";
  }
};

export const dateFormatTimeTH = (date: any, format: Format) => {
  if (date == null) {
    return "";
  }
  try {
    let newdate = dayjs(date)
    newdate = newdate.add(543, 'year');
    return dayjs(newdate).format(format);
  } catch {
    return "";
  }

};

export const dateFormatTimeEN = (date: any, format: Format) => {
  if (date == null) {
    return "";
  }
  try {
    let newdate = dayjs(date)
    return dayjs(newdate).format(format);
  } catch {
    return "";
  }

};

export const DateToDB = (date: any): string => {
  if (!date) {
    return "";  // Return an empty string if the date is null or undefined
  }
  try {
    // Parse the date using moment, assuming the input is in "DD/MM/YYYY HH:mm:ss" format
    const newDate = moment(date, "DD/MM/YYYY HH:mm:ss");

    // Check if the date is valid
    if (!newDate.isValid()) {
      throw new Error("Invalid date");
    }

    // Adjust the time to UTC+7 (Thailand)
    const adjustedDate = newDate.utcOffset(7);

    // Return the adjusted date in ISO 8601 format with the +07:00 timezone
    return adjustedDate.format("YYYY-MM-DDTHH:mm:ss.SSS") + "+07:00";
  } catch (error) {
    console.error("Invalid date format:", error);
    return ""; // Return an empty string if there is an error during conversion
  }
};

//ลักไก่ไปก่อน ถ้า Edge จะได้ Client ip ส่วน Chrome จะได้ public ip

export const fetchIpAddress = async (): Promise<string> => {
  return new Promise((resolve) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    pc.createDataChannel('');

    pc.createOffer()
      .then(offer => pc.setLocalDescription(offer))
      .catch(() => resolve(""));

    pc.onicecandidate = (event) => {
      if (!event || !event.candidate) return;

      const candidate = event.candidate.candidate;
      console.log(candidate);
      // Only look for UDP host candidates
      if (candidate.indexOf('udp') === -1) return;
      
      const ipv4Match = candidate.match(/\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/);
      if (ipv4Match) {
        resolve(ipv4Match[0]);
        pc.close();
      }
    };

    setTimeout(() => {
      resolve("");
      pc.close();
    }, 3000);
  });
};
