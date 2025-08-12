from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_community.vectorstores import FAISS
from helpers.helper_classes import VectorStoreClass, DataLoaderClass, TextSplitterClass
from dotenv import load_dotenv
import os
from langchain.chains import RetrievalQA
from langchain.schema.output_parser import StrOutputParser
from langserve import add_routes
from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

load_dotenv(override=True)

# Set up CORS middleware to allow requests from the frontend
origins = [
    os.getenv("FRONTEND_ORIGIN", "http://localhost:5173/")
]

prompt = ChatPromptTemplate.from_messages(
    messages=[
        {
            "role": "system",
            "content": "You are a medical expert. Answer the user's question based on the provided context."
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "{context}\n\nQuestion: {question} {image}"
                },
                # {
                #     "type": "image_url",
                #     "image_url": {
                #         "url": "{image}"
                #     }
                # }
            ]
        }        
    ]
)

llm = ChatGroq(
    model="meta-llama/llama-4-scout-17b-16e-instruct",
    temperature=0.0
)

vector_store_class = VectorStoreClass(model_name="all-MiniLM-L6-v2")
vector_store = vector_store_class.load_local(file_path="vector-store")
retriever = vector_store.as_retriever()

class ChatInput(BaseModel):
    question: str
    image: str

chain = (
    {
        "context": lambda x: retriever.invoke(x["question"]),
        "question": lambda x: x["question"],
        "image": lambda x: x["image"]
    }
    | prompt
    | llm
    | StrOutputParser()
).with_types(
    input_type =ChatInput
)

app = FastAPI(
    title="Medical Chatbot",
    description="A chatbot that answers medical questions based on provided documents.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

add_routes(
    app, 
    chain, 
    path="/chat"
)

