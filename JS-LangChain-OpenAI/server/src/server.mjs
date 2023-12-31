import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from "langchain/llms/openai";
import { PORT, OPENAI_API_KEY } from './utils/constants.mjs';
import { handleError } from './utils/errorHandlers.mjs';
import { createOpenAIClient } from './config/openai.mjs';
import { loadTextData } from './loader/textLoader.mjs';
import { loadPDFData } from './loader/pdfLoader.mjs';
import { loadDocData } from './loader/docLoader.mjs';
import { createVectorStore, loadVectorStore } from './services/vectorStore.mjs';
import { processText } from './services/textProcessing.mjs';
import { BufferMemory } from "langchain/memory";
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { loadQAStuffChain, loadQAMapReduceChain, loadQARefineChain, loadQAChain, RetrievalQAChain, ConversationalRetrievalQAChain } from "langchain/chains";


dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
const port = PORT;

const llm = createOpenAIClient(OPENAI_API_KEY);

app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello Welcome to DI Chatbot'
    });
});

app.post('/', async (req, res) => {
    try {
        const { message } = req.body;

        const dataFilePath = './data/Wudu2Eng.txt';
        const vectorDataPath = './vectorData';

        if (!dataFilePath) {
            throw new Error('data not provided');
        }

        console.log('------------------Loading test data------------------')

        const docs = await loadTextData(dataFilePath);

        console.log('------------------Test Data Loaded------------------')

        console.log('------------------Text Processing Start------------------')

        const result = await processText(docs, message, 4, vectorDataPath);
        console.log(result);

        console.log('------------------Text Processing End------------------')

        console.log("------------------Loading LLM------------------");

        const llmA = new OpenAI({
            temperature: 0.9,
            max_tokens: 1500,
        });

        console.log("------------------Loading QA chain------------------");

        // const vectorStoreRetriever = result.asRetriever();
        // const chainA = RetrievalQAChain.fromLLM(llmA, vectorStoreRetriever);

        // const chainA = ConversationalRetrievalQAChain.fromLLM(
        //     llmA,
        //     result.asRetriever(),
        //     {
        //         memory: new BufferMemory({
        //             memoryKey: "chat_history",
        //         }),
        //     }
        // );

        const prompt = `Generate the answer for the following question from the given context and do not translate the data which is in arabic language.\n\nContext: ${result}\n\nQuestion: ${message}\n\nAnswer:`;

        const chainA = loadQAChain(llmA);
        const response = await chainA.call({
            input_documents: result,
            question: message,
        });

        console.log("------------------QA chain result------------------");
        console.log('question: ', message);
        console.log('answer: ', response.text);

        res.status(200).send(response.text);
    } catch (error) {
        handleError(res, error);
    }
})

app.listen(port, () => console.log(`AI server started on http://localhost:${port}`));