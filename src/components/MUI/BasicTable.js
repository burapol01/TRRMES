import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
export default function BasicTable({ rows, columns, disabled = false, actions }) {
    return (_jsx(TableContainer, { component: Paper, className: disabled ? 'disabled' : '', children: _jsxs(Table, { sx: { minWidth: 650 }, "aria-label": "simple table", children: [_jsx(TableHead, { children: _jsx(TableRow, { children: columns?.map((headCell, index) => (_jsxs(TableCell, { align: "center", className: `py-5 border`, style: { backgroundColor: '#DCCCBD', minWidth: headCell.colWidth }, children: [_jsx("label", { className: "sarabun-regular-datatable", children: headCell.label }), " "] }, headCell.id || index))) }) }), _jsx(TableBody, { children: rows?.map((row, rowIndex) => (_jsx(TableRow, { className: `hover:bg-neutral-200 sarabun-regular ${disabled ? 'disabled' : ''}`, tabIndex: -1, children: columns?.map((column, cellIndex) => {
                            const value = row[column.columnName];
                            return (_jsx(TableCell, { align: column.numeric, className: 'border', children: _jsx("label", { className: "fs-6 pr-10 sarabun-regular", children: value }) }, `${column.columnName}-${cellIndex}`));
                        }) }, row.id || rowIndex))) })] }) }));
}
