import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const createParticipant = async (req: Request, res: Response) => {
  try {
    const { staffId, fio, phone, position } = req.body;

    if (!staffId || !fio || !phone) {
      return res.status(400).json({ error: 'Неполные данные' });
    }

    const participant = await prisma.participant.create({
      data: {
        staffId: Number(staffId),
        fio,
        phone,
        position,
      },
    });

    await prisma.eventLog.create({
      data: {
        staffId: Number(staffId),
        participantId: participant.id,
        actionType: 'add_participant',
        details: `Добавлен участник: ${fio}`,
      },
    });

    res.json(participant);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при добавлении участника' });
  }
};

export const updateParticipant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fio, phone, position } = req.body;

    const participant = await prisma.participant.update({
      where: { id: Number(id) },
      data: { fio, phone, position },
    });

    res.json(participant);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении участника' });
  }
};

export const deleteParticipant = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.participant.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении участника' });
  }
};
