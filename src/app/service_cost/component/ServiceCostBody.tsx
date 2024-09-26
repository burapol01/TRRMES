import React, { ChangeEvent, useState } from 'react';
import FullWidthTextField from '../../../components/MUI/FullWidthTextField';
import BrowseFileUpload from '../../../components/Tailwind/BrowseFileUpload';

interface ServiceCostBodyProps {
    excelData: any[]; // ข้อมูลที่ได้จาก Excel
    handleFileUpload: (event: ChangeEvent<HTMLInputElement>) => void; // Add this line
}

export default function ServiceCostBody({ excelData, handleFileUpload }: ServiceCostBodyProps) {
    const [file, setFile] = useState<File[]>([]);
    const [validate, setValidate] = useState(false);

    // Handle file selection
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;
        if (selectedFiles && selectedFiles.length > 0) {
            setFile(Array.from(selectedFiles));
            setValidate(false); // Reset validation if a file is selected
            handleFileUpload(event); // Call the prop function
        } else {
            setValidate(true); // Set validation if no file is selected
        }
    };

    return (
        <div>
            {/* Container สำหรับจัดเรียงแนวนอน */}
            <div className="d-flex mb-4">
                {/* Input สำหรับการอัปโหลดไฟล์ */}
                <div className="col-md-6 pr-4">
                    <BrowseFileUpload
                        file={file}
                        setFile={setFile}
                        labelname="อัปโหลดไฟล์ Excel"
                        required="required" // Use to style the label or for validation indication
                        validate={validate}
                        onChange={handleFileChange} // Pass the new handler
                    />
                </div>

                {/* TextField สำหรับสรุปตาราง */}
                <div className="col-md-3">
                    <FullWidthTextField labelName={"สรุปตารางประจำเดือน"} value={''} />
                </div>
            </div>

            {/* Preview ตารางที่ได้จาก Excel */}
            {excelData.length > 0 && (
                <table className="table table-bordered mt-4">
                    <thead>
                        <tr>
                            {Object.keys(excelData[0]).map((key, index) => (
                                <th key={index}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {excelData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {Object.values(row).map((value, colIndex) => (
                                    <td key={colIndex}>{String(value)}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
