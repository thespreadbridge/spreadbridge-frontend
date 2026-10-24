import path from 'node:path';
import { fileURLToPath } from 'node:url';
const projectRoot = path.dirname(fileURLToPath(import.meta.url));
export default {
  outputFileTracingRoot: projectRoot,
  turbopack: { root: projectRoot },
  trailingSlash: true, poweredByHeader: false,
  images: { unoptimized: true },
  logging: { incomingRequests: { ignore: [/\/api\/session\/google\//, /^\/\?.*(?:code|state)=/] } },
};
