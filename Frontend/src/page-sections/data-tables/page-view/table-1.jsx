import { Fragment, useCallback, useEffect, useState } from 'react'; // MUI

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination'; // REACT TABLE

import { flexRender, useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel } from '@tanstack/react-table'; // CUSTOM PAGE SECTION COMPONENT

import TableActions from '../table-actions/TableActions';
import TableColumnFilter from '../table-column-filter/TableColumnFilter'; // CUSTOM COMPONENTS

import Scrollbar from '@/components/scrollbar'; // CUSTOM DUMMY DATA

import { BodyTableRow, BodyTableCell, HeadTableCell } from './styles'; // TABLE COLUMN SHAPE

import { columns } from '../columns';
export default function DataTablePageView({ initialData = [] }) {
  const [userList, setUserList] = useState(initialData);
  const [allUsers, setAllUsers] = useState(initialData);
  useEffect(() => {
    setUserList(initialData);
    setAllUsers(initialData);
  }, [initialData]);
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    columns,
    data: userList,
    enableRowSelection: true,
    state: {
      rowSelection
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  }); // SELECTED ROW DATA LIST

  const SELECTED_ROWS = table.getSelectedRowModel().flatRows; // ANY SPECIFIC COLUMN FILTERING EXIST OR NOT

  const HAS_COLUMN_FILTER = table.getState().columnFilters.length; // HANDLE GLOBAL SEARCH BASED ON NAME

  const handleSearch = useCallback(text => {
    if (text) {
      const updatedUserList = allUsers.filter(item => {
        return item.name.toLowerCase().includes(text.toLowerCase());
      });
      setUserList(updatedUserList);
    } else {
      setUserList(allUsers);
    }
  }, [allUsers]); // RESET ALL COLUMN FILTERING IF EXIST

  const handleResetColumnFilter = useCallback(() => {
    table.resetColumnFilters();
  }, [table.resetColumnFilters]); // HANDLE DELETE SELECTED ROW

  const handleDeleteRow = useCallback(() => {
    const userIdList = SELECTED_ROWS.map(row => row.original.id);
    const updatesUserList = userList.filter(user => !userIdList.includes(user.id));
    setUserList(updatesUserList);
    setAllUsers(updatesUserList);
    setRowSelection({});
  }, [SELECTED_ROWS, userList]);
  return <div className="pt-2 pb-4">
      {
      /* DATA TABLE ACTIONS */
    }
      <TableActions rowSelected={SELECTED_ROWS.length} hasColumnFilter={HAS_COLUMN_FILTER} handleSearch={handleSearch} handleDeleteRow={handleDeleteRow} handleResetColumnFilter={handleResetColumnFilter} />

      {
      /* DATA TABLE */
    }
      <Card sx={{
      mt: 3,
      pt: 1
    }}>
        <Scrollbar>
          <Table>
            <TableHead>
              {table.getHeaderGroups().map(headerGroup => <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => <HeadTableCell key={header.id} sx={{
                minWidth: header.getSize()
              }}>
                      {header.isPlaceholder ? null : <Fragment>
                          {
                    /* GET HEADER COLUMN */
                  }
                          {flexRender(header.column.columnDef.header, header.getContext())}

                          {
                    /* GET COLUMN BASED FILTER */
                  }
                          {header.column.getCanFilter() ? <TableColumnFilter column={header.column} table={table} /> : null}
                        </Fragment>}
                    </HeadTableCell>)}
                </TableRow>)}
            </TableHead>

            <TableBody>
              {table.getRowModel().rows.map(row => <BodyTableRow selected_row={rowSelection[row.id] ? 1 : 0} key={row.id}>
                  {row.getVisibleCells().map(cell => <BodyTableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </BodyTableCell>)}
                </BodyTableRow>)}
            </TableBody>
          </Table>
        </Scrollbar>

        {
        /* TABLE PAGINATION SECTION */
      }
        <TablePagination component="div" rowsPerPageOptions={[5, 10, 25]} page={table.getState().pagination.pageIndex} rowsPerPage={table.getState().pagination.pageSize} count={table.getFilteredRowModel().rows.length} onPageChange={(_, page) => table.setPageIndex(page)} onRowsPerPageChange={e => table.setPageSize(+e.target.value || 5)} />
      </Card>
    </div>;
}