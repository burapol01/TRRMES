import React, { Component, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { useListConCenter } from '../core/CostCenterProvider';
import { Massengmodal } from '../../../../components/MUI/Massengmodal';
import { setValueMas } from '../../../../../libs/setvaluecallback';

interface CostCenterBodyProps {
  onDataChange?: (data: any) => void;
  defaultValues?: {
    siteCode: string,
    costcenterCode: string,
    costcenterName: string,
    appreqUser: string,
  };
  options?: {
    Site: any[],
    CostCenter: any[],
  };
  disableOnly?: boolean;
  actions?: string;
}

export default function CostCenterBody({
  onDataChange,
  defaultValues,
  options,
  disableOnly,
  actions
}: CostCenterBodyProps) {
  const [siteCode, setSiteCode] = useState("");
  const [costcenterCode, setCostCenterCode] = useState(defaultValues?.costcenterCode || "");
  const [costcenterName, setCostCenterName] = useState(defaultValues?.costcenterCode || "");
  const [appreqUser, setAppReqUser] = useState(defaultValues?.appreqUser || "");
  const { isValidate, setIsValidate } = useListConCenter();

  //================================== การทำงานสำหรับส่งข้อมูลกลีบไปยังหน้าหลัก ===========================================
  // ฟังก์ชั่นสำหรับจัดการการเปลี่ยนแปลงข้อมูลด้วย debounce
  const debouncedOnDataChange = debounce((data: any) => {
    if (typeof onDataChange === 'function') {
      onDataChange(data);
    }
  }, 300); // Adjust debounce delay as needed

  // useEffect เพื่อส่งการเปลี่ยนแปลงข้อมูลไปยังส่วนประกอบหลัก
  useEffect(() => {
    const data = {
      siteCode,
      costcenterCode,
      costcenterName,
      appreqUser
    };
    // Call debounced function : เรียกใช้ฟังก์ชัน debounced
    debouncedOnDataChange(data);
  }, [
    siteCode, costcenterCode, costcenterName, appreqUser, onDataChange,
  ]);

  //================================== การทำงานสำหรับส่งข้อมูลกลีบไปยังหน้าหลัก ===========================================
  //--------------------------- ข้อมูล Cost Center ที่ดึงมาจากการพิมพ์
  const handlCostCenterChange = (value: any) => {
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
        async () => { }
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
        async () => { }
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
    setSiteCode(lowerValue);
  };

  // React.useEffect(() => {
  //   if (actions != "Create") {
  //     console.log(options?.masterCostCenter, 'masterCostCenter')
  //     // console.log(defaultValues?.costCenterId, 'costCenterId')

  //     if (defaultValues?.costCenterId != "") {
  //       const mapCostCenterData = setValueMas(options?.masterCostCenter, defaultValues?.costCenter), 'costCenterId')
  //       // setCostCenter(mapCostCenterData)
  //       // setSite(mapCostCenterData.costCentersSiteCode)
  //       setAppReqUser(mapCostCenterData.appReqUser)
  //     }
  //   }
  // }, [defaultValues])

  return (
    <div>
    </div>
  )
}
