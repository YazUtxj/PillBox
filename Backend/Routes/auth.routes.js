import express from 'express';
import { registerUser, loginUser, getUserById, checkEmail } from '../controllers/auth.controller.js';
import { editContainers, allUserContainers, createDHTData, getGraphData } from '../controllers/containers.controller.js';
import { getRecordsByUserId, createRecord } from '../controllers/data.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user/:id', getUserById);
router.get('/check-email/:email', checkEmail);
router.post('/edit-container', editContainers);
router.get('/get-containers/:owner', allUserContainers);
router.post('/create-graphdata', createDHTData);
router.get('/get-graphdata/:id', getGraphData);
router.post('/create-data', createRecord);
router.get('/get-data/:id', getRecordsByUserId);

export default router;