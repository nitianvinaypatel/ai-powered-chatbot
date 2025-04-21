import os
import logging
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from langchain_huggingface import HuggingFaceEndpoint, HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_core.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from dotenv import load_dotenv, find_dotenv

# Load environment variables
load_dotenv(find_dotenv())

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger("MizoramPoliceChatbot")

app = FastAPI(title="Mizoram Police AI Chatbot", description="An AI assistant for Mizoram Police.")

# Load Hugging Face API Token
HF_TOKEN = os.getenv("HF_TOKEN")
HUGGINGFACE_REPO_ID = "mistralai/Mistral-7B-Instruct-v0.3"
DB_FAISS_PATH = "vectorstore/db_faiss"

if not HF_TOKEN:
    raise RuntimeError("Missing Hugging Face API token. Please set HF_TOKEN in your environment variables.")

# Initialize LLM
def load_llm():
    try:
        return HuggingFaceEndpoint(
            repo_id=HUGGINGFACE_REPO_ID,
            task="text-generation",
            temperature=0.2,  # Lower temperature for more factual responses
            model_kwargs={"max_length": 512}
        )
    except Exception as e:
        logger.error(f"Error initializing LLM: {e}")
        raise RuntimeError("Failed to load the AI model.")

# Load FAISS vector store
embedding_model = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

try:
    db = FAISS.load_local(DB_FAISS_PATH, embedding_model, allow_dangerous_deserialization=True)
    retriever = db.as_retriever(search_kwargs={'k': 5})  # Increase retrieval depth
except Exception as e:
    logger.error(f"Error loading FAISS database: {e}")
    db, retriever = None, None  # Allow API to function even if FAISS fails

# Strict Answering Prompt Template
CUSTOM_PROMPT_TEMPLATE = """
You are a highly professional AI chatbot for the Mizoram Police Department. Your responsibility is to assist citizens with accurate and reliable information while maintaining confidentiality, professionalism, and clarity.

### **Guidelines for Responses:**
- **Only answer questions related to police, law enforcement, legal rights, and public safety.**
- **If the question is unrelated (e.g., about technology, sports, entertainment, politics etc.), firmly respond:**
  "I'm sorry, but I can only provide information related to Mizoram Police and legal matters. Please contact Mizoram Police for further assistance."
- **Never speculate, fabricate, or provide unauthorized legal advice.**  
- **If you are unsure, suggest contacting Mizoram Police directly.**

### **Context (if available):**
{context}  

### **Citizen's Question:**
{question}  

### **AI Response:**
"""


prompt = PromptTemplate(template=CUSTOM_PROMPT_TEMPLATE, input_variables=["context", "question"])

# Create Retrieval QA Chain
qa_chain = None
if retriever:
    qa_chain = RetrievalQA.from_chain_type(
        llm=load_llm(),
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={'prompt': prompt}
    )

# Request Model
class QueryRequest(BaseModel):
    question: str

@app.post("/query", summary="Ask the Mizoram Police AI Chatbot")
def query(data: QueryRequest):
    if not qa_chain:
        raise HTTPException(status_code=503, detail="AI system is temporarily unavailable. Please try again later.")

    try:
        response = qa_chain.invoke({'query': data.question})
        answer = response.get("result", "").strip()

        # 🔒 Enforce strict filtering
        if "I'm sorry" in answer or not answer:
            return {"answer": "I'm sorry, but I can only provide information related to Mizoram Police and legal matters. Please contact Mizoram Police for further assistance."}

        return {"answer": answer}
    except Exception as e:
        logger.error(f"Query processing error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while processing your request.")

