import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { createVectorStore, loadVectorStore } from './vectorStore.mjs';

export async function processText(docs, queryText, numOfChunks, vectorDataPath) {

    console.log("------------------Splitting documents------------------");
    // const splitter = new RecursiveCharacterTextSplitter({
    //     chunkSize: 1500,
    //     chunkOverlap: 500,
    // });

    // const output = await splitter.splitDocuments(docs);

    console.log("------------------Documents splitted------------------");

    console.log("------------------Vector store------------------");
    // const vectorStore = await createVectorStore(output, vectorDataPath);

    const loadedVectorStore = await loadVectorStore(vectorDataPath);

    console.log("------------------Similarity search------------------");

    const result = await loadedVectorStore.similaritySearch(queryText, numOfChunks);

    return result;
}