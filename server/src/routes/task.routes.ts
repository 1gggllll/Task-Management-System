import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { validate } from '../middleware/validate';
import { taskSchemas } from '../dto/task.dto';
import { authenticate } from '../middleware/authenticate';

const router = Router();
const taskController = new TaskController();

router.use(authenticate);

router.get('/projects/:projectId/tasks', taskController.getByProject);
router.post('/projects/:projectId/tasks', validate(taskSchemas.create), taskController.create);
router.get('/tasks/:id', taskController.getById);
router.put('/tasks/:id', validate(taskSchemas.update), taskController.update);
router.delete('/tasks/:id', taskController.delete);
router.patch('/tasks/:id/status', validate(taskSchemas.updateStatus), taskController.updateStatus);
router.patch('/tasks/:id/assignee', validate(taskSchemas.updateAssignee), taskController.updateAssignee);

export { router as taskRoutes };