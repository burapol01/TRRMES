import * as React from 'react';
import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TextField, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';

interface BasicTableProps {
    rows: any[];
    columns: any[];
    disabled?: boolean;
    actions?: string;
    labelHead?: string; // เพิ่ม labelHead สำหรับหัวข้อรายการ
}

export default function BasicTable({ rows, columns, disabled = false, actions, labelHead }: BasicTableProps) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: SelectChangeEvent<number>) => {
        setRowsPerPage(parseInt(event.target.value as string, 10));
        setPage(0);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setPage(0);
    };

    // Filter rows based on the search query
    const filteredRows = rows.filter((row) =>
        Object.values(row).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // Paginate the filtered rows
    const displayedRows = filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper className={disabled ? 'disabled' : ''} sx={{ width: '100%', overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: 'Sarabun', mr: 'auto' }}>
                    {labelHead}
                </Typography>

                <TextField
                    label="ค้นหา"
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    sx={{ width: '200px' }}
                />
            </Box>
            <TableContainer sx={{ overflow: 'auto' }}>
                <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {columns.map((headCell: any, index: number) => (
                                <TableCell
                                    key={headCell.id || index}
                                    align="center"
                                    sx={{ backgroundColor: '#DCCCBD', minWidth: headCell.colWidth }}
                                >
                                    <label>{headCell.label}</label>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedRows.map((row: any, rowIndex: number) => (
                            <TableRow key={row.id || rowIndex}>
                                {columns.map((column: any, cellIndex: number) => {
                                    const value = row[column.columnName];
                                    return (
                                        <TableCell key={`${column.columnName}-${cellIndex}`} align={column.numeric}>
                                            {value}
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    borderTop: '1px solid #e0e0e0',
                    backgroundColor: '#fafafa',
                }}
            >
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                    จำนวนรายการทั้งหมด: {filteredRows.length}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormControl variant="outlined" size="small" sx={{ mr: 2 }}>
                        <Select
                            value={rowsPerPage}
                            onChange={handleChangeRowsPerPage}
                            displayEmpty
                            renderValue={(selected: number | '') => (selected === '' ? 'แสดงต่อหน้า' : selected.toString())}
                        >
                            {[5, 10, 20, 100].map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Pagination
                        count={Math.ceil(filteredRows.length / rowsPerPage)}
                        page={page + 1}
                        onChange={(event, value) => handleChangePage(event, value - 1)}
                        color="primary"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                '&:hover': {
                                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                },
                            },
                        }}
                        disabled={filteredRows.length === 0}
                    />
                </Box>
            </Box>
        </Paper>
    );
}
