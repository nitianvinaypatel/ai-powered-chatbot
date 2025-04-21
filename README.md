# Software Requirements Specification (SRS)

# Mizoram Police AI Chatbot

## 1. Introduction

### a) Background

The Mizoram Police AI Chatbot is a software engineering project developed for the 6th Semester Software Engineering subject. It aims to create an intelligent virtual assistant that can provide citizens with accurate and reliable information about Mizoram Police services, legal processes, and public safety guidelines. This project leverages modern AI technologies to create a responsive, accessible interface for public interaction with police information systems.

### b) Overall Description

The system consists of two main components:

1. **Backend AI Server**: A Python-based FastAPI application that processes natural language queries using the Mistral 7B language model, retrieves relevant information from a knowledge base, and generates accurate responses.
2. **Mobile Application Interface**: A React Native mobile application that provides a user-friendly chat interface for users to communicate with the AI chatbot system.

The chatbot is designed to understand and respond to queries related to police services, legal rights, and public safety matters while maintaining professional communication standards.

### c) Environment Characteristics

#### i) Hardware

- **Server Requirements**:

  - Computing platform capable of running Python applications
  - Minimum 8GB RAM recommended for language model operation
  - Sufficient storage for vector database and model files (minimum 2GB)
  - Stable internet connection for API communication

- **Client Requirements**:
  - Any modern smartphone capable of running React Native applications
  - Minimum 2GB RAM
  - 100MB of free storage space
  - Internet connectivity for API communication

#### ii) Peripherals

- Standard input devices (touchscreen for mobile devices)
- Audio capabilities for potential future voice interaction features
- Network adapters for internet connectivity
- Display screens appropriate for reading text conversations

#### iii) People

- **End Users**: Citizens of Mizoram seeking information about police services and legal matters
- **System Administrators**: Technical staff responsible for maintaining the backend system
- **Content Managers**: Police department staff responsible for updating the knowledge base
- **Developers**: Software engineers maintaining and enhancing the system
- **Project Stakeholders**: Mizoram Police Department officials overseeing the project

## 2. Goals/Objectives

- Develop an AI-powered chatbot system that can accurately respond to citizen queries regarding Mizoram Police procedures, laws, and services
- Create a user-friendly mobile application interface that allows easy access to the chatbot
- Ensure the system provides reliable and factual information from authorized sources
- Implement robust information retrieval mechanisms to help citizens find relevant police information quickly
- Maintain professional communication standards in all interactions
- Provide an accessible and efficient alternative to traditional information channels
- Reduce the workload on human operators by automating responses to common inquiries
- Ensure system scalability to accommodate growing user base and knowledge repository

## 3. Functional Requirements

1. **User Interaction**

   - The system shall provide a text-based chat interface for users to input queries
   - The system shall display bot responses with appropriate formatting
   - The system shall support mathematical formula rendering when needed
   - The system shall maintain conversation history within a session

2. **Natural Language Processing**

   - The system shall interpret user queries using natural language processing
   - The system shall handle misspellings and grammatical errors in user input
   - The system shall extract key information from verbose user queries
   - The system shall recognize police and legal terminology

3. **Information Retrieval**

   - The system shall retrieve relevant information from a knowledge base using vector search
   - The system shall rank retrieved information by relevance to the query
   - The system shall use retrieved context to generate accurate responses
   - The system shall maintain a vector database of police-related documents

4. **Response Generation**

   - The system shall generate natural language responses based on retrieved information
   - The system shall format responses in clear, professional language
   - The system shall refuse to answer non-police related queries with appropriate messages
   - The system shall acknowledge when information is uncertain or unavailable

5. **Knowledge Management**

   - The system shall support addition of new documents to the knowledge base
   - The system shall process PDF documents to extract relevant information
   - The system shall create vector embeddings from textual content
   - The system shall maintain context relevance between documents and queries

6. **UI/UX Features**
   - The system shall provide visual indicators during response generation (loading animation)
   - The system shall animate message appearance for better user experience
   - The system shall adapt to device dark/light modes
   - The system shall handle various screen sizes responsively

## 4. Non-Functional Requirements

1. **Performance**

   - The system shall respond to user queries within 5 seconds under normal operation
   - The system shall handle multiple concurrent user sessions efficiently
   - The mobile application shall launch within 3 seconds on target devices
   - The system shall optimize memory usage for mobile application performance

2. **Reliability**

   - The system shall maintain 99% uptime during operational hours
   - The system shall gracefully handle server connection failures
   - The system shall preserve chat history during temporary connectivity issues
   - The system shall implement error recovery mechanisms for critical functions

3. **Security**

   - The system shall implement secure communication between client and server
   - The system shall not store personally identifiable information from conversations
   - The system shall implement appropriate access controls for administrative functions
   - The system shall comply with relevant data protection regulations

4. **Usability**

   - The interface shall be intuitive for users with minimal technical expertise
   - The application shall follow consistent design patterns throughout
   - The system shall provide clear error messages when issues occur
   - The system shall support both English and potentially local languages

5. **Maintainability**

   - The codebase shall follow established coding standards and patterns
   - The system shall be modular to facilitate future enhancements
   - The system shall include appropriate logging for troubleshooting
   - The documentation shall be comprehensive and up-to-date

6. **Scalability**
   - The system architecture shall support increasing numbers of users
   - The knowledge base shall be expandable without significant performance degradation
   - The system shall support the addition of new features and capabilities
   - The backend shall be designed for potential cloud deployment scaling

## 5. Behavior Description

### a) System States

1. **Idle State**

   - The system is running but not actively processing user queries
   - The mobile application displays the chat interface with existing conversation history
   - The system maintains connection to the backend server

2. **Query Processing State**

   - The system is actively processing a user query
   - The mobile application displays a loading indicator
   - The backend retrieves relevant information from the vector database
   - The language model generates appropriate responses

3. **Response Delivery State**

   - The system has completed query processing
   - The mobile application displays the bot response with animations
   - The conversation history is updated with the new exchange

4. **Error State**

   - The system encounters an issue processing a query
   - The mobile application displays an appropriate error message
   - Recovery mechanisms attempt to restore normal operation

5. **Knowledge Update State**
   - The system is processing new documents for the knowledge base
   - Vector embeddings are being created for new content
   - The vector database is being updated with new information

### b) Events & Actions

1. **User Submits Query**

   - **Event**: User types a message and presses send button
   - **Actions**:
     - Input is validated
     - Query is sent to backend server
     - Loading indicator is displayed
     - User message is added to conversation history

2. **System Processes Query**

   - **Event**: Backend receives user query
   - **Actions**:
     - Query is parsed and processed
     - Relevant documents are retrieved from vector database
     - Context is provided to language model
     - Response is generated according to guidelines

3. **System Delivers Response**

   - **Event**: Response generation is complete
   - **Actions**:
     - Response is sent to mobile application
     - Loading indicator is removed
     - Bot response is added to conversation history
     - UI animations display the new message

4. **System Handles Error**

   - **Event**: Error occurs during query processing
   - **Actions**:
     - Error is logged for analysis
     - Appropriate error message is generated
     - User is notified of the issue
     - System attempts to recover normal operation

5. **Knowledge Base Update**
   - **Event**: New documents are added to the system
   - **Actions**:
     - Documents are processed and text is extracted
     - Text is split into appropriate chunks
     - Vector embeddings are created for each chunk
     - FAISS database is updated with new vectors
