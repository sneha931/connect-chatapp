const express = require('express');
const router = express.Router();
const protectRoute= require('../middleware/authmiddleware');
const { getUsersforSidebar, getMessages, sendMessage } = require('../controllers/messagecontroller');





router.get('/users', protectRoute, getUsersforSidebar);
router.get('/:id', protectRoute, getMessages);
router.post('/send/:id', protectRoute, sendMessage);

module.exports = router;
