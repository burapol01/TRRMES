import React from 'react';
import { useEffect, useState } from 'react';
import AutocompleteComboBox from '../../../../components/MUI/AutocompleteComboBox';
import FullWidthTextField from '../../../../components/MUI/FullWidthTextField';
import CustomizedSwitches from '../../../../components/MUI/MaterialUISwitch';
import { debounce } from 'lodash';
import { useListConCenter } from '../core/CostCenterProvider';
import { Massengmodal } from '../../../../components/MUI/Massengmodal';
import { setValueMas } from '../../../../../libs/setvaluecallback';

interface CostCenterBodyProps {
  onDataChange?: (data: any) => void;
  defaultValues?: {
    costcenterId: string,
    siteCode: string,
    costcenterCode: string,
    costcenterName: string,
    appReqUser: string,
    serviceCenter: boolean,
  };
  siteData: any[],
  disableOnly?: boolean;
  actions?: string;
}

export default function CostCenterBody({
  onDataChange,
  defaultValues,
  siteData,
  disableOnly,
  actions
}: CostCenterBodyProps) {

  const [costcenterId, setCostCenterId] = useState(defaultValues?.costcenterId || "");
  const [siteCode, setSiteCode] = useState<any>(defaultValues?.siteCode ? defaultValues?.siteCode : null);
  const [costcenterCode, setCostCenterCode] = useState(defaultValues?.costcenterCode || "");
  const [costcenterName, setCostCenterName] = useState(defaultValues?.costcenterName || "");
  const [appReqUser, setAppReqUser] = useState(defaultValues?.appReqUser || "");
  const [serviceCenter, setServiceCenter] = useState(defaultValues?.serviceCenter);
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
      costcenterId,
      siteCode,
      costcenterCode,
      costcenterName,
      appReqUser,
    };
    // Call debounced function : เรียกใช้ฟังก์ชัน debounced
    debouncedOnDataChange(data);
  }, [
    costcenterId, siteCode, costcenterCode, costcenterName, appReqUser, serviceCenter, onDataChange,
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

    // อัปเดตค่า ReqUser หากไม่เกินเงื่อนไข
    setAppReqUser(lowerValue);
  };

  // ========================== ACTION : UPDATE _ DELETE ==========================
  React.useEffect(() => {
    console.log(siteCode);
  },[siteCode])



  return (
    <div>
      <div className='row justify-start'>
        <div className='col-md-6 mb-2'>
          <AutocompleteComboBox
            required={'required'}
            labelName={'Site'}
            column='fullname'
            value={siteCode}
            disabled={actions === "Update" ? true : disableOnly}
            setvalue={(data) => {
              setSiteCode(data);
            }}
            options={siteData || []}
          />
        </div>
        <div className="col-md-6 mb-2">
          <FullWidthTextField
            required={"required"}
            labelName={"Cost Center Code"}
            value={costcenterCode}
            disabled={actions === "Update" ? true : disableOnly}
            onChange={(value) => setCostCenterCode(value)}
            Validate={isValidate?.costcenterCode}
          />
        </div>
        <div className="col-md-6 mb-2">
          <FullWidthTextField
            required={"required"}
            labelName={"ชื่อ Cost Center"}
            description={"กรุณากรอกชื่อศูนย์บริการของคุณ."}
            value={costcenterName}
            disabled={actions === "Create" || actions === "Update" ? false : disableOnly}
            onChange={(value) => setCostCenterName(value)}
            Validate={isValidate?.costcenterName}
          />
        </div>
        <div className="col-md-6 mb-2">
          <FullWidthTextField
            required={"required"}
            labelName={"ผู้อนุมัติ"}
            description={"กรุณากรอกชื่อผู้ใช้ของคุณ (ตัวอย่าง: somchai.jad) เพื่อให้สามารถเข้าถึงระบบได้."}
            value={appReqUser}
            disabled={actions === "Create" || actions === "Update" ? false : disableOnly}
            onChange={handlCostCenterChange} // onChange={(value) => setCostCenterCode(value)}      
            Validate={isValidate?.appReqUser}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
        <div className='flex justify-between items-center'>
          <CustomizedSwitches
            labelName='Service Center'
            checked={serviceCenter}
            handleOnClick={setServiceCenter}
            Validate={isValidate?.serviceCenter}
          />
        </div>
      </div>
    </div>
  )
}
