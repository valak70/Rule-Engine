import mongoose from 'mongoose';
const ruleSchema = new mongoose.Schema({
  ruleString: { type: String, required: true },
  serializedAST: { type: Object, required: true }
});

export default mongoose.model('Rule', ruleSchema);
