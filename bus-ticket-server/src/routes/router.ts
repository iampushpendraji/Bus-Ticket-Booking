import { Router } from 'express';
import { authenticate_token } from '../services/authentication.service';
import health_check_router from './health_check.routes';
import user_router from './user.routes';

const router = Router();

router.use('/api/v1/health_check', health_check_router);
router.use('/api/v1/user', user_router);

// Applied the authentication middleware globally
router.use(authenticate_token);

export default router;