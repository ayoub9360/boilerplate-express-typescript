// Import API registrations to ensure routes are registered
import '../apis/_example/openapi.js';
// Add more API imports here as they are created:
// import '../apis/html-to-pdf/openapi.js';
// import '../apis/qr-code/openapi.js';

import type { OpenAPIObject } from 'openapi3-ts/oas30';
import { generateOpenAPIDocument } from './openapi.js';

// Generate the OpenAPI spec after all routes are registered
export const swaggerSpec: OpenAPIObject = generateOpenAPIDocument();
