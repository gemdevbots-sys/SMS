import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { sendSms, checkStatus } from '../services/smsService';

export const sendNotification = async (req: Request, res: Response) => {
  try {
    const { participantIds, messageText, staffId } = req.body;

    if (!participantIds || !Array.isArray(participantIds) || participantIds.length === 0 || !messageText) {
      return res.status(400).json({ error: 'Неверные параметры отправки' });
    }

    const results = [];

    for (const pId of participantIds) {
      const participant = await prisma.participant.findUnique({ where: { id: Number(pId) } });
      if (!participant) continue;

      const notification = await prisma.notification.create({
        data: {
          participantId: participant.id,
          staffId: Number(staffId),
          messageText,
          status: 'queued',
        }
      });

      let phone = participant.phone.replace(/\D/g, '');
      if (phone.startsWith('8')) phone = '7' + phone.substring(1);

      const result = await sendSms(phone, messageText);

      const updated = await prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: result.success ? 'sent' : 'error',
          externalId: result.externalId ? String(result.externalId) : null,
          apiResponse: result.apiResponse,
          errorMessage: result.error,
          sentAt: result.success ? new Date() : null,
        }
      });

      results.push(updated);

      await prisma.eventLog.create({
        data: {
          staffId: Number(staffId),
          participantId: participant.id,
          notificationId: notification.id,
          actionType: 'send_sms',
          details: result.success ? `SMS отправлено (ID: ${result.externalId})` : `Ошибка отправки: ${result.error}`,
        }
      });
    }

    res.json({ success: true, results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при отправке сообщений' });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const { staffId } = req.query;
        const where = staffId ? { staffId: Number(staffId) } : {};

        const notifications = await prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { participant: true }
        });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения уведомлений' });
    }
};

export const updateNotificationStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const notification = await prisma.notification.findUnique({ where: { id: Number(id) } });

        if (!notification || !notification.externalId) {
            return res.status(404).json({ error: 'Уведомление не найдено или нет внешнего ID' });
        }

        const statusResult = await checkStatus(notification.externalId);

        if (statusResult.success && statusResult.data) {
             await prisma.notification.update({
                 where: { id: Number(id) },
                 data: {
                     apiResponse: JSON.stringify(statusResult.data),
                 }
             });
             res.json({ success: true, data: statusResult.data });
        } else {
            res.status(500).json({ error: 'Ошибка проверки статуса' });
        }

    } catch (error) {
         res.status(500).json({ error: 'Ошибка' });
    }
}
