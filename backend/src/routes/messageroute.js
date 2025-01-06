import express from "express";
const router = express.Router();
import  {protectRoute} from '../middleware/authmiddleware.js';
import { getUsersforSidebar, getMessages, sendMessage } from '../controllers/messagecontroller.js';





router.get('/users', protectRoute, getUsersforSidebar);
router.get('/:id', protectRoute, getMessages);
router.post('/send/:id', protectRoute, sendMessage);

export default router;
