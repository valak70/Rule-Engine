import express from 'express'
import { combineRules, createRule, evaluateRule, getCurrentRule } from '../controllers/ruleController.js';

const router = express.Router();

router.post("/combine", combineRules)
router.post("/create", createRule)
router.post("/evaluate", evaluateRule)
router.get("/getCurrentRule", getCurrentRule)

export default router