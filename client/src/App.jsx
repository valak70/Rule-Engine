import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [ruleString, setRuleString] = useState("");
  const [ruleStrings, setRuleStrings] = useState([]); // Store rules for combining
  const [currentRule, setCurrentRule] = useState(null); // Store current rule or combined rule
  const [keyValuePairs, setKeyValuePairs] = useState([{ key: "", value: "" }]); // Store user input for rule evaluation
  const [result, setResult] = useState("");


    // Function to fetch the current rule from the database
    const fetchCurrentRule = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/rules/getCurrentRule");
        if (response.status === 200) {
          const cleanCurrentRule = response.data.currentRule.replace(/\n/g, ' ');
          setCurrentRule(cleanCurrentRule);
        }
      } catch (error) {
        console.error("Error fetching current rule:", error);
      }
    };
  
    // useEffect to fetch the current rule on component mount
    useEffect(() => {
      fetchCurrentRule(); // Fetch the current rule when the component loads
    }, []);

  // API: Create Rule
  const createRule = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/rules/create", {ruleString });
      
      if (response.data.success) {
        setCurrentRule(response.data.rule); // Store the returned AST
        setRuleString("");
        alert("Rule created successfully!");
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || "An error occurred"}`);
    }
  };

  // Add Rule to the list for combining
  const addRuleToCombine = () => {
    // if (currentRule) {
      const cleanRuleString = ruleString.replace(/\n/g, ' ');
      setRuleStrings([...ruleStrings, cleanRuleString]);
      setRuleString("")
    // }
  };

  // API: Combine Rules
  const combineRules = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/rules/combine", { rules: ruleStrings });
      if (response.data.success) {
        setCurrentRule(response.data.rule); // Store the combined rule
        setRuleStrings([]); // Reset rules to combine
        alert("Rules combined successfully!");
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || "An error occurred"}`);
    }
  };

  // Add new key-value pair input field
  const addKeyValuePair = () => {
    setKeyValuePairs([...keyValuePairs, { key: "", value: "" }]);
  };

  // Handle change in key-value pairs
  const handleKeyValueChange = (index, field, value) => {
    const newKeyValuePairs = [...keyValuePairs];
    newKeyValuePairs[index][field] = value;
    setKeyValuePairs(newKeyValuePairs);
  };

  // API: Evaluate Rule
  const evaluateRule = async () => {
    const attributes = keyValuePairs.reduce((obj, pair) => {
      obj[pair.key] = pair.value;
      return obj;
    }, {});
    // console.log(attributes);
    try {
      const response = await axios.post("http://localhost:5000/api/rules/evaluate", {
        data: attributes, 
      });
      
      if (response.data.success) {
        alert(`Rule Evaluation Result: ${response.data.result}`);
        setResult(response.data.result)
      } else {
        alert(`Error: ${response.data.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || "An error occurred"}`);
    }
  };

  return (
    <div className="rule-engine-container">
      <h1>Rule Engine</h1>

      {/* Create Rule */}
      <textarea
        value={ruleString}
        onChange={(e) => setRuleString(e.target.value)}
        placeholder="Enter rule here"
      />
      <div className="button-group">
        <button onClick={createRule}>Create Rule</button>

        {/* Add rule for combining */}
        <button onClick={addRuleToCombine}>Add Rule for Combining</button>
      </div>

      {/* Display rules to be combined */}
      <h3>Rules to Combine:</h3>
      {ruleStrings.length > 0 ? (
        <ul>
          {ruleStrings.map((rule, index) => (
            <li key={index}>{JSON.stringify(rule, null, 2)}</li>
          ))}
        </ul>
      ) : (
        <p>No rules added for combining yet.</p>
      )}

      <button onClick={combineRules}>Combine Rules</button>

      {/* Display the current rule */}
      <h3>Current Rule:</h3>
      {currentRule ? (
        <pre>{JSON.stringify(currentRule, null, 2)}</pre>
      ) : (
        <p>No rule created or combined yet.</p>
      )}

      {/* Input fields for key-value pairs */}
      <h3>Input Attributes for Evaluation</h3>
      {keyValuePairs.map((pair, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Key"
            value={pair.key}
            onChange={(e) => handleKeyValueChange(index, "key", e.target.value)}
          />
          <input
            type="text"
            placeholder="Value"
            value={pair.value}
            onChange={(e) => handleKeyValueChange(index, "value", e.target.value)}
          />
        </div>
      ))}
      <button onClick={addKeyValuePair}>Add More Attributes</button>

      {/* Evaluate the rule */}
      <button onClick={evaluateRule}>Evaluate Rule</button>

      {/* Display the evaluation result */}
      <div>{result}</div>
    </div>
  );
}

export default App;
