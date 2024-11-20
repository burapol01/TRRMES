import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { grey } from "@mui/material/colors";

interface AutocompleteComboBox {
  filterOptions?: any;
  value?: any; // เปลี่ยนเป็น any เพื่อรองรับ object
  labelName: string;
  description?: string;  // เพิ่ม prop สำหรับคำอธิบาย
  required?: string;
  disabled?: boolean;
  readonly?: boolean;
  orchange?: (value: string) => void;
  column?: string;
  ColumnConcat?: string;
  options?: any[];
  setvalue?: (value: any) => void;
  Validate?: boolean;
  ValidateDuplicate?: boolean;
}

export default function AutocompleteComboBox(props: AutocompleteComboBox) {
  const { value, labelName, required, setvalue, options = [], column, disabled, readonly, ValidateDuplicate, filterOptions } = props;

  const handleOnChange = (e: any, newValue: any) => {
    //console.log(newValue);
    if (newValue === null) {
      // ถ้าค่าที่เลือกเป็น null (เมื่อกดปุ่มเคลียร์)
      setvalue && setvalue(null);
    } else {
      // ถ้าค่าที่เลือกเป็นค่าที่ไม่ใช่ null
      setvalue && setvalue(newValue);
    }
  };

  return (
    <>
      <label htmlFor="" className={`${required} fs-5 py-2 sarabun-regular`}>
        {labelName}
      </label>
      <Autocomplete
        filterOptions={filterOptions}
        sx={{

          width: "100%"
        }}
        disablePortal
        value={value? value : null}
        id="combo-box-demo"
        options={options ? options : []}
        getOptionLabel={(option) => option[`${column}`]}
        renderOption={(props, option) => {
          //console.log(option[`${column}`]); // Debugging
          return (
            <li {...props} key={`${option[`${column}`]}`}>
              {option[`${column}`]}
            </li>)
        }}


        onChange={handleOnChange}
        disabled={disabled}
        readOnly={readonly}
        isOptionEqualToValue={(option, value) => option?.id === value?.id} // เปรียบเทียบ option กับ value โดยใช้ id
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="กรุณาเลือก"
            size="small"
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "black", // For text color in WebKit browsers
              },
              "& .MuiInputBase-root.Mui-disabled": {
                backgroundColor: "rgb(241,241,244)", // Background color for the disabled input
              },
              "& .MuiOutlinedInput-root": {
                fontFamily: "Sarabun",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: props.Validate ? "#d50000" : "",
                },
                "&.Mui-focused": {
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "info.main",
                  },
                },
              },
            }}
          />
        )}
      />
      {props.description && (
        <p style={{ color: "gray", fontSize: "0.875rem", marginTop: "4px" }}>
          {props.description}
        </p>
      )}
      {props.Validate && (
        <p style={{ color: "#d50000", fontSize: "0.875rem", marginTop: "4px" }}>
          กรุณาเลือกข้อมูล
        </p>
      )}
      {props.ValidateDuplicate && (
        <p style={{ color: "#d50000", fontSize: "0.875rem", marginTop: "4px" }}>
          Service Center ห้ามเลือกซ้ำกับ Cost Center
        </p>
      )}
    </>
  );
}
