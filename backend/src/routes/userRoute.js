import express from 'express';
import upload from '../middlewares/multer.js';
import { signUp, login, currentUser, logout, userProfile,refreshAccessToken,verifyEmail,searchUser,followUser,unfollowUser} from '../controllers/usercontrol.js';
import verifyJWT from '../middlewares/authmiddle.js';

const router = express.Router();

router.post('/signup', upload.single('profilePic'), signUp);
router.post('/login', login);
router.get('/currentuser', verifyJWT, currentUser);
router.post('/logout', verifyJWT, logout);
router.get('/search',verifyJWT,searchUser);
router.get('/:id', verifyJWT, userProfile);
router.post('/refresh', refreshAccessToken);
router.post('/verify-email/:token',verifyEmail);
router.post('/follow/:id',verifyJWT,followUser);
router.post('/unfollow/:id',verifyJWT,unfollowUser);


export default router;
