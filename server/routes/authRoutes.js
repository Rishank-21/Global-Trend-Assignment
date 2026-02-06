import express from 'express';
const router = express.Router();

import { registerUser, loginUser, logoutUser, getUser } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';


router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

router.get('/me', protect, getUser)


export default router;