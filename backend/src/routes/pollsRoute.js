import express from 'express';
import verifyJWT from '../middlewares/authmiddle.js';
import { createPoll, getPolls, deletePoll,handleVote } from '../controllers/pollsControl.js';

const router = express.Router();
router.post('/', verifyJWT, createPoll);
router.get('/', verifyJWT, getPolls);
router.delete('/:id', verifyJWT, deletePoll);
router.post('/:pollId/vote/:optionId', verifyJWT, handleVote);

export default router;