import { PDFLoader } from "langchain/document_loaders/fs/pdf";

export async function loadPDFData(filePath) {
    const loader = new PDFLoader(filePath);
    return loader.load();
}