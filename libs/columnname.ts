export const Request_headCells = [
    {
        columnName: 'ACTION',
        numeric: 'center',
        disablePadding: true,
        label: 'จัดการ',
        colWidth: 150
    },
    {
        columnName: 'req_no',
        numeric: 'center',
        disablePadding: true,
        label: 'เลขที่ใบคำขอ',
        colWidth: 185
    },
    {
        columnName: 'req_status_label',
        numeric: 'center',
        disablePadding: true,
        label: 'สถานะ',
        colWidth: 150
    },
    {
        columnName: 'req_date',
        numeric: 'center',
        disablePadding: true,
        label: 'วันที่สร้างใบคำขอ',
        colWidth: 200
    },
    {
        columnName: 'cost_center_label',
        numeric: 'left',
        disablePadding: true,
        label: 'Cost Center',
        colWidth: 300
    },
    {
        columnName: 'service_center_label',
        numeric: 'left',
        disablePadding: true,
        label: 'Service Center',
        colWidth: 300
    },
    {
        columnName: 'job_type_name',
        numeric: 'center',
        disablePadding: true,
        label: 'ประเภทงาน',
        colWidth: 100
    },
    {
        columnName: 'fixed_asset_label',
        numeric: 'left',
        disablePadding: true,
        label: 'Fixed Asset Description',
        colWidth: 300
    },
    {
        columnName: 'description',
        numeric: 'left',
        disablePadding: true,
        label: 'รายละเอียด',
        colWidth: 300
    },
    {
        columnName: 'total_work_hours',
        numeric: 'center',
        disablePadding: true,
        label: 'ชั่วโมงการทำงานรวม',
        colWidth: 150
    },
    {
        columnName: 'req_user',
        numeric: 'center',
        disablePadding: true,
        label: 'คนที่สร้างคำขอ',
        colWidth: 150
    },
    {
        columnName: 'app_user',
        numeric: 'center',
        disablePadding: true,
        label: 'คนที่อนุมัติ',
        colWidth: 150
    },
    {
        columnName: 'count_revision',
        numeric: 'center',
        disablePadding: true,
        label: 'Current Revision',
        colWidth: 150
    },
    {
        columnName: 'status_update',
        numeric: 'center',
        disablePadding: true,
        label: 'วันที่อัพเดทสถานะล่าสุด',
        colWidth: 200
    },
    // {
    //     columnName: 'create_by',
    //     numeric: 'center',
    //     disablePadding: true,
    //     label: 'สร้างโดย',
    //     colWidth: 300
    // },
    // {
    //     columnName: 'create_date',
    //     numeric: 'center',
    //     disablePadding: true,
    //     label: 'วันที่สร้าง',
    //     colWidth: 300
    // },
    // {
    //     columnName: 'update_by',
    //     numeric: 'center',
    //     disablePadding: true,
    //     label: 'อัพเดตโดย',
    //     colWidth: 300
    // },
    // {
    //     columnName: 'update_date',
    //     numeric: 'center',
    //     disablePadding: true,
    //     label: 'วันที่อัพเดต',
    //     colWidth: 300
    // },
    // {
    //     columnName: 'record_status',
    //     numeric: 'center',
    //     disablePadding: true,
    //     label: 'สถานะ',
    //     colWidth: 300
    // }
];

export const Time_Sheet_headCells = [

    {
        columnName: 'no',
        numeric: 'center',
        disablePadding: true,
        label: 'ลำดับ',
        colWidth: 100
    },
    {
        columnName: 'work_start_date',
        numeric: 'center',
        disablePadding: true,
        label: 'วันเริ่มต้น',
        colWidth: 150
    },
    {
        columnName: 'work_end_date',
        numeric: 'center',
        disablePadding: true,
        label: 'วันสิ้นสุด',
        colWidth: 150
    },
    {
        columnName: 'technician',
        numeric: 'left',
        disablePadding: true,
        label: 'ช่าง',
        colWidth: 300
    },
    {
        columnName: 'work_hour',
        numeric: 'center',
        disablePadding: true,
        label: 'ชั่วโมงทำงาน',
        colWidth: 100
    },
    {
        columnName: 'description',
        numeric: 'left',
        disablePadding: true,
        label: 'รายละเอียด',
        colWidth: 300
    },

    {
        columnName: 'delete',
        numeric: 'center',
        disablePadding: true,
        label: 'จัดการ',
        colWidth: 100
    },


]

export const Table_Pending_headCells = [

    {
        columnName: 'no',
        numeric: 'center',
        disablePadding: true,
        label: 'ลำดับ',
        colWidth: 100
    },
    {
        columnName: 'pending_by',
        numeric: 'center',
        disablePadding: true,
        label: 'ผู้บันทึก : รอดำเนินการ',
        colWidth: 100
    },
    {
        columnName: 'pending_s_date',
        numeric: 'center',
        disablePadding: true,
        label: 'วันที่เริ่มรอดำเนินการ',
        colWidth: 150
    },
    {
        columnName: 'pending_e_date',
        numeric: 'center',
        disablePadding: true,
        label: 'วันที่คาดว่าจะดำเนินการต่อ',
        colWidth: 150
    },
    {
        columnName: 'unpending_by',
        numeric: 'center',
        disablePadding: true,
        label: 'ผู้บันทึก : ปลดรอดำเนินการ',
        colWidth: 100
    },
    {
        columnName: 'unpending_date',
        numeric: 'center',
        disablePadding: true,
        label: 'วันที่ปลดรอดำเนินการ',
        colWidth: 150
    },

    {
        columnName: 'reason',
        numeric: 'left',
        disablePadding: true,
        label: 'หมายเหตุ',
        colWidth: 100
    },


]

export const MasterUser_headCells = [
    {
        columnName: 'ACTION',
        numeric: 'center',
        disablePadding: true,
        label: 'จัดการ',
        colWidth: 150
    },
    {
        columnName: 'user_ad',
        numeric: 'center',
        disablePadding: true,
        label: 'User Ad',
        colWidth: 150
    },
    {
        columnName: 'user_name',
        numeric: 'left',
        disablePadding: true,
        label: 'ชื่อผู้ใช้งาน',
        colWidth: 300
    },
    {
        columnName: 'cost_center_label',
        numeric: 'left',
        disablePadding: true,
        label: 'Cost Center',
        colWidth: 300
    },
    {
        columnName: 'service_center_label',
        numeric: 'left',
        disablePadding: true,
        label: 'Service Center',
        colWidth: 300
    },
    {
        columnName: 'site_code',
        numeric: 'center',
        disablePadding: true,
        label: 'Site',
        colWidth: 100
    },
    {
        columnName: 'app_req_user',
        numeric: 'center',
        disablePadding: true,
        label: 'คนอนุมัติ',
        colWidth: 150
    },
    {
        columnName: 'create_by',
        numeric: 'center',
        disablePadding: true,
        label: 'สร้างโดย',
        colWidth: 150
    },
    {
        columnName: 'create_date',
        numeric: 'center',
        disablePadding: true,
        label: 'วันที่สร้าง',
        colWidth: 200
    },
    {
        columnName: 'update_by',
        numeric: 'center',
        disablePadding: true,
        label: 'แก้ไขโดย',
        colWidth: 150    
    },
    {
        columnName: 'update_date',
        numeric: 'center',
        disablePadding: true,
        label: 'วันที่แก้ไข',
        colWidth: 200
    }
];

export const Master_Cost_Center = [
    {
        columnName: 'ACTION',
        numeric: 'center',
        disablePadding: true,
        label: 'จัดการ',
        colWidth: 150
    },
    {
        columnName: 'site_code',
        numeric: 'center',
        disablePadding: true,
        label: 'Site',
        colWidth: 100
    },
    {
        columnName: 'cost_center_code',
        numeric: 'center',
        disablePadding: true,
        label: 'Cost Center Code',
        colWidth: 200
    },
    {
        columnName: 'cost_center_name',
        numeric: 'center',
        disablePadding: true,
        label: 'ชื่อ Cost Center',
        colWidth: 300
    },
    {
        columnName: 'app_req_user',
        numeric: 'center',
        disablePadding: true,
        label: 'ผู้อนุมัติ',
        colWidth: 150
    },
    {
        columnName: 'service_center_flag_',
        numeric: 'center',
        disablePadding: true,
        label: 'Service Center',
        colWidth: 200
    },
    {
        columnName: 'create_date',
        numeric: 'center',
        disablePadding: true,
        label: 'วันที่สร้าง',
        colWidth: 300
    },
    {
        columnName: 'create_by',
        numeric: 'center',
        disablePadding: true,
        label: 'สร้างโดย',
        colWidth: 150
    },
    {
        columnName: 'update_date',
        numeric: 'center',
        disablePadding: true,
        label: 'วันที่แก้ไข',
        colWidth: 300
    },
    {
        columnName: 'update_by',
        numeric: 'center',
        disablePadding: true,
        label: 'แก้ไขโดย',
        colWidth: 150    
    },
    
];

export const Master_Budget = [
    {
        columnName: 'ACTION',
        numeric: 'center',
        disablePadding: true,
        label: 'จัดการ',
        colWidth: 150
    },
    {
        columnName: 'budget_code',
        numeric: 'center',
        disablePadding: true,
        label: 'รหัสงบประมาณ',
        colWidth: 200
    },
    {
        columnName: 'description',
        numeric: 'center',
        disablePadding: true,
        label: 'Description',
        colWidth: 350
    },
    // {
    //     columnName: 'cost_center_id',
    //     numeric: 'center',
    //     disablePadding: true,
    //     label: 'Cost Center ID',
    //     colWidth: 300
    // },
    {
        columnName: 'jop_type',
        numeric: 'center',
        disablePadding: true,
        label: 'ซ่อม / สร้าง ',
        colWidth: 200
    },
    {
        columnName: 'budget_s_date',
        numeric: 'center',
        disablePadding: true,
        label: 'วันที่เริ่ม Budget',
        colWidth: 300
    },
    {
        columnName: 'budget_e_date',
        numeric: 'center',
        disablePadding: true,
        label: 'วันที่สิ้นสุด Budget',
        colWidth: 300
    },
    {
        columnName: 'create_by',
        numeric: 'center',
        disablePadding: true,
        label: 'สร้างโดย',
        colWidth: 150
    },   
    {
        columnName: 'create_date',
        numeric: 'center',
        disablePadding: true,
        label: 'วันที่สร้าง',
        colWidth: 300
    },
    {
        columnName: 'update_by',
        numeric: 'center',
        disablePadding: true,
        label: 'อัพเดตโดย',
        colWidth: 150    
    },
    {
        columnName: 'update_date',
        numeric: 'center',
        disablePadding: true,
        label: 'วันที่อัพเดต',
        colWidth: 300
    },
];

export const Master_Fixed_Asset = [
    {
        columnName: 'ACTION',
        numeric: 'center',
        disablePadding: true,
        label: 'จัดการ',
        colWidth: 150
    },
    {
        columnName: 'fixed_asset_code',
        numeric: 'center',
        disablePadding: true,
        label: '...........',
        colWidth: 100
    },
    {
        columnName: 'description',
        numeric: 'center',
        disablePadding: true,
        label: 'รายละเอียดงบประมาณ',
        colWidth: 200
    },
    {
        columnName: 'cost_center_id',
        numeric: 'center',
        disablePadding: true,
        label: '...........',
        colWidth: 300
    },
    {
        columnName: 'fixed_asset_status',
        numeric: 'center',
        disablePadding: true,
        label: 'New / Transfer In / Transfer Out / Disposal LOV',
        colWidth: 150
    },
    {
        columnName: 'create_by',
        numeric: 'center',
        disablePadding: true,
        label: 'สร้างโดย',
        colWidth: 150
    },   
    {
        columnName: 'create_date',
        numeric: 'center',
        disablePadding: true,
        label: 'วันที่สร้าง',
        colWidth: 300
    },
    {
        columnName: 'update_by',
        numeric: 'center',
        disablePadding: true,
        label: 'อัพเดตโดย',
        colWidth: 150    
    },
    {
        columnName: 'update_date',
        numeric: 'center',
        disablePadding: true,
        label: 'วันที่อัพเดต',
        colWidth: 300
    },
];

export const Master_Site = [
    {
        columnName: 'ACTION',
        numeric: 'center',
        disablePadding: true,
        label: 'จัดการ',
        colWidth: 150
    },
    {
        columnName: 'site_code',
        numeric: 'center',
        disablePadding: true,
        label: 'Site',
        colWidth: 150
    },
    {
        columnName: 'site_name',
        numeric: 'center',
        disablePadding: true,
        label: 'ชื่อ Site',
        colWidth: 200
    },
    {
        columnName: 'domain',
        numeric: 'center',
        disablePadding: true,
        label: '...........',
        colWidth: 300
    },
    {
        columnName: 'create_by',
        numeric: 'center',
        disablePadding: true,
        label: 'สร้างโดย',
        colWidth: 150
    },   
    {
        columnName: 'create_date',
        numeric: 'center',
        disablePadding: true,
        label: 'วันที่สร้าง',
        colWidth: 300
    },
    {
        columnName: 'update_by',
        numeric: 'center',
        disablePadding: true,
        label: 'อัพเดตโดย',
        colWidth: 150    
    },
    {
        columnName: 'update_date',
        numeric: 'center',
        disablePadding: true,
        label: 'วันที่อัพเดต',
        colWidth: 300
    },
];