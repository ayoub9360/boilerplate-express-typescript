import { Router, type Router as RouterType } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../../config/swagger.js';
import { generalController } from './controller.js';

const router: RouterType = Router();

// General routes (health, info)
router.get('/', generalController.info);
router.get('/health', generalController.health);

// Swagger documentation
router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
router.get('/docs.json', generalController.docsJson);

export default router;
