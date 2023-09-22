import { TextLoader } from 'langchain/document_loaders/fs/text';

export async function loadTextData(filePath) {
    const loader = new TextLoader(filePath);
    return loader.load();
}