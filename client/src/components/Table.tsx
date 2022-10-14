import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import ExportButton from './ExportButton';

interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align: 'left' | 'right' | 'inherit' | 'center' | 'justify' | undefined;
    format?: (value: number) => string;
}

interface Props{
    data: Record<string, string | number | object | boolean>[][];
    title: string;
}

export default function StickyHeadTable({ data, title }: Props) {
      
    const columns: Column[] = Object.keys(data[0]).map((key) => {
    return {
        id: key,
        label: key,
        minWidth: 70,
        align: 'left',
        };
    });

    const [page, setPage] = useState(0);
    const [dataPerPage, setdataPerPage] = useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangedataPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setdataPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 860 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell className="font-bold bg-gray-200"
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data
                            .slice(
                                page * dataPerPage,
                                page * dataPerPage + dataPerPage
                            )
                            .map((row) => {
                                return (
                                    <TableRow className="h-2"
                                        hover
                                        role="checkbox"
                                        tabIndex={-1}
                                        key={row.id}
                                    >
                                        {columns.map((column) => {
                                            const value = row[column.label];
                                            return (
                                                <TableCell className="h-2"
                                                    key={column.id}
                                                    align={column.align}
                                                >
                                                    {column.format &&
                                                    typeof value === 'number'
                                                        ? column.format(value)
                                                        : typeof value === 'object' 
                                                        ? JSON.stringify(value)
                                                        : typeof value !== 'boolean' 
                                                        ? value 
                                                        : value ? 'V' : 'F' }
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className='flex justify-end'>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={data.length}
                rowsPerPage={dataPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangedataPerPage}
            />
            <ExportButton data={data} title={title}/>
            </div>
        </Paper>
    );
}
