import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { Check, FlashOnRounded } from '@mui/icons-material';

interface Data {
    id: number;
    name: string;
    requestNo: string;
    jobType: string;
    createDate: string;
    costCenter: string;
    serviceCenter: string;
    status: string;
    userReq: string;
    // fixed Asset Description
    // Description รายละเอียด
    // Work hour ชั่วโมงการทำงานรวม
    // userReq คนที่สร้างคำขอ 
    // userApprove คนที่อนุมัติ
    // current revision
    // updateDate วันที่อัปเดตสถานะล่าสุด
}

function createData(
    id: number,
    name: string,
    requestNo: string,
    jobType: string,
    createDate: string,
    costCenter: string,
    serviceCenter: string,
    status: string,
    userReq: string,
): Data {
  return {
    id,
    requestNo,
    jobType,
    createDate,
    name,
    costCenter,
    serviceCenter,
    status,
    userReq,
  };
}

const rows = [
  createData(1, 'a', "305", "3.7", "67", "4.3","", "", "3"),
  createData(2, 'b', "452", "25.0", "51", "4.9","", "", "2"),
  createData(3, 'c', "262", "16.0", "24", "6.0", "", "", "1"),
  createData(4, 'asd', "159", "6.0", "24", "4.0", "", "", "0"),
  createData(5, 'asd', "356", "16.0", "49", "3.9", "", "", "4"),
  createData(6, 'assd', "408", "3.2", "87", "6.5", "", "", "7"),
  createData(7, 'asd ', "237", "9.0", "37", "4.3", "", "", "29"),
  createData(8, 'yh ', "375", "0.0", "94", "0.0","3", "", " 31"),
  createData(9, 'xd', "518", "26.0", "65", "7.0", "", "", "23"),
  createData(10, 'asx', "392", "0.2", "98", "0.0", "", "", "15"),
  createData(11, 'acd', "318", "0", "81", "2.0", "a", "", "21"),
  createData(12, 'adf', "360", "19.0", "9", "37.0", "b", "", "2"),
  createData(13, 'ef', "437", "18.0", "63", "4.0", "c", "","serser "),
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: 'name',
    numeric: false,
    disablePadding: true,
    label: 'ชื่อ',
  },
  {
    id: 'requestNo',
    numeric: false,
    disablePadding: true,
    label: 'เลขที่ใบคำขอ',
  },
  {
    id: 'jobType',
    numeric: false,
    disablePadding: true,
    label: 'ประเภทของงาน',
  },
  {
    id: 'costCenter',
    numeric: false,
    disablePadding: true,
    label: 'Cost Center',
  },
  {
    id: 'serviceCenter',
    numeric: false,
    disablePadding: true,
    label: 'Service Center',
  },
  {
    id: 'createDate',
    numeric: false,
    disablePadding: true,
    label: 'วันที่สร้าง',
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: true,
    label: 'สถานะ',
  },
];

interface EnhancedTableProps {
    numSelected: number;
    onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = 
        (property: keyof Data ) => (event: React.MouseEvent<unknown>) => {
            onRequestSort(event, property);
        };
    
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{
                            "aria-label": 'select all lists',
                        }}
                    />
                </TableCell>
                {headCells.map((headCell) => 
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'center'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{ backgroundColor: "rgb(220, 204, 189)", minidth: 150 }}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ?(
                                <Box component="span" sx={visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </Box>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                )}
            </TableRow>
        </TableHead>
    );
}
interface EnhancedTableToolbarProps {
    numSelected: number;
}
function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
    const { numSelected } = props;
    return (
        <Toolbar
            sx={[
                {
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1},
                },
                numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                },
            ]}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} Selected
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    รายการขออนุมัติ
                </Typography>
            )}
            {numSelected > 0 ? (
                <Tooltip title="Delete">
                    <IconButton>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Filter list">
                    <IconButton>
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
            )} 
        </Toolbar>
    );
}

//Test

export default function EnhancedTable () {
    const [ order, setOrder ] = React.useState<Order>('asc');
    const [ orderBy, setOrderBy ] = React.useState<keyof Data>("requestNo");
    const [ selected, setSelected ] = React.useState<readonly number[]>([]);
    const [ page, setPage ] = React.useState(0);
    const [ rowsPerPage, setRowsPerPage ] = React.useState(5);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected: readonly number[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10),)
        setPage(0);
    };

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = 
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const visibleRows = React.useMemo(
        () =>
            [...rows]
                .sort(getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
            [order, orderBy, page, rowsPerPage],
    );

    return (
        <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} />
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby='tableTitle'
                        size={"medium"}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            onSelectAllClick={handleSelectAllClick}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {visibleRows.map((row, index) => {
                                const isItemSelected = selected.includes(row.id);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.id)}
                                        role="chceckbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.id}
                                        selected={isItemSelected}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                                inputProps={{
                                                    'aria-labelledby': labelId,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                                {row.name}
                                        </TableCell>
                                        <TableCell align='center'>{row.requestNo}</TableCell>
                                        <TableCell align='center'>{row.jobType}</TableCell>
                                        <TableCell align='center'>{row.createDate}</TableCell>
                                        <TableCell align='center'>{row.name}</TableCell>
                                        <TableCell align='center'>{row.costCenter}</TableCell>
                                        <TableCell align='center'>{row.status}</TableCell>
                                        <TableCell align='center'>{row.userReq}</TableCell>
                                    </TableRow>
                                );
                            })}
                            {emptyRows > 0 && (
                                <TableRow 
                                    style={{
                                        height: 70 * emptyRows,
                                    }}
                                >
                                    <TableCell colSpan={6} />    
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination 
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
