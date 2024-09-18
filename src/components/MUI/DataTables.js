import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import SearchIcon from "@mui/icons-material/Search";
import { Checkbox, Divider, FormControl, Grid, InputAdornment, MenuItem, Pagination, Select, TextField, } from "@mui/material";
import FullWidthButton from "./FullWidthButton";
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}
function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}
// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}
function EnhancedTableHead(props) {
    const { order, orderBy, onRequestSort, headCells, numSelected, rowCount, onSelectAllClick, setDataSelect, } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    return (_jsx(TableHead, { children: _jsxs(TableRow, { children: [setDataSelect && (_jsx(TableCell, { padding: "checkbox", className: `py-5`, style: { backgroundColor: '#DCCCBD' }, children: _jsx(Checkbox, { color: "primary", indeterminate: numSelected > 0 && numSelected < rowCount, checked: rowCount > 0 && numSelected === rowCount, onClick: (e) => onSelectAllClick(e), inputProps: {
                            "aria-label": "select all desserts",
                        } }) })), headCells.map((headCell) => (_jsx(TableCell, { align: "center", padding: headCell.disablePadding ? "none" : "normal", sortDirection: orderBy === headCell.columnName ? order : false, className: `py-5`, style: { backgroundColor: '#DCCCBD', minWidth: headCell.colWidth }, children: _jsxs(TableSortLabel, { active: orderBy === headCell.columnName, direction: orderBy === headCell.columnName ? order : "asc", onClick: createSortHandler(headCell.columnName), children: [_jsx("label", { className: "sarabun-regular-datatable", children: headCell.label }), " ", orderBy === headCell.columnName ? (_jsx(Box, { component: "span", sx: visuallyHidden, children: order === "desc" ? "sorted descending" : "sorted ascending" })) : null] }) }, headCell.columnName)))] }) }));
}
function EnhancedTableToolbar(props) {
    const { numSelected } = props;
    return (_jsxs(Toolbar, { sx: {
            pl: { sm: 2 },
            pr: { xs: 1, sm: 1 },
            ...(numSelected > 0 && {
                bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
        }, children: [numSelected > 0 ? (_jsxs(Typography, { sx: { flex: "1 1 100%" }, color: "inherit", variant: "subtitle1", component: "div", children: [numSelected, " selected"] })) : (_jsx(Typography, { sx: { flex: "1 1 100%" }, variant: "h6", id: "tableTitle", component: "div", children: "Nutrition" })), numSelected > 0 ? (_jsx(Tooltip, { title: "Delete", children: _jsx(IconButton, { children: _jsx(DeleteIcon, {}) }) })) : (_jsx(Tooltip, { title: "Filter list", children: _jsx(IconButton, { children: _jsx(FilterListIcon, {}) }) }))] }));
}
export default function EnhancedTable({ tableName, buttonLabal_1, buttonLabal_2, buttonLabal_3, buttonColor_1, buttonColor_2, buttonColor_3, headCells, rows, handleonClick_1, handleonClick_2, handleonClick_3, setDataSelect, roleName, }) {
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("calories");
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(1);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedRow, setSelectedRow] = React.useState(null);
    //console.log(rows, 'row')
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        //console.log(property, "property");
        setOrderBy(String(property));
    };
    const handleChangePage = (_event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };
    const isSelected = (id) => selected.indexOf(id) !== -1;
    // Avoid a layout jump when reaching the last page with empty rows.
    const filteredData = rows.filter((item) => Object.values(item).some((value) => value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())));
    const visibleRows = React.useMemo(() => stableSort(filteredData, getComparator(order, orderBy)).slice((page - 1) * rowsPerPage, page * rowsPerPage), [order, orderBy, page, rowsPerPage, filteredData]);
    const _isSelected = (el) => {
        const newData = selected;
        for (const i in newData) {
            if (Object.is(el, newData[i])) {
                console.log(true, i);
                return true;
            }
        }
        return false;
    };
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = visibleRows;
            setSelected(newSelected);
            setDataSelect && setDataSelect(newSelected);
            return;
        }
        setSelected([]);
        setDataSelect && setDataSelect([]);
    };
    const handleClick = async (el) => {
        const newData = selected;
        for (const i in newData) {
            if (Object.is(el, newData[i])) {
                newData.splice(i, 1);
                await setSelected([]);
                await setSelected(newData);
                setDataSelect && await setDataSelect([]);
                setDataSelect && await setDataSelect(newData);
                return;
            }
        }
        newData.push(el);
        // console.log(newData)
        await setSelected([]);
        await setSelected(newData);
        setDataSelect && await setDataSelect([]);
        setDataSelect && await setDataSelect(newData);
    };
    const handleRowClick = (rowIndex) => {
        setSelectedRow(rowIndex === selectedRow ? null : rowIndex);
    };
    return (_jsx(Box, { sx: { width: "100%" }, children: _jsxs(Paper, { sx: { width: "100%" }, children: [_jsx("div", { className: "px-6 pt-4", children: _jsx("label", { className: "text-2xl ml-2 mt-3 mb-5 sarabun-regular", children: tableName }) }), _jsx(Divider, { className: "mb-5", sx: { my: 0.1, borderWidth: "1px" } }), _jsxs("div", { className: `flex items-center ${handleonClick_1 || handleonClick_2 || handleonClick_3
                        ? `justify-between`
                        : `justify-end`}`, children: [_jsxs("div", { className: "flex pl-2 px-8", children: [buttonLabal_1 && buttonColor_1 && handleonClick_1 && roleName !== "Approver" && (_jsx("div", { className: "", children: _jsx(FullWidthButton, { iconAdd: true, labelName: buttonLabal_1, handleonClick: handleonClick_1, colorname: buttonColor_1, variant_text: "contained" }) })), buttonLabal_2 && buttonColor_2 && handleonClick_2 && (_jsx("div", { className: "flex pl-2", children: _jsx(FullWidthButton, { iconAdd: true, labelName: buttonLabal_2, handleonClick: handleonClick_2, colorname: buttonColor_2, variant_text: "contained" }) })), buttonLabal_3 && buttonColor_3 && handleonClick_3 && (_jsx("div", { className: "flex pl-2", children: _jsx(FullWidthButton, { iconAdd: true, labelName: buttonLabal_3, handleonClick: handleonClick_3, colorname: buttonColor_3, variant_text: "contained" }) }))] }), _jsx("div", { className: `flex mr-2 py-5 px-8`, children: _jsx(TextField, { placeholder: "\u0E04\u0E49\u0E19\u0E2B\u0E32", variant: "outlined", size: "small", onChange: (e) => {
                                    setSearchQuery(e.target.value), setPage(1);
                                }, InputProps: {
                                    startAdornment: (_jsx(InputAdornment, { position: "start", children: _jsx(SearchIcon, {}) })),
                                } }) })] }), _jsx(TableContainer, { children: _jsxs(Table, { sx: { minWidth: 750 }, "aria-labelledby": "tableTitle", size: dense ? "small" : "medium", children: [_jsx(EnhancedTableHead, { numSelected: selected.length, order: order, orderBy: orderBy, onSelectAllClick: handleSelectAllClick, onRequestSort: handleRequestSort, rowCount: rows.length, headCells: headCells, setDataSelect: setDataSelect }), _jsx(TableBody, { children: visibleRows &&
                                    visibleRows.map((row, index) => {
                                        // const isItemSelected = isSelected(row?.id);
                                        return (_jsxs(TableRow, { className: `hover:bg-neutral-200 sarabun-regular`, role: "checkbox", 
                                            // aria-checked={isItemSelected}
                                            tabIndex: -1, children: [setDataSelect && (_jsx(TableCell, { padding: "checkbox", children: _jsx(Checkbox, { color: "primary", checked: _isSelected(row), onClick: () => handleClick(row) }) })), headCells?.map((column, index) => {
                                                    const value = row[column.columnName];
                                                    return (_jsx(TableCell, { align: column.numeric, children: _jsx("label", { className: "fs-6 pr-10 sarabun-regular", children: value }) }, column.columnName));
                                                })] }, index));
                                    }) })] }) }), _jsx(Grid, { container: true, children: _jsx(Grid, { item: true, xs: 12, py: 1, children: _jsxs(Grid, { container: true, justifyContent: "flex-end", alignItems: "center", spacing: 2, px: 2, children: [_jsx(Grid, { item: true, children: _jsx(FormControl, { size: "small", children: _jsxs(Select, { labelId: "demo-simple-select-label", 
                                            // id="demo-simple-select"
                                            value: String(rowsPerPage), 
                                            // label="Age"
                                            onChange: handleChangeRowsPerPage, size: "small", children: [_jsx(MenuItem, { value: 5, children: "5" }), _jsx(MenuItem, { value: 10, children: "10" }), _jsx(MenuItem, { value: 20, children: "20" })] }) }) }), _jsx(Grid, { item: true, children: _jsx(Pagination, { variant: "outlined", page: page, onChange: handleChangePage, color: "primary", count: isNaN(Math.ceil(filteredData?.length / rowsPerPage))
                                            ? 0
                                            : Math.ceil(filteredData?.length / rowsPerPage) }) }), _jsx(Grid, { item: true, children: _jsx("label", { className: "sarabun-regular", children: filteredData?.length > 0 &&
                                            "จำนวนรายการทั้งหมด " + filteredData?.length + " รายการ" }) })] }) }) })] }) }));
}
