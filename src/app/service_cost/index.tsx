import React, { ChangeEvent, useEffect, useState } from 'react';
import FullWidthTextField from '../../components/MUI/FullWidthTextField';
import FullWidthButton from '../../components/MUI/FullWidthButton';
import EnhancedTable from '../../components/MUI/DataTables';
import FuncDialog from '../../components/MUI/FullDialog';
import ServiceCostBody from './component/ServiceCostBody'; // import ไฟล์แยก ServiceCostBody
import * as XLSX from 'xlsx';
import { useSelector } from 'react-redux';

export default function ServiceCost() {
    const [openAdd, setOpenAdd] = useState(false);
    const [actionType, setActionType] = useState<string | null>(null);
    const [excelData, setExcelData] = useState<any[]>([]); // เก็บข้อมูล Excel ที่อัปโหลด
    const currentUser = useSelector((state: any) => state?.user?.user);

    /* ฟังก์ชันสำหรับการอัปโหลดไฟล์ Excel */
    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => { // กำหนดประเภทของ event
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event) => {
            const binaryStr = event.target?.result;
            if (binaryStr) {
                const workbook = XLSX.read(binaryStr, { type: 'binary' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                setExcelData(jsonData); // บันทึกข้อมูลจาก Excel ลง state
            }
        };

        reader.readAsBinaryString(file);
    };

    const handleSearch = () => {
        setActionType('search');
    };

    const handleReset = () => {
        setActionType('reset');
    };

    const handleClose = () => {
        setOpenAdd(false);
    };

    const handleClickAdd = () => {
        setOpenAdd(true);
    };

    const serviceCostAdd = () => { 

    };

    const headCells = [
        { columnName: 'ACTION', numeric: 'center', disablePadding: true, label: 'จัดการ', colWidth: 300 },
        { columnName: 'name', numeric: 'center', disablePadding: true, label: 'Dessert (100g serving)', colWidth: 300 },
        { columnName: 'calories', numeric: 'center', disablePadding: false, label: 'Calories', colWidth: 300 },
        { columnName: 'fat', numeric: 'center', disablePadding: false, label: 'Fat (g)', colWidth: 300 },
        { columnName: 'carbs', numeric: 'center', disablePadding: false, label: 'Carbs (g)', colWidth: 300 },
        { columnName: 'protein', numeric: 'center', disablePadding: false, label: 'Protein (g)', colWidth: 300 },
    ];

    // ล้าง excelData เมื่อ dialog เปิด
    useEffect(() => {
        console.log(currentUser,'currentUser');
        
        if (openAdd) {
            setExcelData([]); // ล้างข้อมูล Excel ทุกครั้งที่เปิด dialog
        }
    }, [openAdd, currentUser]);

    useEffect(() => {

        console.log(excelData, 'excelData');



    }, [excelData]);

    return (
        <div>
            <div className="max-lg rounded overflow-hidden shadow-xl bg-white mt-5 mb-5">
                {/* ค้นหาข้อมูล */}
                <div className="px-6 pt-4">
                    <label className="text-2xl ml-2 mt-3 mb-5 sarabun-regular">ค้นหาข้อมูล</label>
                </div>
                <div className="row px-10 pt-0 pb-5">
                    <div className="col-md-3 mb-2">
                        <FullWidthTextField labelName={"สรุปตารางประจำเดือน"} value={''} />
                    </div>
                    <div className="col-md-3 mb-2">
                        <FullWidthTextField labelName={"วันที่นำเข้าข้อมูล"} value={''} />
                    </div>
                    <div className="col-md-3 mb-2">
                        <FullWidthTextField labelName={"."} value={''} />
                    </div>
                    <div className="col-md-3 mb-2">
                        <FullWidthTextField labelName={"คนที่นำเข้าข้อมูล"} value={''} />
                    </div>
                    <div className="flex justify-end pt-2">
                        <div className="col-md-1 px-1">
                            <FullWidthButton
                                labelName={"ค้นหา"}
                                handleonClick={handleSearch}
                                variant_text="contained"
                                colorname={"success"}
                            />
                        </div>
                        <div className="col-md-1 px-1">
                            <FullWidthButton
                                labelName={"รีเซ็ต"}
                                handleonClick={handleReset}
                                variant_text="contained"
                                colorname={"inherit"}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ตารางข้อมูล */}
            <div className="max-lg rounded overflow-hidden shadow-lg bg-white mb-5">
                <div>
                    <EnhancedTable
                        buttonLabal_1={"อัปโหลด Service Cost"}
                        buttonColor_1="info"
                        rows={headCells}
                        headCells={headCells}
                        handleonClick_1={handleClickAdd}
                        tableName={"รายการสรุป Allocate แต่ละเดือน"}
                    />
                </div>

                {/* Dialog สำหรับอัปโหลดไฟล์ */}
                <FuncDialog
                    open={openAdd}
                    dialogWidth="xl"
                    openBottonHidden={true}
                    titlename={'อัปโหลด Service Cost'}
                    handleClose={handleClose}
                    handlefunction={serviceCostAdd}  
                    colorBotton="success"
                    actions={"ImportFile"}
                    element={
                        <ServiceCostBody
                            handleFileUpload={handleFileUpload}
                            excelData={excelData} // ส่งข้อมูลที่ได้จากการอัปโหลดไปยัง ServiceCostBody
                        />} // ส่งฟังก์ชัน handleFileUpload ไปยัง ServiceCostBody
                />
            </div>
        </div>
    );
}
