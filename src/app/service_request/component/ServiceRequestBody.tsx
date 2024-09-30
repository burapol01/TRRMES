import React, { useState, useEffect } from "react";
import FullWidthTextField from "../../../components/MUI/FullWidthTextField";
import AutocompleteComboBox from "../../../components/MUI/AutocompleteComboBox";
import FullWidthTextareaField from "../../../components/MUI/FullWidthTextareaField";
import StyleImageList from "../../../components/MUI/StandardImageList";
import debounce from 'lodash/debounce';
import { setValueList, setValueMas } from "../../../../libs/setvaluecallback"
import { useListServiceRequest } from "../core/service_request_provider";
import moment from "moment";
import { plg_uploadFileRename } from "../../../service/upload";

interface ServiceRequestBodyProps {
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
  };
  disableOnly?: boolean;
  actions?: string;
}

interface ImageItem {
  img: string;
  title: string;
}

export default function ServiceRequestBody({
  onDataChange,
  defaultValues,
  options,
  disableOnly,
  actions
}: ServiceRequestBodyProps) {
  const { isValidate, setIsValidate, isDuplicate, setIsDuplicate } = useListServiceRequest()
  const [optionServiceCenter, setOptionServiceCenter] = useState<any>(options?.serviceCenter || []);
  const [optionBudgetCode, setOptionBudgetCode] = useState<any>(options?.budgetCode || []);
  const [optionFixedAssetCode, setOptionFixedAssetCode] = useState<any>(options?.fixedAssetCode || []);
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

  const [rejectSubmitReason, setRejectSubmitReason] = useState(defaultValues?.rejectSubmitReason || "");
  const [rejectStartReason, setRejectStartReason] = useState(defaultValues?.rejectStartReason || "");



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
      imageList // เพิ่ม imageList เข้าไปใน data
    };
    // Call debounced function
    debouncedOnDataChange(data);
  }, [
    requestId, requestNo, requestDate, reqUser, appReqUser, costCenterId, costCenterCode, costCenterName,
    status, serviceCenterId, costCenter, serviceCenter, serviceName, site, jobType, budgetCode, description,
    fixedAssetCode, fixedAssetDescription,
    countRevision, onDataChange,
  ]);

  React.useEffect(() => {

    if (actions != "Create") {

      console.log(options?.costCenter, 'dd')
      console.log(defaultValues?.costCenterId, 'costCenterId')

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


  }, [defaultValues])


  // States สำหรับจัดการไฟล์รูปภาพและตัวอย่าง

  //วิธี กรองข้อมูลแบบ เชื่อมความสัมพันธ์
  React.useEffect(() => {
    const filteredData = options?.budgetCode.filter((item: any) =>
      (!costCenter?.costCenterId || item.costCenterId
        .toString()
        .includes(costCenter?.costCenterId)) &&
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

  }, [costCenter, jobType])


  //=========================================== การ Upload File ==========================================
  interface ImageItem {
    file: File | null; // เก็บข้อมูลไฟล์
    name: string;      // ชื่อไฟล์
    type: string | null;      // ประเภทไฟล์
    url: string;       // URL สำหรับแสดง Preview
  }
  // Image Upload handling
  const [imageList, setImageList] = React.useState<ImageItem[]>([]);// กำหนดประเภทของ state เป็น ImageItem[]

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const uploadedFiles: ImageItem[] = files.map((file) => {
      const url = URL.createObjectURL(file); // สร้าง URL สำหรับไฟล์เพื่อแสดง Preview
      return {
        file: file, // เก็บข้อมูลไฟล์
        name: file.name, // ชื่อไฟล์
        type: file.type, // ประเภทไฟล์
        url: url, // URL สำหรับแสดง Preview
      };
    });

    setImageList((prevList) => [...prevList, ...uploadedFiles]); // อัปเดต state ด้วยรายการไฟล์ที่อัปโหลด

    // log หลังจากอัปเดตรายการไฟล์ที่อัปโหลด
    console.log(uploadedFiles, 'uploadedFiles');
  };

  // ฟังก์ชันจัดการการลบภาพ
  const handleRemoveImage = (url: string) => {
    setImageList((prevList) => prevList.filter(image => image.url !== url));
  };

  // Cleanup function
  React.useEffect(() => {
    return () => {
      imageList.forEach((item) => {
        URL.revokeObjectURL(item.url); // ลบ URL blob เพื่อประหยัด memory
      });
    };
  }, [imageList]);

  // Log imageList เพื่อดูค่าของไฟล์ที่อัปโหลด
  React.useEffect(() => {
    console.log(imageList, "imageList"); // log ค่าเมื่อ imageList ถูกอัปเดต
   
  }, [imageList]);

  useEffect(() => {
    const requestAttachFileList = defaultValues?.requestAttachFileList || []; // กำหนดค่าเริ่มต้นเป็นอาเรย์ว่าง
    console.log(actions, 'actions');
    if (actions === "Reade" || actions === "Update" && requestAttachFileList.length > 0) {
      const existingFiles = requestAttachFileList.map((file: any) => ({
        requestAttachFileId: file.id,
        reqId: file.req_id,
        reqSysFilename: file.req_sys_filename,
        file: null,
        name: file.req_user_filename,
        type: null,
        url: file.file_patch
      }));
      console.log(existingFiles, 'existingFilesexistingFiles');
      
      setImageList(existingFiles);
    }
  }, [defaultValues?.requestAttachFileList, actions]);
  
  


  const itemData = [
    {
      img: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
      title: 'Breakfast',
    },
    {
      img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
      title: 'Burger',
    },
    {
      img: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
      title: 'Camera',
    },
    {
      img: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
      title: 'Coffee',
    },
    {
      img: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
      title: 'Hats',
    },
    {
      img: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
      title: 'Honey',
    },
    {
      img: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
      title: 'Basketball',
    },
    {
      img: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
      title: 'Fern',
    },
    {
      img: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
      title: 'Mushrooms',
    },
    {
      img: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
      title: 'Tomato basil',
    },
    {
      img: 'https://images.unsplash.com/photo-1471357674240-e1a485acb3e1',
      title: 'Sea star',
    },
    {
      img: 'https://images.unsplash.com/photo-1589118949245-7d38baf380d6',
      title: 'Bike',
    },
  ];



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
            labelName={"Cost center"}
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
            Validate={isValidate?.costCenter}


          />
          {/* <FullWidthTextField
            labelName={"Cost center"}
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
              // console.log(costCenter,'costCenter💥💥💥💥',data);
              if (costCenter?.costCenterCode == data?.serviceCenterCode) {
                setIsDuplicate(true);
              } else {
                setIsDuplicate(false);
              }

              //setServiceName(data?.serviceCenterName || ""); // Clear serviceName if data is null
            }}
            options={optionServiceCenter || []}
            Validate={isValidate?.serviceCenter}
            ValidateDuplicate={isDuplicate}
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
            Validate={isValidate?.jobType}
          />
        </div>
        <div className="col-md-10 mb-2">
          <AutocompleteComboBox
            required={"required"}
            labelName={"Budget Code"}
            column="budgetCodeAndJobType"
            value={budgetCode}
            setvalue={setBudgetCode}
            disabled={disableOnly}
            options={optionBudgetCode}
            Validate={isValidate?.budgetCode}
          />
        </div>
      </div>
      <div className="row justify-start">
        <div className="col-md-12 mb-2">
          <AutocompleteComboBox
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
            options={optionFixedAssetCode || []}
          />
        </div>





        {/*ฉันต้องการสร้างที่ Upload File รูปตรงนี้ และ Preview*/}
        <div>
          <h1>Image Gallery</h1>
          <div className="upload-container">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="upload-input"
            />
          </div>
          <div className="image-preview-container">
            <StyleImageList
              itemData={imageList.map(image => ({
                img: image.url,
                title: image.name,
              }))}
              onRemoveImage={handleRemoveImage} // ส่งฟังก์ชันลบไปยังคอมโพเนนต์
            />
          </div>
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
      </div>
      {/* ช่อง เหตุผล Reject ================================================ */}
      {rejectSubmitReason !== "" && (
        <div className="row justify-start">
          <div className="col-md-12 mb-2">
            <FullWidthTextareaField
              labelName={"เหตุผลปฎิเสธการส่งข้อมูล"}
              value={rejectSubmitReason}
              disabled={actions === "Create" || actions === "Update" ? true : disableOnly}
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
              labelName={"เหตุผลปฎิเสธเริ่มงาน"}
              value={rejectStartReason}
              disabled={actions === "Create" || actions === "Update" ? true : disableOnly}
              multiline={true}
              onChange={(value) => setRejectStartReason(value)}
            />
          </div>
        </div>
      )}
    </div>

  );
}
