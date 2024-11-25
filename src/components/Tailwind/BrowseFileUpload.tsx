import { TextField } from "@mui/material";
import React, { ChangeEvent } from "react";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

interface BrowseFileUploadProps {
    file: any;
    setFile: (arg: any) => void;
    labelname?: string;
    required?: string;
    validate?: boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BrowseFileUpload({
    file,
    setFile,
    labelname,
    required,
    validate,
    onChange
}: BrowseFileUploadProps) {
    const inputFile = React.useRef<HTMLInputElement>(null);
    const [fileName, setFileName] = React.useState<string | undefined>("");

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        try {
            const fileName_ = event.target.files?.[0]?.name;
            setFileName(fileName_);
            if (!event.target.files) return;

            const files: File[] = [];
            for (const file of event.target.files) {
                files.push(file);
            }

            setFile([...files]);
            onChange(event);

            event.target.value = "";
        } catch (e) {
            console.log(e);
        }
    };

    const startUploadFile = () => {
        if (inputFile.current) {
            inputFile.current.click();
        }
    };

    return (
        <div className="my-3 w-full">
            <label className={`${required} fs-5 sarabun-regular text-gray-800`}>
                {labelname}
            </label>
            <div className="relative grid grid-cols-12 gap-2 items-center w-full">
                {/* ช่องสำหรับแสดงชื่อไฟล์ */}
                <div className="col-span-12 min-w-0">
                    <TextField
                        value={fileName}
                        size="small"
                        placeholder="ไม่ได้เลือกไฟล์"
                        disabled
                        error={validate}
                        fullWidth
                        sx={{
                            "& .MuiInputBase-input.Mui-disabled": {
                                WebkitTextFillColor: "black",
                            },
                            "& .MuiInputBase-root": {
                                backgroundColor: "white",
                            },
                            "& .MuiInputBase-root.Mui-disabled": {
                                backgroundColor: "rgb(241,241,244)",
                            },
                            "& .MuiOutlinedInput-root": {
                                fontFamily: "Sarabun",
                                fontSize: 14,
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: validate ? "#d50000" : "",
                                },
                                "&.Mui-focused": {
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "info.main",
                                    },
                                },
                            },
                        }}
                    />
                </div>
                {/* ปุ่ม Browse แบบสี่เหลี่ยม */}
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex justify-center items-center bg-yellow-500 h-12 w-24 rounded-md hover:bg-yellow-400 transition duration-300 ease-in-out cursor-pointer">
                    <a
                        className="flex items-center justify-center w-full h-full"
                        onClick={startUploadFile}
                    >
                        <DriveFolderUploadIcon sx={{ fontSize: 30, color: "white" }} />
                    </a>
                </div>
            </div>
            <input
                type="file"
                onChange={handleFileChange}
                ref={inputFile}
                style={{ display: "none" }}
                accept=".xls, .xlsx"
            />
            {validate && (
                <label htmlFor="" className="text-[9px] text-red-600">
                    {`*** กรุณาอัปโหลดไฟล์ ${labelname} ***`}
                </label>
            )}
        </div>
    );
}
