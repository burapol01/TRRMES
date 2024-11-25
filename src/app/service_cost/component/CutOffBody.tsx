import React, { useState, useEffect } from 'react';
import AutocompleteComboBox from '../../../components/MUI/AutocompleteComboBox';
import { _POST } from '../../../service';
import { getCurrentAccessObject } from '../../../service/initmain';
import { useSelector } from 'react-redux';
import BasicTable from '../../../components/MUI/BasicTable';
import { Table_WorkHourSummary_By_ServiceCenter } from '../../../../libs/columnname';
import { debounce } from 'lodash';
import { v4 as uuidv4 } from 'uuid';

interface CutOffBodyProps {
  onDataChange?: (data: any) => void;
};

export default function CutOffBody({ onDataChange }: CutOffBodyProps) {

  const currentYear = new Date().getFullYear();

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    id: uuidv4(),
    label: `เดือน ${String(i + 1).padStart(2, '0')}`, // แปลงเลขเดือนเป็นสองหลัก
    value: i + 1
  }));


  const yearOptions = Array.from({ length: 2 }, (_, i) => {
    const year = currentYear - 1 + i;
    return {
      id: uuidv4(),
      label: year.toString(),
      value: year,
    };
  });
  

  const [selectedMonth, setSelectedMonth] = useState(monthOptions[0]);
  const [selectedYear, setSelectedYear] = useState(yearOptions[2]);

  const currentUser = useSelector((state: any) => state?.user?.user);
  const employeeUsername = currentUser?.employee_username.toLowerCase();
  const employeeDomain = currentUser?.employee_domain;
  const screenName = 'cut_off';

  const [dataList, setDataList] = useState([]);

  const WorkHourSummaryByServiceCenter_Get = async () => {
    try {
      const dataset = {
        WorkHourSummaryByServiceCenterModel: {
          as_of_month: `${selectedMonth.value}/${selectedYear.value}`
        },
        currentAccessModel: getCurrentAccessObject(employeeUsername, employeeDomain, screenName),
      };

      const response = await _POST(dataset, "/api_trr_mes/CutOff/WorkHourSummaryByServiceCenter_Get");

      if (response && response.status === "success" && Array.isArray(response.data)) {
        const updatedData = response.data.map((item: any) => ({
          ...item,
          service_center: item.service_center,
          work_hour_summary: item.work_hour_summary
        }));
        setDataList(updatedData);
      } else {
        console.error('Failed to fetch data:', response);
        setDataList([]); // ตั้งค่า dataList เป็นอาเรย์ว่างเมื่อไม่มีข้อมูล
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setDataList([]); // ตั้งค่า dataList เป็นอาเรย์ว่างเมื่อเกิดข้อผิดพลาด
    }
  };

  useEffect(() => {
    WorkHourSummaryByServiceCenter_Get();
  }, [selectedMonth, selectedYear]);

  const debouncedOnDataChange = debounce((data: any) => {
    if (typeof onDataChange === 'function') {
      onDataChange(data);
    }
  }, 300);

  useEffect(() => {
    const data = {
      selectedMonth,
      selectedYear
    };
    debouncedOnDataChange(data);
  }, [selectedMonth, selectedYear, debouncedOnDataChange]);

  return (
    <div className="border rounded-xl px-2 py-2">
      <div className="row justify-start">
        <div className="col-md-3 mb-2">
          <AutocompleteComboBox
            required="required"
            labelName="เดือน"
            column="label"
            setvalue={setSelectedMonth}
            options={monthOptions}
            value={selectedMonth}
          />
        </div>
        <div className="col-md-3 mb-2">
          <AutocompleteComboBox
            required="required"
            labelName="ปี"
            column="label"
            setvalue={setSelectedYear}
            options={yearOptions}
            value={selectedYear}
          />
        </div>
      </div>
      <BasicTable
        columns={Table_WorkHourSummary_By_ServiceCenter}
        rows={dataList}
        actions="Reade"
        labelHead="ข้อมูลสรุปประจำเดือน"
      />
    </div>
  );
}