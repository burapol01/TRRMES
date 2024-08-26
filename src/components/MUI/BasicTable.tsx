import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface BasicTable {
    rows: any;
    columns: any;
}

export default function BasicTable({ rows, columns }: BasicTable) {
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        {columns?.map((headCell: any, index:number) => (
                            <TableCell
                                key={index}
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
                    {rows?.map((row: any, index: number) => {
                        // const isItemSelected = isSelected(row?.id);
                        return (
                            <TableRow
                                className={`hover:bg-neutral-200 sarabun-regular`}
                                tabIndex={-1}
                                key={index}

                            >
                                {columns?.map((column: any, index: number) => {
                                    const value = row[column.columnName];
                                    return (
                                        <>
                                            <TableCell key={index} align={column.numeric} className='border'>
                                                <label className="fs-6 pr-10 sarabun-regular">
                                                    {value}
                                                </label>
                                            </TableCell>
                                        </>
                                    );
                                })}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
