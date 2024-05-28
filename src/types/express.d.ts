import { Request } from 'express';

declare module 'express-serve-static-core' {
  interface Request {
    user?: any; // Use the appropriate type for `user` instead of `any`
  }
}
