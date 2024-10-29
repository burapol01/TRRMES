// import React, { useEffect, useState } from 'react';
// import EnhancedTable from '../../../../components/MUI/DataTables'
// import { useSelector } from 'react-redux';
// import { Master_Cost_Center } from '../../../../../libs/columnname'
// import { useListConCenter } from '../core/CostCenterProvider';
// import FuncDialog from '../../../../components/MUI/FullDialog';
// import CostCenterBody from './CostCenterBody';

// export default function ListDataCostCenter() {

//     const [resultData, setResultData] = useState<any>(null); // State to store draft data  
//     const [openAdd, setOpenAdd] = useState(false);
//     const [openView, setOpenView] = useState<any>(false);
//     const [openEdit, setOpenEdit] = useState(false);
//     const [openDelete, setOpenDelete] = useState(false);
//     const currentUser = useSelector((state: any) => state?.user?.user);

//     const menuFuncList = useSelector((state: any) => state?.menuFuncList);
//     const showButton = (menuFuncList || []).some((menuFunc: any) => menuFunc.func_name === "Add");
//     const { dataCostCenter } = useListConCenter();

//     console.log(dataCostCenter, 'dataCostCenter')

//     return (
//         <div>
//             <div className="max-lg rounded overflow-hidden shadow-lg bg-white mt-5 mb-5">
//                 <div>
//                     <EnhancedTable
//                         rows={dataCostCenter}
//                         buttonLabal_1={showButton ? "เพิ่มข้อมูล" : ""} // Show button label only if "Add" is found
//                         buttonColor_1="info"
//                         headCells={Master_Cost_Center}
//                         tableName={"บันทึกข้อมูลศูนย์ต้นทุน"}
//                         // handleonClick_1={handleClickAdd}
//                         roleName={currentUser?.role_name}
//                     />
//                 </div>
//                 <FuncDialog
//                     open={openAdd} // เปิด dialog ถ้า openAdd, openView, openEdit หรือ openDelete เป็น true
//                     dialogWidth="lg"
//                     openBottonHidden={true}
//                     titlename={'เพิ่มข้อมูล'}
//                     // handleClose={handleClose}
//                     handlefunction={""}
//                     colorBotton="success"
//                     actions={"Create"}
//                     element={
//                         <CostCenterBody
//                             // onDataChange={handleDataChange}
//                             // defaultValues={defaultValues}
//                             // options={options} // ส่งข้อมูล Combobox ไปยัง UserBody   
//                             // actions={"Create"}
//                         />
//                     }
//                 />
//                 <FuncDialog
//                     open={openView} // เปิด dialog ถ้า openAdd, openView, openEdit หรือ openDelete เป็น true
//                     dialogWidth="lg"
//                     openBottonHidden={true}
//                     titlename={'ดูข้อมูล'}
//                     // handleClose={handleClose}
//                     colorBotton="success"
//                     actions={"Reade"}
//                 // element={
//                 //     <CostCenterBody
//                 //         onDataChange={handleDataChange}
//                 //         defaultValues={defaultValues}
//                 //         options={options} // ส่งข้อมูล Combobox ไปยัง ServiceRequestBody     
//                 //         disableOnly
//                 //         actions={"Reade"}
//                 //     />
//                 // }
//                 />
//                 <FuncDialog
//                     open={openEdit} // เปิด dialog ถ้า openAdd, openView, openEdit หรือ openDelete เป็น true
//                     dialogWidth="lg"
//                     openBottonHidden={true}
//                     titlename={'แก้ไขข้อมูล'}
//                     // handleClose={handleClose}
//                     handlefunction={""}
//                     colorBotton="success"
//                     actions={"Update"}
//                 // element={
//                 //     <CostCenterBody
//                 //         onDataChange={handleDataChange}
//                 //         defaultValues={defaultValues}
//                 //         options={options} // ส่งข้อมูล Combobox ไปยัง UserBody   
//                 //         actions={"Update"}
//                 //     />
//                 // }
//                 />
//                 <FuncDialog
//                     open={openDelete} // เปิด dialog ถ้า openAdd, openView, openEdit หรือ openDelete เป็น true
//                     dialogWidth="lg"
//                     openBottonHidden={true}
//                     titlename={'ลบข้อมูล'}
//                     // handleClose={handleClose}
//                     handlefunction={""}
//                     colorBotton="success"
//                     actions={"Delete"}
//                 // element={
//                 //     <CostCenterBody
//                 //         onDataChange={handleDataChange}
//                 //         defaultValues={defaultValues}
//                 //         options={options} // ส่งข้อมูล Combobox ไปยัง UserBody   
//                 //         actions={"Reade"}
//                 //     />
//                 // }
//                 />
//             </div>
//         </div>
//     )
// }
