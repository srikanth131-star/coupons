import express from 'express';
import { login, verify, refresh, logout } from '../../controllers/authController.js';

const router = express.Router();

router.post('/login', login);
router.get('/verify', verify);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
