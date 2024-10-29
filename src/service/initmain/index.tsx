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
    [key: string]: any; // สำหรับคีย์เพิ่มเติมที่ไม่รู้จัก
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
