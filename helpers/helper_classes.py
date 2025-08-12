from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS

class DataLoaderClass:
    def __init__(self, directory_path: str):
        self.directory_path = directory_path
        
    def load_documents(self):
        """Load documents from the specified directory."""
        loader = DirectoryLoader(self.directory_path, glob="**/*.pdf", loader_cls=PyPDFLoader)
        documents = loader.load()
        return documents
    
    def get_document_count(self):
        """Get the count of documents loaded."""
        documents = self.load_documents()
        return len(documents)
    
class TextSplitterClass:
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 200):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def split_documents(self, documents):
        """Split documents into smaller chunks."""
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap
        )
        split_documents = text_splitter.split_documents(documents)
        return split_documents

class VectorStoreClass:
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        self.embeddings = HuggingFaceEmbeddings(model_name=model_name)   

    def embed_documents_with_vectorstore(self, documents):
        """Embed documents using the specified model and store in a vector store. add new documents to the vector store."""
        texts = [doc.page_content for doc in documents]
        vector_store = FAISS.from_texts(texts, self.embeddings)
        return vector_store    
    
    def save_local(self, vector_store, file_path: str):
        """Save the vector store to a local file."""
        vector_store.save_local(file_path)
        print(f"Vector store saved to {file_path}")

    def load_local(self, file_path: str):
        """Load the vector store from a local file.

        WARNING: allow_dangerous_deserialization=True is required for FAISS.
        Only use this if you trust the source of the file!
        """
        vector_store = FAISS.load_local(
            file_path, 
            self.embeddings, 
            allow_dangerous_deserialization=True  # WARNING: Only use with trusted files!
        )
        print(f"Vector store loaded from {file_path}")
        return vector_store
    
# Example usage
if __name__ == "__main__":
    data_loader = DataLoaderClass(directory_path="data")
    documents = data_loader.load_documents()

    print(f"Loaded {data_loader.get_document_count()} documents.")

    text_splitter = TextSplitterClass(chunk_size=500, chunk_overlap=100)
    split_documents = text_splitter.split_documents(documents)

    print(f"Split into {len(split_documents)} chunks.")

    vector_store_class = VectorStoreClass(model_name="all-MiniLM-L6-v2")
    vector_store = vector_store_class.embed_documents_with_vectorstore(split_documents)

    print(f"Generated embeddings for {len(vector_store.index_to_docstore_id)} chunks.")

    vector_store_class.save_local(vector_store, file_path="vector-store")






