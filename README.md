# Rule Engine Project

## Overview
This project implements a Rule Engine that allows for creating, combining, and evaluating rules. The rules are represented using an Abstract Syntax Tree (AST), which is serialized into JSON for storage in a database and deserialized back into the AST for evaluation. The system also supports complex logic and error handling for invalid rule strings.

## Features
- **Create Rules**: Define individual rules such as `age > 30`.
- **Combine Rules**: Combine multiple rules using logical operators (AND, OR).
- **Evaluate Rules**: Evaluate the rules against sample data.
- **AST Serialization**: The AST is converted to a JSON object for database storage and deserialized back for rule evaluation.
- **Complex Logic**: Support for combining multiple rules with advanced logic.
- **Error Handling**: Handles invalid operators and missing data fields during evaluation.

## Installation

### Prerequisites
- Node.js (>=14.x)
- MongoDB Atlas account for database connection

### Setup Instructions

#### Clone the Repository
```bash
git clone https://github.com/valak70/Rule-Engine
cd Rule-Engine 
```
#### Install Dependencies
You'll need to install dependencies for both the api and client folders:
- For the API:
``` bash
cd api
npm install
```
- For the Client:
``` bash
cd ../client
npm install
```
#### Set Up Environment Variables
- API Environment Setup:
``` bash
MONGO=<your-mongodb-atlas-url>
PORT=5000
```
- Client Environment Setup:
``` bash 
VITE_BACKEND_URL=http://localhost:5000
```
### Run the Application
- Start the API server:
``` bash
cd api
npm start
```
- Start the client:
```bash
cd ../client
npm run dev
```

## Design Choices
### Abstract Syntax Tree (AST)
The core of the rule engine is the AST, which is a tree structure where each node is either an operator, operand, or variable. The AST allows us to break down rules into a hierarchical structure that can be evaluated easily.
#### Node Structure:
```javascript
const NodeType = Object.freeze({
    OPERATOR: 'OPERATOR',
    OPERAND: 'OPERAND',
    VARIABLE: 'VARIABLE'
});

class Node {
    constructor(nodeType, value) {
        this.nodeType = nodeType;
        this.value = value;
        this.left = null;
        this.right = null;
    }

    toString() {
        return `${this.nodeType}(${this.value})`;
    }
}
```
### Serialization and Deserialization
- Serialization: Converts the AST into a JSON object to be stored in the database.
- Deserialization: Converts the stored JSON back into an AST node structure to evaluate data.
``` javascript
function serializeAST(node) {
    // Converts AST node to JSON
}

function deserializeAST(json) {
    // Converts JSON back to AST node
}
```
