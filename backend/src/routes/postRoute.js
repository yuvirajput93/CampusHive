import express from 'express';
import { createPost, getAllPost, deletePost, updatePost,likeUnlikePost } from '../controllers/postcontrol.js';
import { addComment, getComment } from '../controllers/commentControl.js';
import verifyJWT from '../middlewares/authmiddle.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.post('/', verifyJWT, upload.single('image'), createPost);
router.get('/', verifyJWT, getAllPost);
router.delete('/:id', verifyJWT, deletePost);
router.patch('/:id', verifyJWT, upload.single('image'), updatePost);
router.post('/:id/like',verifyJWT,likeUnlikePost);
router.post('/:id/comments',verifyJWT,addComment);
router.get('/:id/comments',verifyJWT,getComment);


export default router;