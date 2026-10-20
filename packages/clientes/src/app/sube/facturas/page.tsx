'use client';
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Link from "next/link";
import { useAuthState } from "@/context/auth";
import { Factura } from "@/types/typesABEFAC";
import { listarFacturas } from "@/app/api/route";
import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@mui/material";

function ReporteFacturas() {
  const [listFacturas, setListFacturas] = useState<Factura[]>([]);  
  const [cargando, setCargando] = useState(false);
  const { user, authenticated, loading } = useAuthState();
  const nroDocumento = user?.numeroDocumento ?? user?.persona?.nroDocumento;
  const updateFacturas = async()=>{
    if(!nroDocumento) {
      if(authenticated) toast.error('No se pudo actualizar el reporte de facturas');
        return;
      }
    try {
      setCargando(true);
      const facturasRes = await listarFacturas(nroDocumento);
      toast.success(`Se encontraron ${facturasRes?.length ?? 0} facturas`);
      setListFacturas(Array.isArray(facturasRes) ? facturasRes : []);
    } catch (error) {
      console.error(error);
      toast.error('Algo salio mal al actualizar el reporte de facturas');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    if(loading || !authenticated) return;
    updateFacturas();
  },[user, authenticated, loading])

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - listFacturas.length) : 0;

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <div className="flex p-6 space-x-4">
        <h1 className="font-bold my-4">Facturas Electrónicas: {listFacturas.length}</h1>
        <Button Icon={ArrowPathIcon} title={cargando ? 'Cargando...' : 'Actualizar'} onClick={updateFacturas} disabled={cargando} />
      </div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 440 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Descargar</TableCell>
              <TableCell align="right">Número</TableCell>
              <TableCell align="right">Fecha Emisión</TableCell>
              <TableCell align="right">Importe</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

          {(rowsPerPage > 0
              ? listFacturas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              : listFacturas
            ).map((factura) => (
              <TableRow
                key={factura.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="left">
                {factura.urlPdf && <Link href={factura.urlPdf} className='cursor-pointer hover:text-sky-500 hover:underline'><Chip label="PDF" variant="outlined" /></Link>}
                {factura.urlXml && <Link href={factura.urlXml} className='cursor-pointer hover:underline hover:text-sky-500'><Chip label="XML" variant="outlined" /></Link>}
                </TableCell>
                <TableCell align="right">{factura.numeroFactura}</TableCell>
                <TableCell align="right">{new Date(factura.fechaEmision).toLocaleString('es')}</TableCell>
                <TableCell align="right">Bs. {factura.montoTotal}</TableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={listFacturas.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}

export default ReporteFacturas;
