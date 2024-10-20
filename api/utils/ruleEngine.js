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

const operatorTokens = new Set(['AND', 'OR', '>', '<', '=']);

const operatorPrecedence = {
    'OR': 1,
    'AND': 2,
    '>': 3,
    '<': 3,
    '=': 3
};

function tokenizeRuleString(ruleString) {
    const tokens = [];
    let currentToken = "";

    for (const char of ruleString) {
        if (char === '(' || char === ')') {
            if (currentToken.length > 0) {
                tokens.push(currentToken);
            }
            tokens.push(char);
            currentToken = "";
        } else if (char === ' ') {
            if (currentToken.length > 0) {
                tokens.push(currentToken);
            }
            currentToken = "";
        } else {
            currentToken += char;
        }
    }

    if (currentToken) {
        tokens.push(currentToken);
    }

    return tokens;
}

function applyOperator(operators, operands) {
    if (operands.length < 2) {
        throw new Error("Parse error: not enough operands for the operator");
    }

    const operator = operators.pop();
    const rightOperand = operands.pop();
    const leftOperand = operands.pop();

    if (operator.nodeType !== NodeType.OPERATOR) {
        throw new Error(`Parse error: expected operator, got ${operator}`);
    }

    operator.left = leftOperand;
    operator.right = rightOperand;
    operands.push(operator);
}

export function create_rule(ruleString) {
    const tokens = tokenizeRuleString(ruleString);

    const operators = [];
    const operands = [];
    let leftOpen = 0;

    for (const token of tokens) {
        if (token === '(') {
            leftOpen++;
            operators.push(new Node(NodeType.OPERATOR, token));
        } else if (token === ')') {
            leftOpen--;
            if (leftOpen < 0) {
                throw new Error("Parse error: unmatched closing parenthesis");
            }

            while (operators.length && operators[operators.length - 1].value !== '(') {
                applyOperator(operators, operands);
            }

            if (!operators.length || operators[operators.length - 1].value !== '(') {
                throw new Error("Parse error: unmatched parentheses");
            }
            operators.pop();
        } else if (operatorTokens.has(token)) {
            if (operands.length < 1) {
                throw new Error(`Parse error: no operands for operator '${token}'`);
            }

            while (operators.length && operatorTokens.has(operators[operators.length - 1].value) &&
                operatorPrecedence[operators[operators.length - 1].value] >= operatorPrecedence[token]) {
                applyOperator(operators, operands);
            }

            operators.push(new Node(NodeType.OPERATOR, token));
        } else {
            let tokenValue = isNaN(token) ? token.replace(/['"]/g, '') : Number(token);
            operands.push(new Node(NodeType.OPERAND, tokenValue));
        }
    }

    while (operators.length) {
        if (operators[operators.length - 1].value === '(') {
            throw new Error("Parse error: unmatched opening parenthesis");
        }
        applyOperator(operators, operands);
    }

    if (operands.length !== 1) {
        throw new Error("Parse error: invalid syntax, leftover operands or operators");
    }

    return operands[0];
}

function evaluateOperator(operator, left, right) {
    switch (operator) {
        case 'AND':
            return left && right;
        case 'OR':
            return left || right;
        case '>':
            return left > right;
        case '<':
            return left < right;
        case '=':
            return left === right;
        default:
            throw new Error(`Unsupported operator: ${operator}`);
    }
}

export function evaluate_rule(node, data) {
    // console.log(data);
    
    if (node.nodeType === NodeType.OPERAND) {
        return typeof node.value === 'string' && data && data.hasOwnProperty(node.value) ? data[node.value] : node.value;
    }

    if (node.nodeType === NodeType.OPERATOR) {
        const leftResult = evaluate_rule(node.left, data);
        const rightResult = evaluate_rule(node.right, data);
        return evaluateOperator(node.value, leftResult, rightResult);
    }

    throw new Error(`Unsupported node type: ${node.nodeType}`);
}


export function combine_rules(rules) {
    if (!rules.length) return null;

    const ruleAsts = rules.map(rule => create_rule(rule));
    let combinedAst = ruleAsts[0];

    for (let i = 1; i < ruleAsts.length; i++) {
        const combinedNode = new Node(NodeType.OPERATOR, 'AND');
        combinedNode.left = combinedAst;
        combinedNode.right = ruleAsts[i];
        combinedAst = combinedNode;
    }

    return combinedAst;
}

export { Node, NodeType };

// const rule1 = "((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)";
// const rule2 = "((age > 30 AND department = 'Marketing')) AND (salary > 20000 OR experience > 5)";

// const ast1 = createRule(rule1);
// const ast2 = createRule(rule2);

// const astCombined = combineRules([rule1, rule2]);

// console.log(astCombined);

// const data2 = {
//     age: 31,
//     department: 'Marketing',
//     salary: 30000,
//     experience: 6
// };

// console.log(evaluateRule(ast2, data2));


