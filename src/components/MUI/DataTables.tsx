
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
import {
  Checkbox,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import FullWidthButton from "./FullWidthButton";

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof any
  ) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: any;
  setDataSelect?: (val: any) => void;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    order,
    orderBy,
    onRequestSort,
    headCells,
    numSelected,
    rowCount,
    onSelectAllClick,
    setDataSelect,
  } = props;
  const createSortHandler =
    (property: keyof any) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };
  return (
    <TableHead>
      <TableRow>
        {setDataSelect && (
          <TableCell padding="checkbox" className={`py-5`} style={{ backgroundColor: '#DCCCBD' }}>
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onClick={(e: any) => onSelectAllClick(e)}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          </TableCell>
        )}
        {headCells.map((headCell: any) => (
          <TableCell
            key={headCell.columnName}
            align={"center"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.columnName ? order : false}
            className={`py-5`}
            style={{ backgroundColor: '#DCCCBD' }}
          //sx={{backgroundColor:'bg-gray-300',color:'red'}}
          >
            <TableSortLabel
              active={orderBy === headCell.columnName}
              direction={orderBy === headCell.columnName ? order : "asc"}
              onClick={createSortHandler(headCell.columnName)}
            >
              <label className={"sarabun-regular-datatable"}>
                {headCell.label}
              </label>{" "}
              {orderBy === headCell.columnName ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
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
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Nutrition
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

interface EnhancedTable {
  tableName?: string;

  buttonLabal_1?: string;
  buttonLabal_2?: string;
  buttonLabal_3?: string;
  buttonColor_1?: string;
  buttonColor_2?: string;
  buttonColor_3?: string;
  handleonClick_1?: () => void;
  handleonClick_2?: () => void;
  handleonClick_3?: () => void;

  headCells: any;
  rows: any;
  setDataSelect?: (val: any) => void;
}

export default function EnhancedTable({
  tableName,
  buttonLabal_1,
  buttonLabal_2,
  buttonLabal_3,
  buttonColor_1,
  buttonColor_2,
  buttonColor_3,
  headCells,
  rows,
  handleonClick_1,
  handleonClick_2,
  handleonClick_3,
  setDataSelect,
}: EnhancedTable) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<string>("calories");
  const [selected, setSelected] = React.useState<any>([]);
  const [page, setPage] = React.useState(1);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRow, setSelectedRow] = React.useState<number | null>(null);
  //console.log(rows, 'row')
  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof any
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    //console.log(property, "property");

    setOrderBy(String(property));
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: SelectChangeEvent) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.

  const filteredData = rows.filter((item: any) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const visibleRows = React.useMemo(
    () =>
      stableSort(filteredData, getComparator(order, orderBy)).slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filteredData]
  );

  const _isSelected = (el: any) => {
    const newData = selected;
    for (const i in newData) {
      if (Object.is(el, newData[i])) {
        console.log(true, i);
        return true;
      }
    }
    return false;
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = visibleRows;
      setSelected(newSelected);
      setDataSelect && setDataSelect(newSelected);
      return;
    }
    setSelected([]);
    setDataSelect && setDataSelect([]);
  };

  const handleClick = async (el: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleRowClick = (rowIndex: any) => {
    setSelectedRow(rowIndex === selectedRow ? null : rowIndex);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%" }}>
        {/* <EnhancedTableToolbar numSelected={selected.length} /> */}
        <div className="px-6 pt-4">
          <label className="text-2xl ml-2 mt-3 mb-5 sarabun-regular">
            {tableName}
          </label>
        </div>
        <Divider className="mb-5" sx={{ my: 0.1, borderWidth: "1px" }} />
        <div
          className={`flex items-center ${handleonClick_1 || handleonClick_2 || handleonClick_3
              ? `justify-between`
              : `justify-end`
            }`}
        >
          {/* {handleonClick_1 ||handleonClick_2 ||handleonClick_3 && */}
          <div className="flex pl-2 px-8">
            {buttonLabal_1 && buttonColor_1 && handleonClick_1 && (
              <div className="">
                <FullWidthButton
                  iconAdd={true}
                  labelName={buttonLabal_1}
                  handleonClick={handleonClick_1}
                  colorname={buttonColor_1}
                  variant_text="contained"
                />
              </div>
            )}
            {buttonLabal_2 && buttonColor_2 && handleonClick_2 && (
              <div className="flex pl-2">
                <FullWidthButton
                  iconAdd={true}
                  labelName={buttonLabal_2}
                  handleonClick={handleonClick_2}
                  colorname={buttonColor_2}
                  variant_text="contained"
                />
              </div>
            )}
            {buttonLabal_3 && buttonColor_3 && handleonClick_3 && (
              <div className="flex pl-2">
                <FullWidthButton
                  iconAdd={true}
                  labelName={buttonLabal_3}
                  handleonClick={handleonClick_3}
                  colorname={buttonColor_3}
                  variant_text="contained"
                />
              </div>
            )}
          </div>

          {/* } */}
          <div className={`flex mr-2 py-5 px-8`}>
            <TextField
              placeholder="Search"
              variant="outlined"
              size="small"
              onChange={(e) => {
                setSearchQuery(e.target.value), setPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </div>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCells}
              setDataSelect={setDataSelect}
            />
            <TableBody>
              {visibleRows &&
                visibleRows.map((row: any, index: number) => {
                  // const isItemSelected = isSelected(row?.id);
                  return (
                    <TableRow
                      className={`hover:bg-neutral-200 sarabun-regular`}
                      role="checkbox"
                      // aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                    // selected={selectedRow === index}
                    // onClick={() => handleRowClick(index)}
                    >
                      {setDataSelect && (
                        <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={_isSelected(row)}
                            onClick={() => handleClick(row)}
                          // inputProps={{
                          //   "aria-labelledby": labelId,
                          // }}
                          />
                        </TableCell>
                      )}
                      {/* {headCells?.map((column: any, index: number) => {
                        const value = row[column.columnName];
                        return (
                          <>
                            <TableCell key={index} align={column.numeric}>
                              <label className="fs-6 pr-10 sarabun-regular">
                                {value}
                              </label>
                            </TableCell>
                          </>
                        );
                      })} */}
                      {headCells?.map((column: any, index: number) => {
                        const value = row[column.columnName];
                        return (
                          <TableCell key={column.columnName} align={column.numeric}>
                            <label className="fs-6 pr-10 sarabun-regular">
                              {value}
                            </label>
                          </TableCell>
                        );
                      })}

                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container>
          <Grid item xs={12} py={1}>
            <Grid
              container
              justifyContent={"flex-end"}
              alignItems={"center"}
              spacing={2}
              px={2}
            >
              <Grid item>
                <FormControl size="small">
                  <Select
                    labelId="demo-simple-select-label"
                    // id="demo-simple-select"
                    value={String(rowsPerPage)}
                    // label="Age"
                    onChange={handleChangeRowsPerPage}
                    size="small"
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item>
                <Pagination
                  variant="outlined"
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                  count={
                    isNaN(Math.ceil(filteredData?.length / rowsPerPage))
                      ? 0
                      : Math.ceil(filteredData?.length / rowsPerPage)
                  }
                />
              </Grid>
              <Grid item>
                <label className="sarabun-regular">
                  {filteredData?.length > 0 &&
                    "จำนวนรายการทั้งหมด " + filteredData?.length + " รายการ"}
                </label>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
      </Paper>
      {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      /> */}
    </Box>
  );
}
