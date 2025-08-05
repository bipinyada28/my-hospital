import express from 'express';
import { createMessage, getAllMessages } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', createMessage);         // Save + send confirmation email
router.get('/', getAllMessages);         // Show all messages (for admin dashboard)

export default router;
