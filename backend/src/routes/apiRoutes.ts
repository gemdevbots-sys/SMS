import express from 'express';
import { authenticateToken } from '../middleware/authMiddleware';
import * as StaffController from '../controllers/staffController';
import * as ParticipantController from '../controllers/participantController';
import * as NotificationController from '../controllers/notificationController';

const router = express.Router();

router.get('/staffs', authenticateToken, StaffController.getAllStaffs);
router.get('/staffs/:id', authenticateToken, StaffController.getStaffById);
router.post('/staffs', authenticateToken, StaffController.createStaff);
router.put('/staffs/:id', authenticateToken, StaffController.updateStaff);
router.delete('/staffs/:id', authenticateToken, StaffController.deleteStaff);

router.post('/participants', authenticateToken, ParticipantController.createParticipant);
router.put('/participants/:id', authenticateToken, ParticipantController.updateParticipant);
router.delete('/participants/:id', authenticateToken, ParticipantController.deleteParticipant);

router.post('/send-sms', authenticateToken, NotificationController.sendNotification);
router.get('/notifications', authenticateToken, NotificationController.getNotifications);
router.get('/notifications/:id/check-status', authenticateToken, NotificationController.updateNotificationStatus);

export default router;
