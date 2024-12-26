import * as React from 'react';
import IndeterminateCheckBoxRoundedIcon from '@mui/icons-material/IndeterminateCheckBoxRounded';
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import AddBoxRoundedIcon from '@mui/icons-material/AddBoxRounded';
import { styled, alpha } from '@mui/material/styles';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem, treeItemClasses } from '@mui/x-tree-view/TreeItem';
import { useSelector } from 'react-redux';
import { _GET_ORGREPORT } from '../../service/mas';
import FuncDialog from '../../components/MUI/FullDialog';
import ReportBody from '../../app/report/component/ReportBody';
import { Box, Divider } from '@mui/material';
import TopicIcon from '@mui/icons-material/Topic';
import FullWidthTextField from '../../components/MUI/FullWidthTextField';
import FullWidthButton from '../../components/MUI/FullWidthButton';

const CustomTreeItem = styled(TreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.content}`]: {
    padding: theme.spacing(0.5, 1),
    margin: theme.spacing(0.2, 0),
  },
  [`& .${treeItemClasses.iconContainer}`]: {
    '& .close': {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.groupTransition}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `1px dashed ${alpha(theme.palette.text.primary, 0.4)}`,
  },
}));

function ExpandIcon(props: React.PropsWithoutRef<typeof AddBoxRoundedIcon>) {
  return <AddBoxRoundedIcon {...props} sx={{ opacity: 0.8 }} />;
}

function CollapseIcon(
  props: React.PropsWithoutRef<typeof IndeterminateCheckBoxRoundedIcon>,
) {
  return <IndeterminateCheckBoxRoundedIcon {...props} sx={{ opacity: 0.8 }} />;
}

function EndIcon(props: React.PropsWithoutRef<typeof DisabledByDefaultRoundedIcon>) {
  return <DisabledByDefaultRoundedIcon {...props} sx={{ opacity: 0.3 }} />;
}

export default function BorderedTreeView() {
  const current = useSelector((state: any) => state?.user.user);
  const [dataOrgReport, setDataOrgReport] = React.useState([])
  const [reportList, setReportList] = React.useState([])
  const [reportListName, setReportListName] = React.useState([])
  const [openReport, setOpenReport] = React.useState(false);
  const [dataelement, setdataelement] = React.useState<null>(null);
  const [actionType, setActionType] = React.useState<string | null>(null);

  //------------Start Get service refresh -------------//
  React.useEffect(() => {
    Org_Report_Get();
  }, [current]);

  React.useEffect(() => {
    setDataReport();
  }, [dataOrgReport]);

  //----------------Call : Org_Report_Get -----------------//
  const Org_Report_Get = async () => {
    const dataset = {
      "application_code": import.meta.env.VITE_APP_APPLICATION_CODE,
      "role_id": current?.role_id
    }

    try {
      let response = await _GET_ORGREPORT(dataset, "/OrgReport/Org_Report_by_role_Get");
      console.log(response, "response_Get");
      if (response) {
        setDataOrgReport(response)
      }
    } catch (e) {
      console.log("error");
    }
  };


  const setDataReport = () => {
    let idGroup: any = []
    const newDataMain: any = []
    const newDataName: any = []
    const newData: any = []
    Array.isArray(dataOrgReport) && dataOrgReport.forEach((el: any) => {
      if (!idGroup.includes(el.report_group)) {
        idGroup.push(el.report_group)
        newDataMain.push(el)
      }
    })
    Array.isArray(newDataMain) && newDataMain.forEach((report, index) => {
      const newReport: any = []
      let haedName = ""
      dataOrgReport.forEach((el: any) => {
        if (report.report_group == el.report_group) {
          haedName = el.report_groupname
          newReport.push(el)
        }
      })
      const setdata = {
        haedName: haedName,
        sub_report: newReport
      }
      newDataName.push(`${index}`)
      newData.push(setdata)
      
    })

    setReportListName(newDataName)
    setReportList(newData)

  }

  const hadleOnclickReport = (data: any) => {
    // const VITE_APP_SITE = import.meta.env.VITE_APP_SITE;
    // const VITE_APP = import.meta.env.VITE_APP;
    // const VITE_SITE_PATH = import.meta.env.VITE_SITE_PATH;
    // const VITE_APP_TRR_API_URL_REPORT = import.meta.env.VITE_APP_TRR_API_URL_REPORT;
    // const ReportViewer = "/Pages/ReportViewer.aspx?/";
    // const reportUrl = `${VITE_APP_TRR_API_URL_REPORT}${ReportViewer}${VITE_APP_SITE}/${VITE_APP}/${VITE_SITE_PATH}/Report/${data.report_code}`;
    // window.open(reportUrl, "_blank");
    setOpenReport(true);
    setdataelement(data)
    console.log("Selected Report:", data);
  };

  const handleClose = () => {
    setOpenReport(false)
  };

  const handleSearch = () => {
    setActionType('search');
};

const handleReset = () => {
    setActionType('reset');
};
  return (
    <div>
      <div className="max-lg rounded overflow-hidden shadow-xl bg-white mt-5 mb-5">
        <div className="px-6 pt-4">
          <label className="text-2xl ml-2 mt-3 mb-5 sarabun-regular">Report</label>
        </div>
        <Divider className="mb-5" sx={{ my: 0.1, borderWidth: "1px" }} />
        <div className="row px-10 pt-0 pb-5">
          {reportList.length > 0 && (
            <Box sx={{ minHeight: 352, minWidth: 250 }}>
              <SimpleTreeView
                aria-label="customized"
                defaultExpandedItems={reportListName}
                slots={{
                  expandIcon: ExpandIcon,
                  collapseIcon: CollapseIcon,
                  //endIcon: EndIcon,
                }}

              >
                {reportList.map((el: any, index: number) => (
                  <CustomTreeItem 
                    key={index} 
                    itemId={`${index}`}
                    label={<span className="bold-label sarabun-regular">{el.haedName}</span>}
                    >
                    {el?.sub_report?.map((file: any, index: number) => (
                      <CustomTreeItem
                        //key={`${file.id}-${index}`}
                        itemId={`${file.id}`}
                        label={
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                              src="media/slider/docs.png"
                              alt="icon"
                              style={{ width: '16px', height: '16px', marginRight: '8px' }}
                            />
                             <span className="sarabun-regular">{`[ ${file.report_code} ] ${file.report_name}`}</span>
                          </div>
                        }
                        onClick={() => hadleOnclickReport(file)}
                      />
                    ))}
                  </CustomTreeItem>
                ))}
              </SimpleTreeView>
            </Box>
          )}
        </div>
      </div>
      <FuncDialog
        open={openReport}
        dialogWidth=""
        openBottonHidden={false}
        titlename={""}
        handleClose={handleClose}
        //handlefunction={ticket_Delete}
        colorBotton="success"
        element={
          <ReportBody
            dataelement={dataelement}
          />}
      >
      </FuncDialog>
    </div>
    // <SimpleTreeView
    //   aria-label="customized"
    //   defaultExpandedItems={['1', '3']}
    //   slots={{
    //     expandIcon: ExpandIcon,
    //     collapseIcon: CollapseIcon,
    //     endIcon: EndIcon,
    //   }}
    //   sx={{ overflowX: 'hidden', minHeight: 270, flexGrow: 1, maxWidth: 300 }}
    // >
    //   <CustomTreeItem itemId="1" label="Main">
    //     <CustomTreeItem itemId="2" label="Hello" />
    //     <CustomTreeItem itemId="3" label="Subtree with children">
    //       <CustomTreeItem itemId="6" label="Hello" />
    //       <CustomTreeItem itemId="7" label="Sub-subtree with children">
    //         <CustomTreeItem itemId="9" label="Child 1" />
    //         <CustomTreeItem itemId="10" label="Child 2" />
    //         <CustomTreeItem itemId="11" label="Child 3" />
    //       </CustomTreeItem>
    //       <CustomTreeItem itemId="8" label="Hello" />
    //     </CustomTreeItem>
    //     <CustomTreeItem itemId="4" label="World" />
    //     <CustomTreeItem itemId="5" label="Something something" />
    //   </CustomTreeItem>
    // </SimpleTreeView>
  );
}