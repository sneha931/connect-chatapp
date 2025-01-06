import express from "express";
const router = express.Router();
import  {protectRoute} from '../middleware/authmiddleware';
import { getUsersforSidebar, getMessages, sendMessage } from '../controllers/messagecontroller';





router.get('/users', protectRoute, getUsersforSidebar);
router.get('/:id', protectRoute, getMessages);
router.post('/send/:id', protectRoute, sendMessage);

export default router;
