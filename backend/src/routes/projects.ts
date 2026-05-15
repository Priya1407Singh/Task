import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

// Create a project
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    const userId = req.user!.id;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        adminId: userId,
        members: {
          create: { userId: userId, role: 'ADMIN' }
        }
      }
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Project create error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all projects for a user
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const projects = await prisma.project.findMany({
      where: { members: { some: { userId } } },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, createdAt: true } }
          }
        }
      }
    });

    res.json(projects);
  } catch (error) {
    console.error('Projects get error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single project by ID
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;

    const project = await prisma.project.findFirst({
      where: {
        id,
        members: { some: { userId } }
      },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, createdAt: true } }
          }
        },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, email: true } }
          }
        }
      }
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.json(project);
  } catch (error) {
    console.error('Project get error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a member to a project by email (admin only)
router.post('/:id/members', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projectId = req.params.id as string;
    const { email, role } = req.body;
    const requesterId = req.user!.id;

    // Check requester is admin
    const requesterMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: requesterId } }
    });

    if (!requesterMember || requesterMember.role !== 'ADMIN') {
      res.status(403).json({ error: 'Only admins can add members' });
      return;
    }

    // Find user by email
    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) {
      res.status(404).json({ error: 'User with this email not found. They must sign up first.' });
      return;
    }

    // Check if already a member
    const existing = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: userToAdd.id } }
    });

    if (existing) {
      res.status(400).json({ error: 'User is already a member of this project' });
      return;
    }

    const member = await prisma.projectMember.create({
      data: {
        projectId,
        userId: userToAdd.id,
        role: role || 'MEMBER'
      },
      include: {
        user: { select: { id: true, name: true, email: true, createdAt: true } }
      }
    });

    res.status(201).json(member);
  } catch (error) {
    console.error('Member add error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Remove a member from a project (admin only)
router.delete('/:id/members/:userId', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projectId = req.params.id as string;
    const targetUserId = req.params.userId as string;
    const requesterId = req.user!.id;

    const requesterMember = await prisma.projectMember.findUnique({
      where: { projectId_userId: { projectId, userId: requesterId } }
    });

    if (!requesterMember || requesterMember.role !== 'ADMIN') {
      res.status(403).json({ error: 'Only admins can remove members' });
      return;
    }

    await prisma.projectMember.delete({
      where: { projectId_userId: { projectId, userId: targetUserId } }
    });

    res.json({ message: 'Member removed' });
  } catch (error) {
    console.error('Member remove error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
