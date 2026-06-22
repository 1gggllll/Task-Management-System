import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authSchemas } from '../dto/auth.dto';
import { authenticate } from '../middleware/authenticate';

const router = Router();
const authController = new AuthController();

router.post('/register', validate(authSchemas.register), authController.register);
router.post('/login', validate(authSchemas.login), authController.login);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, validate(authSchemas.updateProfile), authController.updateProfile);

export { router as authRoutes };