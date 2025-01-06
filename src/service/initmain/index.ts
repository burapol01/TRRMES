// sessionStorageUtils.ts
interface CurrentAccess {
    domain_id?: string;
    session_id?: string;
    user_id?: string;
    access_type?: string;
    client_ip?: string;
    public_ip?: string;
    app_name?: string;
    version_no?: string;
    browser?: string;
    access_status?: string;
    status_desc?: string;
    employeeUsername?: string;
    screenName?: string;
    employeeDomain?: string;
    [key: string]: any; // สำหรับคีย์เพิ่มเติมที่ไม่รู้จัก
}

/** // ฟังก์ชันในการดึงและทำความสะอาดข้อมูลจาก sessionStorage
 * Retrieves and cleans up data from sessionStorage by key.
 * @param {string} key - The sessionStorage key to retrieve and clean up.
 * @returns {any | null} - Returns the parsed object or null if parsing fails.
 */
export function cleanAccessData(key: string): any | null {
    const storedAccessData = sessionStorage.getItem(key);
    if (storedAccessData) {
        try {
            // Attempt to parse JSON data directly
            return JSON.parse(storedAccessData);
        } catch (error) {
            // Cleanup: Remove backslashes and control characters if initial parsing fails
            const cleanedData = storedAccessData.replace(/\\/g, '').replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
            try {
                return JSON.parse(cleanedData);
            } catch (error) {
                console.error('Error parsing JSON after cleanup:', error);
                return null;
            }
        }
    } else {
        console.log(`No value found in sessionStorage for ${key}.`);
        return null;
    }
}


export function updateSessionStorageCurrentAccess(current_access_key: string, current_access_value: any): boolean {
    const storedAccessData = sessionStorage.getItem('current_access');
    let current_access: CurrentAccess | null = storedAccessData ? JSON.parse(storedAccessData) : null;

    if (current_access) {
        current_access[current_access_key] = current_access_value;
        sessionStorage.setItem("current_access", JSON.stringify(current_access));
        //console.log('Updated current_access:', current_access);
        return true; // การอัปเดตสำเร็จ
    } else {
        console.log('No current_access data found in sessionStorage.');
        return false; // ไม่พบข้อมูลสำหรับการอัปเดต
    }
}



/**
 * Retrieves the currentAccessObject from sessionStorage.
 * If no data exists, it returns a default object with user_id, app_name, and event_name.
 */
export function getCurrentAccessObject(employeeUsername: string, employeeDomain: string, screenName: string)
    : CurrentAccess {
    const storedAccessData = sessionStorage.getItem('current_access');
    const currentAccessObject = storedAccessData ? JSON.parse(storedAccessData) : {
        app_name: import.meta.env.VITE_APP_APPLICATION_CODE,
        domain_id: employeeDomain,
        screen_name: screenName,
        event_name: "No Current Access",
        user_id: employeeUsername,
    };
    console.log(currentAccessObject, 'currentAccessObject');
    return currentAccessObject;
}
