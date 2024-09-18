import dayjs from "dayjs";
import moment from "moment";
export function _formatNumber(input) {
    const value = String(input).replace(/[^0-9.-]/g, "");
    const number = Number(value);
    if (!isNaN(number)) {
        const formattedNumber = number.toFixed(2);
        return formattedNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    else {
        return "";
    }
}
export function _formatNumberNotdecimal(input) {
    const value = String(input).replace(/[^0-9.]/g, "");
    const number = parseFloat(value);
    if (!isNaN(number)) {
        return number.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
    else {
        return "";
    }
}
export function removeCommas(input) {
    if (typeof input === 'string') {
        // ใช้ replace() เพื่อลบเครื่องหมายจุลภาค (,) ทั้งหมดออกจากข้อความ
        return input.replace(/,/g, "");
    }
    else {
        return input;
    }
}
export function stringWithCommas(input) {
    const stringWithoutCommas = input.replace(/,/g, ""); // Remove commas
    const numberValue = parseInt(stringWithoutCommas, 10);
    if (!isNaN(numberValue)) {
        // Format the number with commas
        return numberValue;
    }
    else {
        // If the input is not a valid number, clear the input field
        return "";
    }
}
export const dateFormatSlashReturnMUI = (date) => {
    // data DD/MM/YYYY
    if (date == null) {
        return null;
    }
    try {
        const newdate = dayjs(date, "DD/MM/YYYY");
        return newdate;
    }
    catch {
        return null;
    }
};
export const dateFormatTime = (date, format) => {
    if (date == null) {
        return "";
    }
    try {
        const newdate = dayjs(date);
        return dayjs(newdate).format(format);
    }
    catch {
        return "";
    }
};
export const dateFormatTimeTH = (date, format) => {
    if (date == null) {
        return "";
    }
    try {
        let newdate = dayjs(date);
        newdate = newdate.add(543, 'year');
        return dayjs(newdate).format(format);
    }
    catch {
        return "";
    }
};
export const dateFormatTimeEN = (date, format) => {
    if (date == null) {
        return "";
    }
    try {
        let newdate = dayjs(date);
        return dayjs(newdate).format(format);
    }
    catch {
        return "";
    }
};
export const DateToDB = (date) => {
    if (!date) {
        return ""; // Return an empty string if the date is null or undefined
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
    }
    catch (error) {
        console.error("Invalid date format:", error);
        return ""; // Return an empty string if there is an error during conversion
    }
};
