import express from 'express';
import verifyJWT from '../middlewares/authmiddle.js';
import { deleteComment } from '../controllers/commentControl.js';

const router = express.Router();

router.delete('/:id',verifyJWT,deleteComment);

export default router;