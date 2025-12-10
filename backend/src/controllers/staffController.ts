import { Request, Response } from 'express';
import prisma from '../utils/prisma';

const logEvent = async (staffId: number | null, participantId: number | null, actionType: string, details: string) => {
  await prisma.eventLog.create({
    data: {
      staffId,
      participantId,
      actionType,
      details,
    },
  });
};

export const getAllStaffs = async (req: Request, res: Response) => {
  try {
    const staffs = await prisma.staff.findMany({
      include: {
        _count: {
          select: { participants: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(staffs);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении списка штабов' });
  }
};

export const getStaffById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const staff = await prisma.staff.findUnique({
      where: { id: Number(id) },
      include: {
        participants: {
             orderBy: { fio: 'asc' }
        },
        templates: true,
      },
    });
    if (!staff) {
      return res.status(404).json({ error: 'Штаб не найден' });
    }
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении данных штаба' });
  }
};

export const createStaff = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Название обязательно' });

    const staff = await prisma.staff.create({
      data: { name },
    });

    await logEvent(staff.id, null, 'create_staff', `Создан штаб: ${name}`);
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании штаба' });
  }
};

export const updateStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const staff = await prisma.staff.update({
      where: { id: Number(id) },
      data: { name },
    });
    await logEvent(staff.id, null, 'update_staff', `Обновлен штаб: ${name}`);
    res.json(staff);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при обновлении штаба' });
  }
};

export const deleteStaff = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.staff.delete({ where: { id: Number(id) } });
    await logEvent(Number(id), null, 'delete_staff', 'Штаб удален');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при удалении штаба' });
  }
};
