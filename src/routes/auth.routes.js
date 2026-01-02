import { signup } from '#controllers/auth.controller.js';
import express from 'express';

const router = express.Router();

// Example route for authentication

router.post('/sign-up', signup);

router.post('/sign-in', (req, res) => {
  // Authentication logic here
  res.status(200).send('POST /api/auth/Sign-in response');
});

router.post('/sign-out', (req, res) => {
  // Authentication logic here
  res.status(200).send('POST /api/auth/Sign-out response');
});

export default router;
