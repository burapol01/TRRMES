import React, { useState, ChangeEvent, useEffect } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import FullWidthTextField from '../../../components/MUI/FullWidthTextField';
import BrowseFileUpload from '../../../components/Tailwind/BrowseFileUpload';
import { useListServiceCost } from '../core/service_cost_provider';
import moment from 'moment';
import { getCurrentAccessObject, updateSessionStorageCurrentAccess } from '../../../service/initmain';
import { _exportFileRequest, _POST } from '../../../service/mas';
import BasicTable from '../../../components/MUI/BasicTable';
import { Table_WorkHourSummary_By_ServiceCenter } from '../../../../libs/columnname';
import FullWidthButton from '../../../components/MUI/FullWidthButton';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { endLoadScreen, startLoadScreen } from '../../../../redux/actions/loadingScreenAction';
import { Massengmodal } from '../../../components/MUI/Massengmodal';
import { plg_uploadFileRename } from '../../../service/upload';
import { v4 as uuidv4 } from 'uuid';
import * as XLSX from 'xlsx';
import { dateFormatTimeEN } from '../../../../libs/datacontrol';
import { CheckCircle, Cancel } from '@mui/icons-material'; // Make sure to import the icon
import { green, grey } from '@mui/material/colors'; // Import the green color from material UI
import { confirmModal } from '../../../components/MUI/Comfirmmodal';
import { checkValidate, isCheckValidateAll } from '../../../../libs/validations';

interface ServiceCostBodyProps {
    onDataChange?: (data: any) => void;
    actions?: any;
    handleClose: () => void; // ฟังก์ชันที่ส่งเข้ามา

}

export default function ServiceCostBody({ onDataChange, actions, handleClose }: ServiceCostBodyProps) {
    const dispatch = useDispatch()
    const [file, setFile] = useState<File[]>([]);
    const [fileDataList, setFileDataList] = useState<any[]>([]); // เก็บข้อมูลไฟล์ใน state
    const [excelData, setExcelData] = useState<any[]>([]);  // เก็บข้อมูลจาก Excel ที่จะใช้ในตาราง

    const [validate, setValidate] = useState(false);
    const [activeTab, setActiveTab] = useState(0); // Track active tab
    const { defaultDataList, cutOffMonthAndYear, currentAccessModel, isValidate, setIsValidate } = useListServiceCost();

    const [dataList, setDataList] = useState([]);
    const [serviceCostDataList, setServiceCostDataList] = useState<any>(null);

    const isValidationEnabled = import.meta.env.VITE_APP_ENABLE_VALIDATION === 'true'; // ตรวจสอบว่าเปิดการตรวจสอบหรือไม่

    const handleClickCloseMonthlyCutOff_Reset = () => {
        console.log('Call : handleClickCloseMonthlyCutOff_Reset', moment().format('HH:mm:ss:SSS'));

        // เรียกใช้งานฟังก์ชัน  Update Current Access Event Name
        updateSessionStorageCurrentAccess('event_name', 'Reset/CloseMonthlyCutOff_Reset')

        confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
            // สร้างข้อมูลที่จะส่ง
            const payload = {
                closeMonthlyCutOffModel: {
                    as_of_month: cutOffMonthAndYear,
                    cut_off_id: defaultDataList.id
                },
                currentAccessModel: getCurrentAccessObject(currentAccessModel.employeeUsername, currentAccessModel.employeeDomain, currentAccessModel.screenName)
            };

            dispatch(startLoadScreen());
            setTimeout(async () => {
                try {
                    console.log('handleClickCloseMonthlyCutOff_Reset model', payload);

                    // ใช้ _POST เพื่อส่งข้อมูล
                    const response = await _POST(payload, "/api_trr_mes/CutOff/CloseMonthlyCutOff_Reset");

                    if (response && response.status === "success") {
                        console.log('handleClickCloseMonthlyCutOff_Reset successfully:', response);

                        // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ
                        Massengmodal.createModal(
                            <div className="text-center p-4">
                                <p className="text-xl font-semibold mb-2 text-green-600">Success</p>
                                {/* <p className="text-lg text-gray-800">
                            <span className="font-semibold text-gray-900">Request No:</span>
                            <span className="font-bold text-indigo-600 ml-1">{response.req_no}</span>
                          </p> */}
                            </div>,
                            'success',
                            async () => {
                                dispatch(endLoadScreen());
                                handleClose();
                            });
                    } else {
                        console.error('Failed to handleClickCloseMonthlyCutOff_Reset:', response);
                        dispatch(endLoadScreen());
                        // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
                        Massengmodal.createModal(
                            <div className="text-center p-4">
                                <p className="text-xl font-semibold mb-2 text-green-600">{response.data[0].errorMessage}</p>
                                {/* <p className="text-lg text-gray-800">
                            <span className="font-semibold text-gray-900">Request No:</span>
                            <span className="font-bold text-indigo-600 ml-1">{response.req_no}</span>
                          </p> */}
                            </div>,
                            'error',
                            async () => {
                                dispatch(endLoadScreen());
                            });
                    }
                } catch (error) {
                    console.error('Error handleClickCloseMonthlyCutOff_Reset:', error);
                    dispatch(endLoadScreen());
                    // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
                }

            }, 0);
        });
    };

    const handleClickAllocateCost = () => {
        console.log('Call : handleClickAllocateCost', moment().format('HH:mm:ss:SSS'));

        // เรียกใช้งานฟังก์ชัน  Update Current Access Event Name
        updateSessionStorageCurrentAccess('event_name', 'AllocateCost')

        confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
            // สร้างข้อมูลที่จะส่ง
            const payload = {
                AllocateCostModel: {
                    month_year: cutOffMonthAndYear
                },
                currentAccessModel: getCurrentAccessObject(currentAccessModel.employeeUsername, currentAccessModel.employeeDomain, currentAccessModel.screenName)
            };

            dispatch(startLoadScreen());
            setTimeout(async () => {
                try {
                    console.log('handleClickAllocateCost model', payload);

                    // ใช้ _POST เพื่อส่งข้อมูล
                    const response = await _POST(payload, "/api_trr_mes/ServiceCost/AllocateCost");

                    if (response && response.status === "success") {
                        console.log('handleClickAllocateCost successfully:', response);

                        // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ
                        Massengmodal.createModal(
                            <div className="text-center p-4">
                                <p className="text-xl font-semibold mb-2 text-green-600">Success</p>
                                {/* <p className="text-lg text-gray-800">
                            <span className="font-semibold text-gray-900">Request No:</span>
                            <span className="font-bold text-indigo-600 ml-1">{response.req_no}</span>
                          </p> */}
                            </div>,
                            'success',
                            async () => {
                                dispatch(endLoadScreen());
                                handleClose();
                            });
                    } else {
                        console.error('Failed to handleClickAllocateCost:', response);
                        dispatch(endLoadScreen());
                        // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
                        Massengmodal.createModal(
                            <div className="text-center p-4">
                                <p className="text-xl font-semibold mb-2 text-green-600">{response.data[0].errorMessage}</p>
                                {/* <p className="text-lg text-gray-800">
                            <span className="font-semibold text-gray-900">Request No:</span>
                            <span className="font-bold text-indigo-600 ml-1">{response.req_no}</span>
                          </p> */}
                            </div>,
                            'error',
                            async () => {
                                dispatch(endLoadScreen());
                            });
                    }
                } catch (error) {
                    console.error('Error handleClickAllocateCost:', error);
                    dispatch(endLoadScreen());
                    // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
                }

            }, 0);

        });
    };

    const handleClickAllocateCost_Delete = () => {
        console.log('Call : handleClickAllocateCost_Delete', moment().format('HH:mm:ss:SSS'));

        // เรียกใช้งานฟังก์ชัน  Update Current Access Event Name
        updateSessionStorageCurrentAccess('event_name', 'AllocateCost')

        confirmModal.createModal("ยืนยันที่จะลบหรือไม่ ?", "info", async () => {
            // สร้างข้อมูลที่จะส่ง
            const payload = {
                AllocateCostModel: {
                    cut_off_id: defaultDataList.id,
                    month_year: cutOffMonthAndYear
                },
                currentAccessModel: getCurrentAccessObject(currentAccessModel.employeeUsername, currentAccessModel.employeeDomain, currentAccessModel.screenName)
            };

            dispatch(startLoadScreen());
            setTimeout(async () => {
                try {
                    console.log('handleClickAllocateCost_Delete model', payload);

                    // ใช้ _POST เพื่อส่งข้อมูล
                    const response = await _POST(payload, "/api_trr_mes/ServiceCost/AllocateCost_Delete");

                    if (response && response.status === "success") {
                        console.log('handleClickAllocateCost_Delete successfully:', response);

                        // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ
                        Massengmodal.createModal(
                            <div className="text-center p-4">
                                <p className="text-xl font-semibold mb-2 text-green-600">Success</p>
                                {/* <p className="text-lg text-gray-800">
                            <span className="font-semibold text-gray-900">Request No:</span>
                            <span className="font-bold text-indigo-600 ml-1">{response.req_no}</span>
                          </p> */}
                            </div>,
                            'success',
                            async () => {
                                dispatch(endLoadScreen());
                                handleClose();
                            });
                    } else {
                        console.error('Failed to handleClickAllocateCost_Delete:', response);
                        dispatch(endLoadScreen());
                        // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
                        Massengmodal.createModal(
                            <div className="text-center p-4">
                                <p className="text-xl font-semibold mb-2 text-green-600">{response.data[0].errorMessage}</p>
                                {/* <p className="text-lg text-gray-800">
                            <span className="font-semibold text-gray-900">Request No:</span>
                            <span className="font-bold text-indigo-600 ml-1">{response.req_no}</span>
                          </p> */}
                            </div>,
                            'error',
                            async () => {
                                dispatch(endLoadScreen());
                            });
                    }
                } catch (error) {
                    console.error('Error handleClickAllocateCost_Delete:', error);
                    dispatch(endLoadScreen());
                    // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
                }

            }, 0);

        });
    };

    // Function to handle file upload and renaming
    async function handleFileUpload(fileDataList: any, cutOffMonthAndYear: string, currentAccessModel: any) {
        if (fileDataList.length > 0) {
            console.log("File data list:", fileDataList);

            if (!cutOffMonthAndYear || !currentAccessModel.employeeUsername) {
                console.error("Missing required data: cutOffMonthAndYear or employeeUsername.");
                return;
            }
            const allocateLabel = 'Allocate'
            const path = allocateLabel; // Path
            // const path = cutOffMonthAndYear.replace("/", ""); // Path //คอมเม้นท์เผื่อกลับมาใช้
            const headFolderName = 'DocumentsServiceCost'; // Folder name
            const fileType = ['xls', 'xlsx']; // Allowed file types

            //const employeeUsername = path + '_Importby_' + currentAccessModel.employeeUsername.replace(".", "_");

            const timestamp = moment().format("YYYYMMDD_HHmmssSSS");

            const fileToUpload = fileDataList[0].file; // Assuming fileDataList has a file property

            if (!fileToUpload) {
                console.error("No file to upload.");
                return;
            }

            try {
                // Ensure the correct function signature
                const newFileName = await plg_uploadFileRename(
                    fileToUpload,
                    path,
                    // `${employeeUsername}_${uuidv4()}_${timestamp}`,
                    `${allocateLabel}_${timestamp}`,
                    headFolderName,
                    fileType
                );
                console.log("New file name:", newFileName);

                // Return both the original file name and the new file name
                return {
                    originalFileName: fileToUpload.name,  // ชื่อไฟล์เดิม
                    newFileName: newFileName,              // ชื่อไฟล์ใหม่ที่ถูกสร้างขึ้น
                    filePath: `/${headFolderName}/${path}/${newFileName}` //filePath สำหรับเก็บที่ Data Base
                };
            } catch (error) {
                console.error("Error during file upload:", error);
            }
        } else {
            console.error("No file data found.");
        }
    }

    //นำไฟล์ข้อมูลเข้า Service Cost กับ Service Cost list และ เปลี่ยน import_service_cost_flag = 1
    const [isProcessing, setIsProcessing] = useState(false);

    const handleClickImportServiceCost = async () => {
        // if (isProcessing) {
        //     console.warn('Action is already processing');
        //     return;
        // }

        //setIsProcessing(true); // ป้องกันการกดซ้ำ
        console.log('Call : handleClickImportServiceCost', moment().format('HH:mm:ss:SSS'));

        updateSessionStorageCurrentAccess('event_name', 'Add/ไฟล์ข้อมูลนำเข้า');
        const dataForValidate = {
            fileDataList: fileDataList.length > 0
          }
          const isValidate = checkValidate(dataForValidate, ['fileDataList']); 
          const isValidateAll = isCheckValidateAll(isValidate);
      
          console.log(isValidateAll,'testtest');
          if (Object.keys(isValidateAll).length > 0 && isValidationEnabled) {
            console.log(isValidateAll,'');
            setIsValidate(isValidate);
            return;
          }
          setIsValidate(null);
        console.log(fileDataList, 'fileDataList');
        if (fileDataList.length > 0) {

            const dataListFileName = await handleFileUpload(fileDataList, cutOffMonthAndYear, currentAccessModel);


            confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
                const payload = {
                    ServiceCostModel: {
                        id: uuidv4(),
                        cut_off_id: defaultDataList.id,
                        file_path: dataListFileName?.filePath,
                        source_user_filename: dataListFileName?.originalFileName,
                        source_sys_filename: dataListFileName?.newFileName,
                    },
                    currentAccessModel: getCurrentAccessObject(
                        currentAccessModel.employeeUsername,
                        currentAccessModel.employeeDomain,
                        currentAccessModel.screenName
                    )
                };

                dispatch(startLoadScreen());
                setTimeout(async () => {
                    try {
                        console.log('handleClickImportServiceCost model', payload);

                        const response = await _POST(payload, "/api_trr_mes/ServiceCost/ServiceCostImportFile_Add");

                        if (response && response.status === "success") {
                            console.log('handleClickImportServiceCost successfully:', response);

                            Massengmodal.createModal(
                                <div className="text-center p-4">
                                    <p className="text-xl font-semibold mb-2 text-green-600">Success</p>
                                </div>,
                                'success',
                                async () => {
                                    dispatch(endLoadScreen());
                                    handleClose();
                                    setIsProcessing(false); // ปลดล็อกปุ่ม
                                }
                            );
                        } else {
                            console.error('Failed to handleClickImportServiceCost:', response);
                            dispatch(endLoadScreen());
                            Massengmodal.createModal(
                                <div className="text-center p-4">
                                    <p className="text-xl font-semibold mb-2 text-green-600">{response.data[0].errorMessage}</p>
                                </div>,
                                'error',
                                async () => {
                                    dispatch(endLoadScreen());
                                    setIsProcessing(false); // ปลดล็อกปุ่ม
                                }
                            );
                        }
                    } catch (error) {
                        console.error('Error handleClickImportServiceCost:', error);
                        dispatch(endLoadScreen());
                        setIsProcessing(false); // ปลดล็อกปุ่ม
                    }
                }, 0);

            });
        }
    };


    //ลบไฟล์ข้อมูล เปลี่ยน import_service_cost_flag = 0
    const handleClickImportServiceCost_Delete = () => {
        console.log('Call : handleClickImportServiceCost_Delete', moment().format('HH:mm:ss:SSS'));

        // เรียกใช้งานฟังก์ชัน  Update Current Access Event Name
        updateSessionStorageCurrentAccess('event_name', 'Delete/ไฟล์ข้อมูลนำเข้า')
        confirmModal.createModal("ยืนยันที่จะลบหรือไม่ ?", "info", async () => {
            // สร้างข้อมูลที่จะส่ง
            const payload = {
                ServiceCostModel: {
                    cut_off_id: defaultDataList.id,
                    month_year: cutOffMonthAndYear
                },
                currentAccessModel: getCurrentAccessObject(currentAccessModel.employeeUsername, currentAccessModel.employeeDomain, currentAccessModel.screenName)
            };

            dispatch(startLoadScreen());
            setTimeout(async () => {
                try {
                    console.log('handleClickImportServiceCost_Delete model', payload);

                    // ใช้ _POST เพื่อส่งข้อมูล
                    const response = await _POST(payload, "/api_trr_mes/ServiceCost/Service_Cost_Delete");

                    if (response && response.status === "success") {
                        console.log('handleClickImportServiceCost_Delete successfully:', response);

                        // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ
                        Massengmodal.createModal(
                            <div className="text-center p-4">
                                <p className="text-xl font-semibold mb-2 text-green-600">Success</p>
                                {/* <p className="text-lg text-gray-800">
                            <span className="font-semibold text-gray-900">Request No:</span>
                            <span className="font-bold text-indigo-600 ml-1">{response.req_no}</span>
                          </p> */}
                            </div>,
                            'success',
                            async () => {
                                dispatch(endLoadScreen());
                                handleClose();

                            });
                    } else {
                        console.error('Failed to handleClickImportServiceCost_Delete:', response);
                        dispatch(endLoadScreen());
                        // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
                        Massengmodal.createModal(
                            <div className="text-center p-4">
                                <p className="text-xl font-semibold mb-2 text-green-600">{response.data[0].errorMessage}</p>
                                {/* <p className="text-lg text-gray-800">
                            <span className="font-semibold text-gray-900">Request No:</span>
                            <span className="font-bold text-indigo-600 ml-1">{response.req_no}</span>
                          </p> */}
                            </div>,
                            'error',
                            async () => {
                                dispatch(endLoadScreen());
                            });
                    }
                } catch (error) {
                    console.error('Error handleClickImportServiceCost_Delete:', error);
                    dispatch(endLoadScreen());
                    // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
                }

            }, 0);
        });
    };

    //Expor ไฟล์ข้อมูล 
    const handleClickExportGLAllcationToERPExcel = async () => {
        console.log('Call : handleClickExportGLAllcationToERPExcel', moment().format('HH:mm:ss:SSS'));

        // อัปเดตการเข้าถึง
        updateSessionStorageCurrentAccess('event_name', 'Export/GLAllcationToERPExcel');

        const payload = { month_year: cutOffMonthAndYear };
        dispatch(startLoadScreen());

        try {
            console.log('handleClickExportGLAllcationToERPExcel model', payload);

            // ส่งคำขอไปยัง API ด้วยฟังก์ชัน _exportFileRequest
            const result = await _exportFileRequest(payload, '/api_trr_mes/ServiceCost/ExportGLAllcationToERPExcel');

            if (result.status === 'success') {
                const blob = result.data; // ได้ Blob จาก API

                // สร้างลิงก์เพื่อดาวน์โหลดไฟล์
                if (blob) {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'GLAllcationToERP.xlsx'; // ตั้งชื่อไฟล์ที่ดาวน์โหลด
                    link.click(); // เรียกใช้งานการดาวน์โหลด
                } else {
                    console.error("No blob data received.");
                }


                // แสดง modal สำเร็จ
                Massengmodal.createModal(
                    <div className="text-center p-4">
                        <p className="text-xl font-semibold mb-2 text-green-600">Success</p>
                    </div>,
                    'success',
                    async () => {
                        dispatch(endLoadScreen());
                    }
                );
            } else {
                // ถ้า API ตอบกลับไม่สำเร็จ
                console.error('Failed to export:', result.message);

                Massengmodal.createModal(
                    <div className="text-center p-4">
                        <p className="text-xl font-semibold mb-2 text-red-600">{result.message || "Unknown error"}</p>
                    </div>,
                    'error',
                    async () => {
                        dispatch(endLoadScreen());
                    }
                );
            }
        } catch (error) {
            // ถ้ามีข้อผิดพลาดในการเรียก API
            console.error('Error handleClickExportGLAllcationToERPExcel:', error);

            Massengmodal.createModal(
                <div className="text-center p-4">
                    <p className="text-xl font-semibold mb-2 text-red-600">An error occurred while exporting the file.</p>
                </div>,
                'error',
                async () => {
                    dispatch(endLoadScreen());
                }
            );
        } finally {
            dispatch(endLoadScreen());
        }
    };


    //รายงานสรุปการปันส่วน
    const handleClickTest = () => {
        console.log('Call : handleClickImportServiceCost_Delete', moment().format('HH:mm:ss:SSS'));
        return
        // เรียกใช้งานฟังก์ชัน  Update Current Access Event Name
        updateSessionStorageCurrentAccess('event_name', 'Delete/ไฟล์ข้อมูลนำเข้า')
        confirmModal.createModal("ยืนยันที่จะบันทึกหรือไม่ ?", "info", async () => {
            // สร้างข้อมูลที่จะส่ง
            const payload = {
                ServiceCostModel: {
                    cut_off_id: defaultDataList.id,
                    month_year: cutOffMonthAndYear
                },
                currentAccessModel: getCurrentAccessObject(currentAccessModel.employeeUsername, currentAccessModel.employeeDomain, currentAccessModel.screenName)
            };
            dispatch(startLoadScreen());
            setTimeout(async () => {
                try {
                    console.log('handleClickImportServiceCost_Delete model', payload);

                    // ใช้ _POST เพื่อส่งข้อมูล
                    const response = await _POST(payload, "/api_trr_mes/ServiceCost/Service_Cost_Delete");

                    if (response && response.status === "success") {
                        console.log('handleClickImportServiceCost_Delete successfully:', response);

                        // เพิ่มโค้ดที่ต้องการเมื่อบันทึกสำเร็จ
                        Massengmodal.createModal(
                            <div className="text-center p-4">
                                <p className="text-xl font-semibold mb-2 text-green-600">Success</p>
                                {/* <p className="text-lg text-gray-800">
                            <span className="font-semibold text-gray-900">Request No:</span>
                            <span className="font-bold text-indigo-600 ml-1">{response.req_no}</span>
                          </p> */}
                            </div>,
                            'success',
                            async () => {
                                dispatch(endLoadScreen());
                                handleClose();

                            });
                    } else {
                        console.error('Failed to handleClickImportServiceCost_Delete:', response);
                        dispatch(endLoadScreen());
                        // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาด
                        Massengmodal.createModal(
                            <div className="text-center p-4">
                                <p className="text-xl font-semibold mb-2 text-green-600">{response.data[0].errorMessage}</p>
                                {/* <p className="text-lg text-gray-800">
                            <span className="font-semibold text-gray-900">Request No:</span>
                            <span className="font-bold text-indigo-600 ml-1">{response.req_no}</span>
                          </p> */}
                            </div>,
                            'error',
                            async () => {
                                dispatch(endLoadScreen());
                            });
                    }
                } catch (error) {
                    console.error('Error handleClickImportServiceCost_Delete:', error);
                    dispatch(endLoadScreen());
                    // เพิ่มโค้ดที่ต้องการเมื่อเกิดข้อผิดพลาดในการส่งข้อมูล
                }

            }, 0);
        });
    };



    // Step 1 : ดึงข้อมูลจากไฟล์ Excel ประมวลผลรวมและแสดงในตาราง
    //================================================================================================
    // Default Table Header
    const defaultTableHeader = (
        <tr>
            <th style={{ textAlign: 'center' }}>ServiceCenterCode</th>
            <th style={{ textAlign: 'center' }}>Capacity</th>
            <th style={{ textAlign: 'center' }}>STD Amount</th>
        </tr>
    );

    // Helper function to format numbers
    const formatNumber = (number: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(number);
    };

    // สร้างตาราง
    const renderTableRows = (data: any[], isServiceCost: boolean) => {
        return data.map((row, rowIndex) => {
            const isTotalRow = row.service_center_code === "รวม" || row.ServiceCenterCode === "รวม";
            const serviceCenterCode = isServiceCost ? row.service_center_code : row.ServiceCenterCode;
            const serviceCenterCode_label = isServiceCost
                ? "[" + row.service_center_code + "]" + " | " + (row.service_center_name ? row.service_center_name : "ไม่พบในฐานข้อมูล")
                : row.ServiceCenterCode;
            const capacity = isServiceCost ? row.capacity : row.Capacity;
            const stdAmount = isServiceCost ? row.std_amount : row.STD_Amount;

            return (
                <tr key={rowIndex}>
                    {isTotalRow ? (
                        <>
                            <td colSpan={2} style={{ textAlign: 'right', fontWeight: 'bold', backgroundColor: '#f1f1f1' }}>
                                {serviceCenterCode}
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 'bold', backgroundColor: '#f1f1f1' }}>
                                {formatNumber(Number(stdAmount))}
                            </td>
                        </>
                    ) : (
                        <>
                            <td style={{ textAlign: 'left' }}>
                                {/* Check if isServiceCost is true, then show icon based on flag_Is_match */}
                                {isServiceCost && (
                                    row.flag_Is_match ? (
                                        <CheckCircle style={{ color: green[500], marginRight: '8px' }} />
                                    ) : (
                                        <Cancel style={{ color: grey[400], marginRight: '8px' }} />
                                    )
                                )}
                                {serviceCenterCode_label}
                            </td>

                            <td style={{ textAlign: 'right' }}>{formatNumber(Number(capacity))}</td>
                            <td style={{ textAlign: 'right' }}>{formatNumber(Number(stdAmount))}</td>
                        </>
                    )}
                </tr>
            );
        });
    };
    // Function to handle file selection and Excel processing
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            const filesArray = Array.from(selectedFiles);
            setFileDataList(filesArray.map((fileItem) => ({
                file: fileItem,
                filename: fileItem.name,
                filetype: fileItem.type,
                size: fileItem.size,
            })));

            const file = filesArray[0];
            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
                const arrayBuffer = e.target?.result;
                if (arrayBuffer) {
                    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);
                    setExcelData(jsonData);
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    // Process Excel data
    const processExcelData = (data: any[]) => {
        if (data.length === 0) return [];
        const processedData = data.map((row) => {
            const stdAmount = parseFloat(row["STD Amount"]) || 0;
            return {
                ServiceCenterCode: row.ServiceCenterCode,
                Capacity: row.Capacity,
                STD_Amount: stdAmount.toFixed(2),
            };
        });

        const totalSTD_Amount = processedData.reduce((sum, row) => sum + parseFloat(row.STD_Amount), 0);
        processedData.push({
            ServiceCenterCode: "รวม",
            Capacity: "",
            STD_Amount: totalSTD_Amount.toFixed(2),
        });

        return processedData;
    };

    //นำข้อมูลที่ประมวลผลลัพธ์ที่ได้จาก Excel ไปใช้
    const processedData = processExcelData(excelData);

    // Step 2 : ดึงข้อมูล Data Base แมพข้อมูลและแสดงในตาราง
    //================================================================================================
    // Fetch service cost data
    useEffect(() => {
        const fetchServiceCostData = async () => {
            if (defaultDataList.import_service_cost_flag) {
                const payload = {
                    cut_off_id: defaultDataList.id,
                };

                try {
                    const response = await _POST(payload, "/api_trr_mes/ServiceCost/Service_Cost_Get");
                    if (response.status === "success") {
                        const serviceCostList = response.data[0].serviceCostList;
                        const totalStdAmount = serviceCostList.reduce((sum: any, row: any) => sum + row.std_amount, 0);
                        serviceCostList.push({
                            id: "total",
                            service_center_code: "รวม",
                            std_amount: totalStdAmount,
                            capacity: 0,
                            record_status: true,
                        });

                        setServiceCostDataList(response.data[0]);
                    }
                } catch (error) {
                    console.error("Error fetching service cost data", error);
                }
            }
        };

        fetchServiceCostData();
    }, [defaultDataList.import_service_cost_flag]);


    //================================================================================================


    // Handle tab change
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const WorkHourSummaryByServiceCenter_Get = async () => {
        console.log('Call : WorkHourSummaryByServiceCenter_Get', moment().format('HH:mm:ss:SSS'));

        try {
            const dataset = {
                WorkHourSummaryByServiceCenterModel: {
                    as_of_month: cutOffMonthAndYear
                },
                currentAccessModel: getCurrentAccessObject(currentAccessModel.employeeUsername, currentAccessModel.employeeDomain, currentAccessModel.screenName),
            };

            const response = await _POST(dataset, "/api_trr_mes/CutOff/WorkHourSummaryByServiceCenter_Get");

            if (response && response.status === "success" && Array.isArray(response.data)) {
                const updatedData = response.data.map((item: any) => ({
                    ...item,
                    service_center: item.service_center,
                    work_hour_summary: item.work_hour_summary
                }));
                setDataList(updatedData);
            } else {
                console.error('Failed to fetch data:', response);
                setDataList([]); // ตั้งค่า dataList เป็นอาเรย์ว่างเมื่อไม่มีข้อมูล
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setDataList([]); // ตั้งค่า dataList เป็นอาเรย์ว่างเมื่อเกิดข้อผิดพลาด
        }
    };

    useEffect(() => {
        WorkHourSummaryByServiceCenter_Get();
    }, []);


    return (
        <Box>
            {/* Tabs Header */}
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                centered={false} // ปิดการจัดกึ่งกลาง
                sx={{ justifyContent: 'flex-start', display: 'flex', borderBottom: 1, borderColor: 'divider' }} // จัดชิดซ้าย
            >
                <Tab label="สรุปบันทึกชั่วโมงการทำงาน" />
                <Tab label="สรุปค่าใช้จ่ายหน่วยงานบริการ" />
                <Tab label="ปันส่วนค่าใช้จ่าย" />
            </Tabs>

            {/* Tabs Content */}
            <Box sx={{ mt: 2 }}>
                {activeTab === 0 && (
                    <div>
                        <div className="row pt-0 pb-5 align-items-center">
                            <div className="col-md-3 mb-2">
                                <FullWidthTextField
                                    labelName={"สรุปประจำเดือน"}
                                    value={cutOffMonthAndYear}
                                    disabled={true}
                                />
                            </div>
                            <div className="col-md-3 pt-9 ms-auto w-auto">
                                <FullWidthButton
                                    labelName={"สรุปปิดงวดใหม่"}
                                    handleonClick={handleClickCloseMonthlyCutOff_Reset} // เรียกใช้ฟังก์ชันที่ปรับปรุง
                                    variant_text="contained"
                                    colorname={"success"}
                                />
                            </div>
                        </div>

                        <BasicTable
                            columns={Table_WorkHourSummary_By_ServiceCenter}
                            rows={dataList}
                            actions="Reade"
                            labelHead="ข้อมูลสรุปประจำเดือน"
                        />


                    </div>
                )}

                {activeTab === 1 && (
                    <div>
                        <div className="row pt-0 pb-5 align-items-center">
                            <div className="col-md-3 mb-2">
                                <FullWidthTextField
                                    labelName={"สรุปประจำเดือน"}
                                    value={cutOffMonthAndYear}
                                    disabled={true}
                                />
                            </div>
                        </div>
                        {/* Check if service cost flag is false to allow file upload */}
                        {actions != "Reade" && defaultDataList.import_service_cost_flag === false ? (
                            <>
                                <div className="grid grid-cols-12 gap-4 pb-5 items-center w-full">
                                    {/* Browse File Upload */}
                                    <div className="col-span-10">
                                        <BrowseFileUpload
                                            file={file}
                                            setFile={setFile}
                                            labelname="นำเข้าข้อมูลสรุปค่าใช้จ่ายหน่วยงานบริการ"
                                            required="required"
                                            validate={isValidate?.fileDataList}
                                            onChange={handleFileChange}
                                        />
                                    </div>
                                    {/* "นำเข้าข้อมูล" button */}
                                    <div className="col-span-2 pt-7 flex justify-start">
                                        <FullWidthButton
                                            labelName={"นำเข้าข้อมูล"}
                                            handleonClick={handleClickImportServiceCost}
                                            variant_text="contained"
                                            colorname={"success"}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="row pt-0 pb-5 align-items-center">
                                <div className="col-md-3 mb-2">
                                    <FullWidthTextField
                                        labelName={"ชื่อไฟล์นำเข้า"}
                                        value={serviceCostDataList ? serviceCostDataList.source_sys_filename : ""}
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-md-3 mb-2">
                                    <FullWidthTextField
                                        labelName={"วันที่นำเข้าข้อมูล"}
                                        value={serviceCostDataList ? dateFormatTimeEN(serviceCostDataList.import_date, "DD/MM/YYYY HH:mm:ss") : ""}
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-md-3 mb-2">
                                    <FullWidthTextField
                                        labelName={"ผู้นำเข้าข้อมูล"}
                                        value={serviceCostDataList ? serviceCostDataList.import_by : ""}
                                        disabled={true}
                                    />
                                </div>
                                {/* "ลบนำเข้าข้อมูล" button */}
                                {actions != "Reade" && (
                                    <div className="col-md-3 pt-8 flex justify-start">
                                        <FullWidthButton
                                            labelName={"ลบนำเข้าข้อมูล"}
                                            handleonClick={handleClickImportServiceCost_Delete}
                                            variant_text="contained"
                                            colorname={"success"}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <h2>สรุปข้อมูลในไฟล์</h2>
                        {actions === "Reade" || actions === "AllocateCost" && defaultDataList.import_service_cost_flag ? (
                            serviceCostDataList?.serviceCostList?.length > 0 ? (
                                <table className="table table-bordered mt-4">
                                    <thead>{defaultTableHeader}</thead>
                                    <tbody>
                                        {renderTableRows(serviceCostDataList.serviceCostList, true)}
                                    </tbody>
                                </table>
                            ) : (
                                <table className="table table-bordered mt-4">
                                    <thead>{defaultTableHeader}</thead>
                                    <tbody>
                                        <tr>
                                            <td colSpan={3} className="text-center"> {/* Adjust the colSpan according to your table structure */}
                                                ไม่พบข้อมูล
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            )
                        ) : processedData.length > 0 ? (
                            <table className="table table-bordered mt-4">
                                <thead>{defaultTableHeader}</thead>
                                <tbody>{renderTableRows(processedData, false)}</tbody>
                            </table>
                        ) :
                            <table className="table table-bordered mt-4">
                                <thead>{defaultTableHeader}</thead>
                                <tbody>
                                    <tr>
                                        <td colSpan={3} className="text-center"> {/* Adjust the colSpan according to your table structure */}
                                            ไม่พบข้อมูล
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                        } {/* Fallback if no data available */}

                    </div>
                )}



                {activeTab === 2 && (
                    <div>
                        <div className="row pt-0 pb-5 align-items-center">
                            <div className="col-md-3 mb-2">
                                <FullWidthTextField
                                    labelName={"สรุปประจำเดือน"}
                                    value={cutOffMonthAndYear}
                                    disabled={true}
                                />
                            </div>
                            {/* ถ้า defaultDataList.allcate_flag === false จะแสดง ปุ่มคำนวณปันส่วน */}
                            {defaultDataList.allcate_flag === false && (
                                <div className="col-md-3 pt-9 w-auto">
                                    <FullWidthButton
                                        labelName={"คำนวณปันส่วน"}
                                        handleonClick={handleClickAllocateCost} //ตั้งชื่อให้สอดคล้อง
                                        variant_text="contained"
                                        colorname={"success"}
                                    />
                                </div>
                            )}
                            {/* ถ้า defaultDataList.allcate_flag === true จะแสดง ที่เหลือ */}
                            {defaultDataList.allcate_flag === true && (
                                <>
                                    <div className="col-md-3 pt-9 w-auto">
                                        <FullWidthButton
                                            labelName={"รายงานสรุปการปันส่วน"}
                                            handleonClick={handleClickTest} //ตั้งชื่อให้สอดคล้อง
                                            variant_text="contained"
                                            colorname={"success"}
                                        />
                                    </div>
                                    <div className="col-md-3 pt-9 w-auto">
                                        <FullWidthButton
                                            labelName={"Export to ERP"}
                                            handleonClick={handleClickExportGLAllcationToERPExcel} //ตั้งชื่อให้สอดคล้อง
                                            variant_text="contained"
                                            colorname={"success"}
                                        />
                                    </div>
                                    <div className="col-md-3 pt-9 w-auto">
                                        <FullWidthButton
                                            labelName={"ลบคำนวณปันส่วน"}
                                            handleonClick={handleClickAllocateCost_Delete} //ตั้งชื่อให้สอดคล้อง
                                            variant_text="contained"
                                            colorname={"error"}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

            </Box>
        </Box>
    );
}
