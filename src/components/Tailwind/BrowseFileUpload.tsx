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
            const fileName_: string | undefined = event.target.files?.[0]?.name;
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
        <div className="my-3 mx-3 w-96">
            <label className={`${required} fs-5 sarabun-regular text-gray-800`}>{labelname}</label>
            <div className="flex items-center">
                <TextField
                    value={fileName}
                    size="small"
                    placeholder="ไม่ได้เลือกไฟล์"
                    disabled
                    error={validate}
                    sx={{
                        width: "100%",
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
                <a
                    className="flex items-center justify-center bg-yellow-500 h-12 w-14 rounded-md hover:bg-yellow-400 transition duration-300 ease-in-out"
                    onClick={startUploadFile}
                >
                    <DriveFolderUploadIcon sx={{ fontSize: 40, color: "white" }} />
                </a>

            </div>
            <input
                type="file"
                onChange={handleFileChange}
                ref={inputFile}
                style={{ display: "none" }}
                accept=".xls, .xlsx" // Allow only Excel file types
            />
            {validate &&
                <label htmlFor="" className="text-[9px] text-red-600">{`*** กรุณาอัปโหลดไฟล์ ${labelname} ***`}</label>
            }
        </div>
    );
}
