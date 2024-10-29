// import React, { useEffect, useState } from 'react'
// import FullWidthTextField from '../../../../components/MUI/FullWidthTextField'
// import AutocompleteComboBox from '../../../../components/MUI/AutocompleteComboBox'
// import FullWidthButton from '../../../../components/MUI/FullWidthButton'
// import { Switch } from '@mui/material'
// import CustomizedSwitches from '../../../../components/MUI/MaterialUISwitch'
// import { useListConCenter } from '../core/CostCenterProvider'
// import { _GET, _POST } from '../../../../service'
// import moment from 'moment'

// //======================== OptionsState ข้อมูล Drop Down ==========================
// /* --------- ให้สร้าง interface optionsState เพื่อระบุประเภท (Type) --------- */
// interface OptionsState {
//     masterSite: any[];
// }

// const initialOptions: OptionsState = {
//     masterSite: [],
// };

// //=================================== set ข้อมูล  ==================================
// //------------------- ประกาศค่าเริ่มต้น
// const initialCostCenterValues = { //-----สร้างหน้าใหม่ให้เปลี่ยนแค่ชื่อ
//     siteOptions: "",
//     costcenterCode: "",
//     costcenterName: "",
//     appreqUser: "",
// };

// export default function SearchCostCenter() {

//     //========================= SearchCostCenter ช่องค้นหาข้อมูล ==============================================
//     const [costcenterCode, setCostCenterCode] = useState("");
//     const [costcenterName, setCostCenterName] = useState("");
//     const [appreqUser, setAppReqUser] = useState("");
//     const { siteOptions, setSiteOptions } = useListConCenter();
//     const { dataCostCenter, setDataCostCenter } = useListConCenter();
//     const [optionsSearch, setOptionsSearch] = useState<OptionsState>(initialOptions); // State for combobox options
//     const [options, setOptions] = useState<OptionsState>(initialOptions); // State for combobox options
//     const [actionType, setActionType] = useState<string | null>(null); // Corrected type
//     const [error, setError] = useState<string | null>(null); // แสดงสถานะสำหรับข้อผิดพลาด 

//     //============================== useState ข้อมูลเริ่มต้น / ข้อมูลตาราง ========================================
//     //------------------- State to store default values รับและส่ง
//     const [defaultValues, setDefaultValues] = useState(initialCostCenterValues);

//     //==================================== useState Validate  =====================================
//     const { isValidate, setIsValidate } = useListConCenter();

//     //============================= เริ่มการทำงาน หน้าค้นหาข้อมูล =========================================
//     useEffect(() => {
//         console.log('Call : 🟢[1] Search fetch Master Data', moment().format('HH:mm:ss:SSS'));
//         const initFetch = async () => {
//             // try {
//             //     await searchFetchMasterCostCenter(); // เรียกใช้ฟังก์ชันเมื่อ component ถูกเรนเดอร์ครั้งแรก
//             // } catch (error) {
//             //     console.error('Error in initFetch:', error);
//             // }
//         };

//         initFetch();
//     }, []); // [] หมายถึงการรันแค่ครั้งเดียวตอนคอมโพเนนต์ถูก mount


//     //============================= เริ่มการทำงาน handleClick =================================================
//     //------------------- ค้นหาข้อมูล
//     const handleSearch = () => {
//         setActionType('search');
//     };

//     //------------------- รีเซ็ตข้อมูล
//     const handleReset = () => {
//         setSiteOptions(null);
//         setCostCenterCodeOptions("");
//         setCostCenterNameOptions("");
//         setReqUserOptions("");
//         setActionType('reset');
//     };

//     useEffect(() => {
//         if (actionType) {
//             // dataTableMasterUser_GET(); // ดึงข้อมูลใส่ตารางใหม่
//             setActionType(null); // Reset actionType after fetching data
//         }
//     }, [actionType]);

//     const searchFetchCostCenter = async () => {
//         console.log('Call : searchFetchCostCenters', moment().format('HH:mm:ss:SSS'));

//         const dataset = {

//         };

//         try {
//             const response = await _POST(dataset, "/api_trr_mes/MasterData/Master_Cost_Center_Get");

//             if (response && response.status === "success") {
//                 // ดึงข้อมูล Cost Center ทั้งหมด
//                 const allCenters = response.data;

//                 // กรองข้อมูลเฉพาะที่ไม่ใช่ Service Center (service_center_flag = false)
//                 const costCenters = allCenters
//                     .filter((center: any) => !center.service_center_flag) // กรองจาก service_center_flag = false
//                     .map((center: any) => ({
//                         costCenterCode: center.cost_center_code,
//                         costCenterName: center.cost_center_name,
//                         appreqUser: center.app_req_user,
//                         costCentersCodeAndName: "[" + center.site_code + "] " + center.cost_center_name + ' [' + center.cost_center_code + ']'
//                     }));

//                 // กรองข้อมูลเฉพาะที่ไม่ใช่ Service Center (service_center_flag = false)
//                 const site = allCenters
//                     .filter((center: any) => !center.service_center_flag) // กรองจาก service_center_flag = false
//                     .map((center: any) => ({
//                         siteCode: center.site_code,
//                         siteName: center.site_name,
//                         siteCodeAndName: "[" + center.site_code + "] " + center.site_name + ' [' + center.site_name + ']'
//                     }));

//                 // อัพเดตค่าใน setOptionsSearch
//                 setOptionsSearch((prevOptions) => ({
//                     ...prevOptions,
//                     costCenter: costCenters,     // ข้อมูล Cost Center
//                 }));

//                 console.log(costCenters, 'Cost Center');
//                 console.log(site, 'Site');
//             } else {
//                 setError("Failed to fetch cost centers.");
//             }
//         } catch (error) {
//             console.error("Error fetching cost centers:", error);
//             setError("An error occurred while fetching cost centers.");
//         }
//     };

    

//     const Master_Cost_Center_Get = async () => {
//         console.log('Master Cost Center : Master_Cost_Center_Get', moment().format('YYYY-MM-DD HH:mm'));

//         try {
//             const response = await _POST("", "/api_trr_mes/MasterData/Master_Cost_Center_Get");

//             if (response && response.status === "success") {
//                 const data = response.data;

//                 // แยกข้อมูล Master Cost Center
//                 const CostCenter = data.map((el: any) => ({
//                     "id": el.id,
//                     "site_code": el.site_code,
//                     "cost_center_code": el.cost_center_code,
//                     "cost_center_name": el.cost_center_name,
//                     "app_req_user": el.app_req_user,
//                     "service_center_flag": el.service_center_flag,
//                     "create_by": el.create_by,
//                     "create_date": el.create_date,
//                     "update_by": el.update_by,
//                     "update_date": el.update_date,
//                 }));

//                 await setDataCostCenter(CostCenter);

//             } else {
//                 setError("Failed to fetch master cost centers.");
//             }
//         } catch (error) {
//             console.error("Error fetching master cost centers:", error);
//             setError("An error occurred while fetching master cost centers.");
//         }
//     }

//     React.useEffect(() => {
//         Master_Site_Get();
//         Master_Cost_Center_Get();
//     }, []);

//     return (
//         <div className="max-lg rounded overflow-hidden shadow-xl bg-white mt-6 mb-6">
//             <div className="px-6 pt-4">
//                 <label className="text-2xl ml-2 mt-3 mb-5 sarabun-regular">ค้นหาข้อมูล</label>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mx-5 my-5">
//                 <div className="">
//                     <AutocompleteComboBox
//                         labelName={"Site"}
//                         value={null} // value={sitecode}
//                         options={siteOptions}
//                         column="fullname"
//                         setvalue={(value) => { }} // setvalue={handleAutocompleteChange(setSite)}
//                     />
//                 </div>
//                 <div className="">
//                     <FullWidthTextField
//                         labelName={"Cost Center Code"}
//                         value={costcenterCode}
//                         onChange={(value) => setCostCenterCode(value)}
//                     />
//                 </div>
//                 <div className="">
//                     <FullWidthTextField
//                         labelName={"ชื่อ Cost Center"}
//                         value={costcenterName}
//                         onChange={(value) => setCostCenterName(value)}
//                     />
//                 </div>
//                 <div className="">
//                     <FullWidthTextField
//                         labelName={"ผู้อนุมัติ"}
//                         value={appreqUser}
//                         onChange={(value) => setAppReqUser(value)}
//                     />
//                 </div>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mx-6">
//                 <div className='flex justify-between items-center'>
//                     {/* ---------------------- Switch (True - Flase) ---------------------- */}
//                     <CustomizedSwitches labelName='Service Center' />
//                     {/* ------------------------------------------------------------------- */}
//                     <div className="flex items-center space-x-2">
//                         <div className="">
//                             <FullWidthButton
//                                 labelName={"ค้นหา"}
//                                 handleonClick={handleSearch}
//                                 variant_text="contained"
//                                 colorname={"success"}
//                             />
//                         </div>
//                         <div className="">
//                             <FullWidthButton
//                                 labelName={"รีเซ็ต"}
//                                 handleonClick={handleReset}
//                                 variant_text="contained"
//                                 colorname={"inherit"}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }
