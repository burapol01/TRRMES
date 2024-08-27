import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface BasicTableProps {
    rows: any[];
    columns: any[];
    disabled?: boolean; // เพิ่ม prop นี้
}

export default function BasicTable({ rows, columns, disabled = false }: BasicTableProps) {
    return (
        <TableContainer component={Paper} className={disabled ? 'disabled' : ''}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {columns?.map((headCell: any, index: number) => (
                            <TableCell
                                key={headCell.id || index}  // Ensure unique key
                                align={"center"}
                                className={`py-5 border`}
                                style={{ backgroundColor: '#DCCCBD' }}
                            >
                                <label className={"sarabun-regular-datatable"}>
                                    {headCell.label}
                                </label>{" "}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows?.map((row: any, rowIndex: number) => (
                        <TableRow
                            className={`hover:bg-neutral-200 sarabun-regular ${disabled ? 'disabled' : ''}`}
                            tabIndex={-1}
                            key={row.id || rowIndex}  // Ensure unique key for each row
                        >
                            {columns?.map((column: any, cellIndex: number) => {
                                const value = row[column.columnName];
                                return (
                                    <TableCell
                                        key={`${column.columnName}-${cellIndex}`}  // Ensure unique key for each cell
                                        align={column.numeric ? "right" : "left"}
                                        className='border'
                                    >
                                        <label className="fs-6 pr-10 sarabun-regular">
                                            {value}
                                        </label>
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
