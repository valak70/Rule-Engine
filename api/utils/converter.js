import { Node } from './ruleEngine.js';  // Adjust the path as per your project structure

// Function to serialize the AST into JSON format for storage
export function serializeAST(node) {
    if (!node) return null;
    return {
        nodeType: node.nodeType,    // Storing the type of the node (e.g., OPERATOR or OPERAND)
        value: node.value,          // Storing the value of the node
        left: serializeAST(node.left),  // Recursively serialize the left child
        right: serializeAST(node.right) // Recursively serialize the right child
    };
}

// Function to deserialize the JSON format back into an AST
export function deserializeAST(json) {
    if (!json) return null;
    
    const node = new Node(json.nodeType, json.value)
    // console.log(node);
      // Recreate the Node instance
    node.left = deserializeAST(json.left);             // Recursively rebuild the left child
    node.right = deserializeAST(json.right);           // Recursively rebuild the right child
    
    return node;
}

// Example Usage:
// Assuming `ast` is the root node of your AST
// const serializedAST = serializeAST(ast);  // Convert AST to JSON for DB storage
// console.log(JSON.stringify(serializedAST)); // This JSON can be stored in the DB

// // Assuming `jsonAST` is the AST retrieved from the DB
// const deserializedAST = deserializeAST(serializedAST); // Convert JSON back to AST
// console.log(deserializedAST);
