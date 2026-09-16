import express from 'express';
import verifyJWT from '../middlewares/authmiddle.js';
import { createConfession, getAllConfessions,toggleLike } from '../controllers/confessionControl.js';

const router = express.Router();

router.post('/', verifyJWT, createConfession);
router.get('/', verifyJWT, getAllConfessions);
router.post('/:id/like', verifyJWT, toggleLike);


export default router;