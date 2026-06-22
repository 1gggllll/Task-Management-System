import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { validate } from '../middleware/validate';
import { projectSchemas } from '../dto/project.dto';
import { authenticate } from '../middleware/authenticate';

const router = Router();
const projectController = new ProjectController();

router.use(authenticate);

router.get('/', projectController.getAll);
router.post('/', validate(projectSchemas.create), projectController.create);
router.get('/:id', projectController.getById);
router.put('/:id', validate(projectSchemas.update), projectController.update);
router.delete('/:id', projectController.delete);
router.post('/:id/members', validate(projectSchemas.addMember), projectController.addMember);
router.delete('/:id/members/:userId', projectController.removeMember);

export { router as projectRoutes };