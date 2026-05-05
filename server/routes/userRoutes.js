import express from 'express'
import userAuth from '../middleware/userAuth.js';
import { gerUserData } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, gerUserData )

export default userRouter;