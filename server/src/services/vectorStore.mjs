import { HNSWLib } from 'langchain/vectorstores/hnswlib';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';

export async function createVectorStore(docs, vectorStorePath) {
    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
    console.log("------------------Vector store created------------------");
    await vectorStore.save(vectorStorePath);
    console.log("------------------Vector store saved------------------");
    return vectorStore;
}

export async function loadVectorStore(vectorStorePath) {
    const loadedVectorStore = await HNSWLib.load(
        vectorStorePath,
        new OpenAIEmbeddings()
    );
    console.log("------------------Vector store loaded------------------");
    return loadedVectorStore;
}