import React, { Component, useEffect, useState } from 'react'
import FullWidthTextField from '../../../../components/MUI/FullWidthTextField';
import { debounce } from 'lodash';
import AutocompleteComboBox from '../../../../components/MUI/AutocompleteComboBox';
import { useListUser } from '../core/user_provider';
import { Massengmodal } from '../../../../components/MUI/Massengmodal';
import { setValueMas } from '../../../../../libs/setvaluecallback';
interface UserBodyProps {
  onDataChange?: (data: any) => void;
  defaultValues?: {
    userId: string;
    userAd: string;
    userName: string;
    costCenterId: string;
  };
  options?: {
    costCenter: any[];
    serviceCenter: any[];
    costAndServiceCenters: any[];
  };
  disableOnly?: boolean;
  actions?: string;
}

export default function UserBody({
  onDataChange,
  defaultValues,
  options,
  disableOnly,
  actions
}: UserBodyProps) {

  const [userId, setUserId] = useState(defaultValues?.userId || "");
  const [userAd, setUserAd] = useState(defaultValues?.userAd || "");
  const [userName, setUserName] = useState(defaultValues?.userName || "");
  const [costCenter, setCostCenter] = useState<any>(null);
  const [appReqUser, setAppReqUser] = useState("");
  const [site, setSite] = useState("");
  const { isValidate, setIsValidate } = useListUser();

  //================================== การทำงานสำหรับส่งข้อมูลกลีบไปยังหน้าหลัก ===========================================
  // Function to handle data change with debounce
  const debouncedOnDataChange = debounce((data: any) => {
    if (typeof onDataChange === 'function') {
      onDataChange(data);
    }
  }, 300); // Adjust debounce delay as needed

  // useEffect to send data change to parent component
  useEffect(() => {
    const data = {
      userId,
      userAd,
      userName,
      costCenter
    };
    // Call debounced function
    debouncedOnDataChange(data);
  }, [
    userId, userAd, userName, costCenter, onDataChange,
  ]);
  //================================== การทำงานสำหรับส่งข้อมูลกลีบไปยังหน้าหลัก ===========================================
  //--------------------------- ข้อมูล User ที่ดึงมาจากการพิมพ์
  const handleUserAdChange = (value: any) => {
    // แปลงค่าที่กรอกเป็นตัวพิมพ์เล็ก
    const lowerValue = value.toLowerCase().trim(); // ลบ Space ที่ต้นและปลาย
  
    // ตรวจสอบว่ามีเฉพาะตัวอักษรภาษาอังกฤษ, จุด, หรือ @ เท่านั้น
    const isValid = /^[a-z.@]*$/.test(lowerValue);
  
    if (!isValid) {
      Massengmodal.createModal(
        <div className="text-center p-4">
          <p className="text-xl font-semibold mb-2 text-green-600">กรุณากรอกเฉพาะตัวอักษรภาษาอังกฤษเท่านั้น.</p>
        </div>,
        'error',
        async () => {}
      );
      return; // หากมีอักขระที่ไม่ใช่ภาษาอังกฤษ ให้หยุดการพิมพ์
    }
  
    // ตรวจสอบการมี Space ติดมาที่ต้นหรือปลายของสตริง
    if (value !== value.trim()) {
      Massengmodal.createModal(
        <div className="text-center p-4">
          <p className="text-xl font-semibold mb-2 text-green-600">
            กรุณาลบ "ช่องว่าง" ที่ต้นหรือปลายของตัวอักษรหรือที่ Copy มาจากที่อื่นอาจมีช่องว่างติดมาด้วย.</p>
        
        </div>,
        'error',
        async () => {}
      );
      return; // หากมี Space ติดมาที่ต้นหรือปลาย ให้หยุดการอัปเดต
    }
  
    // ตรวจสอบว่ามี "." หรือไม่
    const indexOfDot = lowerValue.indexOf('.');
  
    if (indexOfDot !== -1 && lowerValue.length - indexOfDot > 4) {
      // หากมีจุดและตัวอักษรหลังจุดเกิน 3 ตัว จะหยุดการเพิ่มตัวอักษร
      return;
    }
  
    // อัปเดตค่า userAd หากไม่เกินเงื่อนไข
    setUserAd(lowerValue);
  };
  

  React.useEffect(() => {

    if (actions != "Create") {

      console.log(options?.costAndServiceCenters, 'costAndServiceCenters')
      console.log(defaultValues?.costCenterId, 'costCenterId')

      if (defaultValues?.costCenterId != "") {
        const mapCostCenterData = setValueMas(options?.costAndServiceCenters, defaultValues?.costCenterId, 'costCenterId')
        //console.log(mapCostCenterData, 'mapCostCenterData')
        setCostCenter(mapCostCenterData)
        setSite(mapCostCenterData.costCentersSiteCode)
        setAppReqUser(mapCostCenterData.appReqUser)
      }     

    }


  }, [defaultValues])

  return (
    <div>
      <div className="row justify-start">
        <div className="col-md-6 mb-2">
          <AutocompleteComboBox
            required={"required"}
            labelName={"Cost Center & Service Center"}
            description={"กรุณาพิมพ์คำว่า Service Center หากต้องการค้นหา."}
            column="costCentersCodeAndName"
            value={costCenter}
            disabled={actions === "Update" ? true : disableOnly}
            setvalue={(data) => {
              setCostCenter(data);
              setSite(data?.costCentersSiteCode || "");
              setAppReqUser(data?.appReqUser || "");
            }}
            options={options?.costAndServiceCenters || []}
            Validate={isValidate?.costCenter}
          />
        </div>
        <div className="col-md-3 mb-2">
          <FullWidthTextField
            labelName={"Site"}
            value={site}
            disabled={actions === "Create" || actions === "Update" ? true : disableOnly}
            onChange={(value) => setSite(value)}
          />
        </div>
        <div className="col-md-3 mb-2">
          <FullWidthTextField
            labelName={"ผู้อนุมัติ"}
            value={appReqUser}
            disabled={actions === "Create" || actions === "Update" ? true : disableOnly}
            onChange={(value) => setAppReqUser(value)}
          />
        </div>
      </div>
      <div className="row justify-start" style={{ marginTop: '20px' }}>
        <div className="col-md-6 mb-2">
          <FullWidthTextField
            required={"required"}
            labelName={"User AD"}
            description={"กรุณากรอกชื่อผู้ใช้ของคุณ (ตัวอย่าง: somchai.jad) เพื่อให้สามารถเข้าถึงระบบได้."}
            value={userAd}
            onChange={handleUserAdChange} // ใช้ฟังก์ชันใหม่// แปลงค่าที่กรอกเป็นตัวพิมพ์เล็ก
            disabled={actions === "Reade" || actions === "Delete" ? true : disableOnly}
            Validate={isValidate?.userAd}
          //hidden={actions === "Create" ? true : false}
          />
        </div>
        <div className="col-md-6 mb-2">
          <FullWidthTextField
            required={"required"}
            labelName={"ชื่อผู้ใช้งาน"}
            description={"กรุณากรอกชื่อและนามสกุลเต็มของคุณ (ตัวอย่าง: นายสมชาย ใจดี)."}
            value={userName}
            onChange={(value) => setUserName(value)}
            disabled={actions === "Reade" || actions === "Delete" ? true : disableOnly}
            Validate={isValidate?.userName}
          //hidden={actions === "Create" ? true : false}
          />
        </div>
      </div>

    </div>
  )
}
