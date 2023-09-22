import { DocxLoader } from "langchain/document_loaders/fs/docx";

export async function loadDocData(filePath) {
    const loader = new DocxLoader(filePath);
    return loader.load();
} 