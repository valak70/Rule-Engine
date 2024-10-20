import { combine_rules, create_rule, evaluate_rule } from "../utils/ruleEngine.js";
import Rule from '../model/DataModel.js';
import { serializeAST, deserializeAST } from "../utils/converter.js";

// Create a rule and store it in the database
export const createRule = async (req, res) => {
  const { ruleString } = req.body;
  const cleanRuleString = ruleString.replace(/\n/g, ' ');
  try {
    const ast = create_rule(cleanRuleString);
    const serializedAST = serializeAST(ast);

    // Always store only one rule in the database by updating or creating
    let existingRule = await Rule.findOne();
    if (existingRule) {
      existingRule.ruleString = ruleString;
      existingRule.serializedAST = serializedAST;
      await existingRule.save();
    } else {
      const newRule = new Rule({ ruleString, serializedAST });
      await newRule.save();
    }

    res.json({ message: 'Rule created successfully', rule: cleanRuleString, success : true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Combine multiple rules
export const combineRules = async (req, res) => {
  // const { ruleStrings } = req.body;
  // const concatenatedRuleString = ruleStrings.join(' AND ');
  try {
    const { rules: ruleStrings = [] } = req.body;

    if (!Array.isArray(ruleStrings)) {
      return res.status(400).json({ message: 'Invalid rules format' });
    }

    // Check if there are any rules to combine
    if (ruleStrings.length === 0) {
      return res.status(400).json({ message: 'No rules to combine' });
    }

    // Concatenate rules with 'AND'
    const concatenatedRuleString = ruleStrings.join(' AND ');

    const combinedAST = combine_rules(ruleStrings);
    const serializedAST = serializeAST(combinedAST);

    // Update or create the single rule in the database with combined rules
    let existingRule = await Rule.findOne();
    if (existingRule) {
      existingRule.ruleString = concatenatedRuleString;
      existingRule.serializedAST = serializedAST;
      await existingRule.save();
    } else {
      const newRule = new Rule({ ruleString: concatenatedRuleString, serializedAST });
      await newRule.save();
    }

    res.json({ message: 'Rules combined and stored successfully', rule: concatenatedRuleString, success : true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// Evaluate a rule
export const evaluateRule = async (req, res) => {

  
  const  userData  = req.body.data;
  
  
  try {
    // Ensure you always fetch the single rule stored in the database
    const rule = await Rule.findOne();
    if (!rule) {
      return res.status(404).json({ error: 'No rule found to evaluate.' });
    }
    
    
    const deserializedAST = deserializeAST(rule.serializedAST);
    // console.log(deserializedAST);
    
    const result = evaluate_rule(deserializedAST, userData);
    res.json({ result , success : true});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const getCurrentRule = async(req,res)=>{
  try {
    const rule = await Rule.findOne()
  if(!rule){
    return res.status(404).json({ error: 'No rule found.' });
  }
  res.status(200).json({currentRule : rule.ruleString});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}