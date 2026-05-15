import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

// Create a task
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, dueDate, priority, projectId, assigneeId } = req.body;
    
    // Check if project exists and user is admin or member
    const projectMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: { projectId, userId: req.user!.id }
      }
    });

    if (!projectMember) {
      res.status(403).json({ error: 'Access denied to this project' });
      return;
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority || 'MEDIUM',
        projectId,
        assigneeId
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Task create error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get tasks for a project
router.get('/project/:projectId', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projectId = req.params.projectId as string;
    
    const projectMember = await prisma.projectMember.findUnique({
      where: {
        projectId_userId: { projectId, userId: req.user!.id }
      }
    });

    if (!projectMember) {
      res.status(403).json({ error: 'Access denied to this project' });
      return;
    }

    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: { select: { id: true, name: true, email: true } }
      }
    });

    res.json(tasks);
  } catch (error) {
    console.error('Tasks get error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update task
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const { status, priority, title, description, assigneeId } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: { status, priority, title, description, assigneeId }
    });

    res.json(task);
  } catch (error) {
    console.error('Task update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
