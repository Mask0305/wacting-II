import express from 'express';
import { userData } from '../controller/userController';


const router = express.Router();

router.use('/',userData);

export default router;