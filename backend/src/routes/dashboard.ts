import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticateToken);

router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    // Get all projects the user is part of
    const userProjects = await prisma.projectMember.findMany({
      where: { userId },
      select: { projectId: true }
    });

    const projectIds = userProjects.map(p => p.projectId);

    // Total tasks
    const totalTasks = await prisma.task.count({
      where: { projectId: { in: projectIds } }
    });

    // Tasks by status
    const tasksByStatus = await prisma.task.groupBy({
      by: ['status'],
      where: { projectId: { in: projectIds } },
      _count: { id: true }
    });

    // Tasks per user (assignee)
    const tasksPerUser = await prisma.task.groupBy({
      by: ['assigneeId'],
      where: { projectId: { in: projectIds }, assigneeId: { not: null } },
      _count: { id: true }
    });

    // Overdue tasks
    const overdueTasks = await prisma.task.count({
      where: {
        projectId: { in: projectIds },
        dueDate: { lt: new Date() },
        status: { not: 'DONE' }
      }
    });

    res.json({
      totalTasks,
      tasksByStatus,
      tasksPerUser,
      overdueTasks
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
