import { PDFDownloadLink, Document, PDFViewer } from "@react-pdf/renderer"
import Button from "../ui/Button"
import { DocumentTextIcon } from "@heroicons/react/24/outline"
import toast from "react-hot-toast"
import ToastCard from "../ui/ToastCard"

type Props = {
    document: Document
    pdfName: string
}
const pdfHandler = ({ document, pdfName }: Props) => {

  const visualizarPDF = () => {
    ToastCard(
      <PDFViewer style={{ width: "100%", height: "90vh" }}>
        {document}
      </PDFViewer>, 
      () => {
        toast.success('PDF visualizado');
    }, pdfName);
	};

  return (
    <div>
      <PDFDownloadLink
        document={document}
        fileName={`${pdfName}.pdf`}
      >
        <Button Icon={DocumentTextIcon} title='Descargar' onClick={() => toast.success('Descargar PDF')} />
      </PDFDownloadLink>
      <Button title={ 'Ver ' + pdfName } onClick={visualizarPDF} />
    </div>
  )
}

export default pdfHandler
