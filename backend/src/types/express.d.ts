// types/express.d.ts
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string; // Add your custom property
      user?: JwtPayload; // Optional: Full user payload
    }
  }
}
