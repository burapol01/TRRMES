import { Tooltip } from "@mui/material";



const UserActionsCell = () => {
 
  return (
    <>
      <Tooltip title={'จัดการ'}>
        <a
          href="#"
          className="btn btn-light-warning  btn-active-light-warning btn-sm"
          data-kt-menu-trigger="click"
          data-kt-menu-placement="bottom-end"
        >
          {`...`}

          {/* <KTIcon iconName="down" className="fs-5 m-0" /> */}
        </a>
      </Tooltip>
      {/* begin::Menu */}
      <div
        className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4"
        data-kt-menu="true"
      >
        {/* begin::Menu item */}
        <div className="menu-item px-3">
          <a className="menu-link px-3 hover:scale-90" >
            ดูข้อมูล
          </a>
        </div>
        <div className="menu-item px-3">
          <a className="menu-link px-3 hover:scale-90">
            แก้ไข
          </a>
        </div>
        <div className="menu-item px-3">
          <a
            className="menu-link px-3 hover:scale-90"
          >
            ตรวจสอบ
          </a>
        </div>
        {/* end::Menu item */}
      </div>
      {/* end::Menu */}
    </>
  );
};

export default UserActionsCell ;
