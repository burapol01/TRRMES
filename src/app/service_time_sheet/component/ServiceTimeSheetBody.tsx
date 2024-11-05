import React, { useState, useEffect } from "react";
import FullWidthTextField from "../../../components/MUI/FullWidthTextField";
import AutocompleteComboBox from "../../../components/MUI/AutocompleteComboBox";
import FullWidthTextareaField from "../../../components/MUI/FullWidthTextareaField";
import debounce from 'lodash/debounce';
import { setValueList, setValueMas } from "../../../../libs/setvaluecallback"
import TimeSheetBody from "./TimeSheetBody";
import StyleImageList from "../../../components/MUI/StandardImageList";
// Import CSS styles
import "../../../app/service_time_sheet/css/choose_file.css";
import { createFilterOptions } from "@mui/material";

interface ServiceTimeSheetBodyProps {
  onDataChange?: (data: any) => void;
  defaultValues?: {
    requestNo: string;
    requestDate: string;
    requestId?: string;
    reqUser?: string;
    appReqUser?: string;
    costCenterId?: string;
    costCenterCode?: string;
    costCenterName?: string;
    status?: string;
    site?: string;
    siteId?: string;
    countRevision?: string;
    serviceCenterId?: string;
    jobType?: string;
    budgetCode?: string;
    description?: string;
    fixedAssetId?: string;
    fixedAssetDescription?: string;
    rejectSubmitReason?: string,
    rejectStartReason?: string,
    requestAttachFileList?: any[];
  };
  options?: {
    costCenter: any[];
    serviceCenter: any[];
    jobType: any[];
    budgetCode: any[];
    fixedAssetCode: any[];
    revision: any[];
    technician: any[];
    workHour: any[];
  };
  disableOnly?: boolean;
  actions?: string;

}

export default function ServiceTimeSheetBody({
  onDataChange,
  defaultValues,
  options,
  disableOnly,
  actions
}: ServiceTimeSheetBodyProps) {
  const [optionServiceCenter, setOptionServiceCenter] = useState<any>(options?.serviceCenter || []);
  const [optionBudgetCode, setOptionBudgetCode] = useState<any>(options?.budgetCode || []);
  const [optionFixedAssetCode, setOptionFixedAssetCode] = useState<any>(options?.fixedAssetCode || []);
  const [optionRevision, setOptionRevision] = useState<any>(options?.revision || []);
  const [requestNo, setRequestNo] = useState(defaultValues?.requestNo || "");
  const [requestDate, setRequestDate] = useState(defaultValues?.requestDate || "");
  const [requestId, setRequestId] = useState(defaultValues?.requestId || "");
  const [reqUser, setEmployee] = useState(defaultValues?.reqUser || "");
  const [appReqUser, setheadUser] = useState(defaultValues?.appReqUser || "");
  const [costCenterId, setCostCenterId] = useState(defaultValues?.costCenterId || "");
  const [costCenterCode, setCostCenterCode] = useState(defaultValues?.costCenterCode || "");
  const [costCenterName, setCostCenterName] = useState(defaultValues?.costCenterName || "");
  const [status, setStatus] = useState(defaultValues?.status || "Draft");
  const [serviceCenterId, setServiceCenterId] = useState(defaultValues?.serviceCenterId || "");
  const [costCenter, setCostCenter] = useState<any>(null);
  const [serviceCenter, setServiceCenter] = useState<any>(null);
  const [serviceName, setServiceName] = useState("");
  const [site, setSite] = useState(defaultValues?.site || "");
  const [jobType, setJobType] = useState<any>(null);
  const [budgetCode, setBudgetCode] = useState<any>(null);
  const [description, setDescription] = useState("");
  const [fixedAssetCode, setFixedAssetCode] = useState<any>(null);
  const [fixedAssetDescription, setFixedAssetDescription] = useState("");
  const [countRevision, setCountRevision] = useState(defaultValues?.countRevision || "1");
  const [revisionCurrent, setRevisionCurrent] = useState<any>(null);
  const [timeSheetData, settimeSheetData] = useState<any>(null); // State to store draft data  

  const [rejectSubmitReason, setRejectSubmitReason] = useState(defaultValues?.rejectSubmitReason || "");
  const [rejectStartReason, setRejectStartReason] = useState(defaultValues?.rejectStartReason || "");

  const handleDataChange = (data: any) => {
    settimeSheetData(data); // Store draft data
  };

  // Function to handle data change with debounce
  const debouncedOnDataChange = debounce((data: any) => {
    if (typeof onDataChange === 'function') {
      onDataChange(data);
    }
  }, 300); // Adjust debounce delay as needed

  // useEffect to send data change to parent component
  useEffect(() => {
    const data = {
      requestId,
      requestNo,
      requestDate,
      reqUser,
      appReqUser,
      costCenterId,
      costCenterCode,
      costCenterName,
      status,
      serviceCenterId,
      costCenter,
      serviceCenter,
      serviceName,
      site,
      jobType,
      budgetCode,
      description,
      fixedAssetCode,
      fixedAssetDescription,
      countRevision,
      revisionCurrent,
      timeSheetData,
      imageList // เพิ่ม imageList เข้าไปใน data
    };
    // Call debounced function
    debouncedOnDataChange(data);
  }, [
    requestId, requestNo, requestDate, reqUser, appReqUser, costCenterId, costCenterCode, costCenterName,
    status, serviceCenterId, costCenter, serviceCenter, serviceName, site, jobType, budgetCode, description,
    fixedAssetCode, fixedAssetDescription,
    countRevision, revisionCurrent, timeSheetData, onDataChange,
  ]);

  React.useEffect(() => {

    if (actions != "Create") {

      // console.log(defaultValues?.siteId, 'siteId')
      // console.log(options?.costCenter, 'dd')
      // console.log(defaultValues?.costCenterId, 'costCenterId')

      if (defaultValues?.costCenterId != "") {
        const mapCostCenterData = setValueMas(options?.costCenter, defaultValues?.costCenterId, 'costCenterId')
        //console.log(mapCostCenterData, 'mapCostCenterData')
        setCostCenter(mapCostCenterData)
      }

      if (defaultValues?.serviceCenterId != "") {
        const mapCostCenterData = setValueMas(options?.serviceCenter, defaultValues?.serviceCenterId, 'serviceCenterId')
        // console.log(mapCostCenterData, 'mapCostCenterData')
        setServiceCenter(mapCostCenterData)
        setServiceName(mapCostCenterData?.serviceCenterName)
      }

      if (defaultValues?.jobType != "") {
        const mapJobTypeData = setValueMas(options?.jobType, defaultValues?.jobType, 'lov_code')
        //console.log(mapJobTypeData, 'mapJobTypeData')
        setJobType(mapJobTypeData)
      }

      if (defaultValues?.budgetCode != "") {
        const mapBudgetData = setValueMas(options?.budgetCode, defaultValues?.budgetCode, 'budgetId')
        //console.log(mapBudgetData, 'mapBudgetData')
        setBudgetCode(mapBudgetData)


      }

      if (defaultValues?.status != "") {
        setStatus(defaultValues?.status || "")
      }

      if (defaultValues?.countRevision != "") {
        setCountRevision(defaultValues?.countRevision || "")

      }
      if (defaultValues?.description != "") {
        setDescription(defaultValues?.description || "")

      }

      if (defaultValues?.fixedAssetId != "") {
        const mapfixedAssetData = setValueMas(options?.fixedAssetCode, defaultValues?.fixedAssetId, 'assetCodeId')
        //console.log(defaultValues?.fixedAssetId, 'mapfixedAssetData')
        setFixedAssetCode(mapfixedAssetData)
        //setFixedAssetDescription(mapfixedAssetData?.assetDescription)

      }

      if (defaultValues?.appReqUser != "") {
        //console.log(defaultValues?.appReqUser, 'appReqUser')
        setheadUser(defaultValues?.appReqUser || "");
      }     

    }


  }, [defaultValues, options?.fixedAssetCode])

  //เปลี่ยนเป็นเรียกครั้งเดียว ในการ ดึงข้อมูล Revision มาแสดง
  React.useMemo(() => {
    if (defaultValues?.requestId !== "") {
        console.log(actions, 'actions');
        console.log(options?.revision, 'revision');
        console.log(defaultValues?.requestId, 'requestId');

        // รับค่า data จาก setValueList
        const data: any[] = setValueList(options?.revision, defaultValues?.requestId, 'reqId') || []; // ใช้ || [] เพื่อให้ค่าเป็นอาเรย์ว่างถ้าเป็น undefined

        console.log(data, 'mapRevisionData');

        // ตรวจสอบความยาวของ data
        if (data.length > 0) {
            setOptionRevision(data);
            setRevisionCurrent(data[0]);
            console.log(revisionCurrent, "revisionCurrent");
        } else {
            setOptionRevision([]);
        }

        return data; // คืนค่า data
    }
    return []; // คืนค่าอาเรย์ว่างถ้า requestId ไม่ถูกตั้งค่า
}, []); // กำหนด dependencies




  //AutocompleteComboBox ===================================================================================================================
  //ตัวกรองข้อมูลแค่แสดง 200 แต่สามารถค้นหาได้ทั้งหมด
  const OPTIONS_LIMIT = 100;
  const defaultFilterOptions = createFilterOptions();

  const filterOptions = (options: any[], state: any) => {
    return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT);
  };

  //วิธี กรองข้อมูลแบบ เชื่อมความสัมพันธ์ =====================================================================================
  React.useEffect(() => {
   
    const filteredData = options?.budgetCode.filter((item: any) =>
      // (!costCenter?.costCenterId || item.costCenterId
      //   .toString()
      //   .includes(costCenter?.costCenterId)) && //โน้ตไว้ถ้าเกิดผูก Cost Center ให้ ปลดคอมเม้้นท์ออก
      (!jobType?.lov_code || item.jobType
        .toString()
        .includes(jobType?.lov_code))

    );
    //console.log(filteredData, 'filteredData');
    //ใส่ useState ใหม่ 
    setOptionBudgetCode(filteredData);

    const filterFixedAssetCode = options?.fixedAssetCode.filter((item: any) =>
    (!costCenter?.costCenterId || item.costCenterId
      .toString()
      .includes(costCenter?.costCenterId || costCenter))
    );

    //ใส่ useState ใหม่ 
    setOptionFixedAssetCode(filterFixedAssetCode)
    //console.log(filterFixedAssetCode, 'filterFixedAssetCode');

    const filterServiceCenter = options?.serviceCenter.filter((item: any) =>
    (!costCenter?.siteCode || item.siteCode
      .toString()
      .includes(costCenter?.siteCode || costCenter))
    );

    setOptionServiceCenter(filterServiceCenter);

  }, [actions, reqUser,costCenter, jobType])
//AutocompleteComboBox ===================================================================================================================

  // States สำหรับจัดการไฟล์รูปภาพและตัวอย่าง
  //=========================================== การ Upload File ==========================================
  interface ImageItem {
    file: File | null; // เก็บข้อมูลไฟล์
    name: string;      // ชื่อไฟล์
    type: string | null;      // ประเภทไฟล์
    url: string;       // URL สำหรับแสดง Preview
    flagDeleteFile?: boolean; // Flag สำหรับระบุว่ารูปนี้ถูกลบหรือไม่
    flagNewFile?: boolean;    // Flag สำหรับระบุว่ารูปนี้เป็นรูปใหม่
  }
  // Image Upload handling
  const [imageList, setImageList] = React.useState<ImageItem[]>([]);// กำหนดประเภทของ state เป็น ImageItem[]
  const [imageListView, setImageListView] = useState<ImageItem[]>([]); // เก็บข้อมูลสำหรับการแสดงผล


  // การอัปโหลดไฟล์
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const uploadedFiles: ImageItem[] = files.map((file) => {
      const url = URL.createObjectURL(file); // สร้าง URL สำหรับไฟล์เพื่อแสดงผล
      return {
        file: file,
        name: file.name,
        type: file.type,
        url: url,
        flagNewFile: true,  // รูปนี้เป็นรูปใหม่
        flagDeleteFile: false // รูปนี้ยังไม่ได้ถูกลบ
      };
    });

    setImageList((prevList) => [...prevList, ...uploadedFiles]); // อัปเดตไฟล์ใน imageList
    setImageListView((prevList) => [...prevList, ...uploadedFiles]); // อัปเดตการแสดงผลไฟล์
  };

  // ฟังก์ชันจัดการการลบภาพ
  const handleRemoveImage = (url: string) => {
    setImageList((prevList) =>
      prevList.map((image) =>
        image.url === url ? { ...image, flagDeleteFile: true } : image
      )
    ); // ตั้งค่า flagDeleteFile เป็น true ใน imageList

    // ลบภาพจากการแสดงผลใน imageListView
    setImageListView((prevList) =>
      prevList.filter((image) => image.url !== url)); // ลบภาพจากการแสดงผลใน imageListView



  };

  // โหลดไฟล์ที่มีอยู่แล้ว
  useEffect(() => {
    // ล้างค่า imageList และ imageListView ทุกครั้งก่อนที่จะโหลดไฟล์ใหม่
    setImageList([]);
    setImageListView([]);
    const requestAttachFileList = defaultValues?.requestAttachFileList || []; // กำหนดค่าเริ่มต้นเป็นอาเรย์ว่าง
    console.log(requestAttachFileList, 'requestAttachFileList');

    if (requestAttachFileList.length > 0) {
      const existingFiles = requestAttachFileList.map((file: any) => ({
        requestAttachFileId: file.id,
        reqId: file.req_id,
        reqSysFilename: file.req_sys_filename,
        filePatch: file.file_patch,
        file: null,
        name: file.req_user_filename,
        type: null,
        url: file.file_patch,
        flagNewFile: false, // รูปที่มีอยู่แล้ว
        flagDeleteFile: false // ยังไม่ได้ถูกลบ
      }));
      console.log(existingFiles, 'existingFilesexistingFiles');

      setImageList(existingFiles); // เก็บข้อมูลไฟล์ใน imageList
      setImageListView(existingFiles); // แสดงผลไฟล์
    }
  }, [defaultValues?.requestAttachFileList, actions]);


  // Cleanup URLs เมื่อ component ถูกลบ
  // useEffect(() => {
  //   return () => {
  //     if (Array.isArray(imageList)) {
  //       imageList.forEach((item) => {
  //         if (item.url.startsWith("blob:")) {
  //           URL.revokeObjectURL(item.url);
  //         }
  //       });
  //     }

  //     if (Array.isArray(imageListView)) {
  //       imageListView.forEach((item) => {
  //         if (item.url.startsWith("blob:")) {
  //           URL.revokeObjectURL(item.url);
  //         }
  //       });
  //     }

  //   };
  // }, [imageList, imageListView]);


  // Log การอัปเดตของ imageList And imageListView

  // useEffect(() => {
  //   console.log(imageList, "imageList");
  //   console.log(imageListView, "imageListView");
  // }, [imageList, imageListView]);


  return (
    <div>
      <div className="row justify-start">
        <div className="col-md-3 mb-2">
          <FullWidthTextField
            labelName={"เลขที่ใบคำขอ"}
            value={requestNo}
            onChange={(value) => setRequestNo(value)}
            disabled={actions === "Create" || actions === "Update" ? true : disableOnly}
            hidden={actions === "Create" ? true : false}
          />
        </div>
        {actions !== "Create" && (
          <div className="col-md-3 mb-2">
            <FullWidthTextField
              labelName={"วันที่สร้างใบคำขอ"}
              value={requestDate}
              onChange={(value) => setRequestDate(value)}
              disabled={actions === "Create" || actions === "Update" ? true : disableOnly}
              hidden={actions === "Create" ? true : false}
            />
          </div>
        )}
      </div>
      <div className="row justify-start">

        <div className="col-md-3 mb-2">
          <FullWidthTextField
            labelName={"พนักงาน"}
            value={reqUser}
            onChange={(value) => setEmployee(value)}
            disabled={actions === "Create" || actions === "Update" ? true : disableOnly}
          />
        </div>
        <div className="col-md-3 mb-2">
          <AutocompleteComboBox
            required={"required"}
            labelName={"Cost Center"}
            column="costCentersCodeAndName"
            value={costCenter}
            disabled={disableOnly}
            setvalue={(data) => {
              setCostCenter(data);
              setSite(data?.siteCode || "");

              setServiceCenter(null)
              setServiceName("")
              setJobType(null)
              setBudgetCode(null)
              setFixedAssetCode(null)
              //setFixedAssetDescription("")
            }}
            options={options?.costCenter || []}
          />
          {/* <FullWidthTextField
            labelName={"Cost Center"}
            value={costCenterName + " [" + costCenterCode + "]"}
            onChange={(value) => setCostCenter(value)}
            disabled={actions === "Create" || actions === "Update" ? true : disableOnly}

          /> */}
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
            labelName={"สถานะ"}
            value={status}
            disabled={actions === "Create" || actions === "Update" ? true : disableOnly}
            onChange={(value) => setStatus(value)}
          />
        </div>
        <div className="col-md-3 mb-2">
          <FullWidthTextField
            labelName={"CountRevision"}
            value={countRevision}
            onChange={(value) => setCountRevision(value)}
            hidden={true}
            disabled={disableOnly}
          />
        </div>
      </div>
      <div className="row justify-start">
        <div className="col-md-12 mb-2">
          <AutocompleteComboBox
            required={"required"}
            labelName={"Service Center"}
            column="serviceCentersCodeAndName"
            value={serviceCenter}
            disabled={disableOnly}
            setvalue={(data) => {
              setServiceCenter(data);
              //setServiceName(data?.serviceCenterName || ""); // Clear serviceName if data is null
            }}
            options={optionServiceCenter || []}
          />
        </div>
        {/* <div className="col-md-3 mb-2">
          <FullWidthTextField
            labelName={"Service Name"}
            value={serviceName}
            disabled={actions === "Create" || actions === "Update" ? true : disableOnly}
            onChange={(value) => setServiceName(value)}
          />
        </div> */}
        <div className="col-md-2 mb-2">
          <AutocompleteComboBox
            required={"required"}
            labelName={"ประเภทงาน"}
            column="lov_name"
            value={jobType}
            setvalue={(data) => {
              //console.log(data, "job");
              setJobType(data)
              setBudgetCode(null)
            }}
            disabled={disableOnly}
            options={options?.jobType || []}
          />
        </div>
        <div className="col-md-10 mb-2">
          <AutocompleteComboBox
            filterOptions={filterOptions}
            required={"required"}
            labelName={"Budget Code"}
            column="budgetCodeAndJobType"
            value={budgetCode}
            setvalue={setBudgetCode}
            disabled={disableOnly}
             options={optionBudgetCode} //ตัวนี้คือผูกความสัมพันธ์กับ Cost Center
            //options={options?.budgetCode}
          />
        </div>
      </div>
      <div className="row justify-start">
        <div className="col-md-12 mb-2">
          <AutocompleteComboBox
            filterOptions={filterOptions}
            //required={"required"}
            labelName={"Fixed Asset Code"}
            column="assetCodeAndDescription"
            value={fixedAssetCode}
            disabled={disableOnly}
            setvalue={(data) => {
              // console.log(data,'data');              
              setFixedAssetCode(data);
              //setFixedAssetDescription(data?.assetDescription || "");
            }}
            //options={optionFixedAssetCode || []} //ตัวนี้คือผูกความสัมพันธ์กับ Cost Center
            options={options?.fixedAssetCode || []} 
          />
        </div>


        <div className="gallery-container">
          {/* เงื่อนไขในการแสดงปุ่มเลือกไฟล์ */}
          {imageListView.length === 0 ? (
            <div className="no-image-container">
              <p style={{ fontSize: '24px', color: '#999' }}>No Image</p>
            </div>
          ) : (
            <StyleImageList
              itemData={imageListView.map((image) => ({
                img: image.url,
                title: image.name,
              }))}
              onRemoveImage={handleRemoveImage}
              actions={"Reade"}
            />
          )}
        </div>


        {/* <div className="col-md-9 mb-2">
          <FullWidthTextareaField
            labelName={"Fixed Asset Description"}
            value={fixedAssetDescription}
            disabled={actions === "Create" || actions === "Update" ? true : disableOnly}
            multiline={false}
            onChange={(value) => setFixedAssetDescription(value)}
          />
        </div> */}
      </div>
      <div className="row justify-start">
        <div className="col-md-12 mb-2">
          <FullWidthTextareaField
            labelName={"รายละเอียด"}
            value={description}
            disabled={disableOnly}
            multiline={true}
            onChange={(value) => setDescription(value)}
          />
        </div>
        {/* ช่อง เหตุผล Reject ================================================ */}
        {rejectSubmitReason !== "" && (
          <div className="row justify-start">
            <div className="col-md-12 mb-2">
              <FullWidthTextareaField
                labelName={"เหตุผลปฎิเสธการส่งข้อมูล"}
                value={rejectSubmitReason}
                disabled={disableOnly}
                multiline={true}
                onChange={(value) => setRejectSubmitReason(value)}
              />
            </div>
          </div>
        )}
        {rejectStartReason !== "" && (
          <div className="row justify-start">
            <div className="col-md-12 mb-2">
              <FullWidthTextareaField
                labelName={"เหตุผลในการปฎิเสธเริ่มงาน"}
                value={rejectStartReason}
                disabled={disableOnly}
                multiline={true}
                onChange={(value) => setRejectStartReason(value)}
              />
            </div>
          </div>
        )}

        {/* ช่อง เหตุผล Reject ==================================================*/}
        {actions != "AcceptJob" && (
          <>
            <div className="col-md-3 mb-2">
              <AutocompleteComboBox
                labelName={"Revision"}
                column="revisionNo"
                value={revisionCurrent}
                setvalue={setRevisionCurrent}
                disabled={actions === "Reade" ? false : disableOnly}
                options={optionRevision || []}
                orchange={(value) => setRevisionCurrent(value)} // แก้ไขจาก orchange เป็น onChange
              />
            </div>

            <div className="col-md-12 mb-2">
              <TimeSheetBody
                onDataChange={handleDataChange}
                options={options}
                serviceCenter={serviceCenter}
                revisionCurrent={revisionCurrent}
                siteId={defaultValues?.siteId}
                actions={actions}

              />
            </div>
          </>)}
      </div>
    </div>
  );
}
