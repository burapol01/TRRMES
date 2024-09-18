import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Paper from '@mui/material/Paper';
import FullWidthTextField from '../../../components/MUI/FullWidthTextField';
import DataTable from '../../../components/MUI/DataTables';
import BasicDateTimePicker from '../../../components/MUI/DesktopDatePicker';
import AutoCompleteAll from '../../../components/MUI/AutoCompleteAll';
export default function ComponenExample() {
    const headCells = [
        {
            columnName: 'ACTION',
            numeric: 'center',
            disablePadding: true,
            label: 'จัดการ',
            colWidth: 300
        },
        {
            columnName: 'name',
            numeric: 'center',
            disablePadding: true,
            label: 'Dessert (100g serving)',
            colWidth: 300
        },
        {
            columnName: 'calories',
            numeric: 'center',
            disablePadding: false,
            label: 'Calories',
            colWidth: 300
        },
        {
            columnName: 'fat',
            numeric: 'center',
            disablePadding: false,
            label: 'Fat (g)',
            colWidth: 300
        },
        {
            columnName: 'carbs',
            numeric: 'center',
            disablePadding: false,
            label: 'Carbs (g)',
            colWidth: 300
        },
        {
            columnName: 'protein',
            numeric: 'center',
            disablePadding: false,
            label: 'Protein (g)',
            colWidth: 300
        },
    ];
    return (_jsx("div", { children: _jsxs(Paper, { className: 'mb-8', children: [_jsx("label", { htmlFor: "", className: 'text-2xl font-bold py-1 px-5', children: "Example Component" }), _jsx("div", { className: 'container py-5', children: _jsxs("div", { className: 'row', children: [_jsx("div", { className: 'col-md-4', children: _jsx(FullWidthTextField, { labelName: 'TextField', required: 'required' }) }), _jsx("div", { className: 'col-md-4', children: _jsx(BasicDateTimePicker, { labelName: 'DateTimePicker', required: 'required' }) }), _jsx("div", { className: 'col-md-4', children: _jsx(FullWidthTextField, { labelName: 'TextField', required: 'required' }) }), _jsx("div", { className: 'col-md-12', children: _jsx(AutoCompleteAll, {}) }), _jsx("div", { className: 'col-md-12 py-9', children: _jsx(DataTable, { tableName: "TEST TABLE", headCells: headCells, rows: [] }) })] }) })] }) }));
}
