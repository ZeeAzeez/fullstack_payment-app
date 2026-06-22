import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { sendSuccess } from '../utils/apiResponse';

export class UserController {
  /**
   * GET /api/users/search?email=...
   * Returns whether a user with the given email exists.
   * Only exposes public-safe fields (id, name, email) — never password/balance.
   */
  async searchByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const email = req.query.email as string;

      if (!email || typeof email !== 'string') {
        return res.status(400).json({ success: false, error: 'email query parameter is required' });
      }

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        select: { id: true, name: true, email: true },
      });

      if (!user) {
        return sendSuccess(res, { found: false, user: null });
      }

      return sendSuccess(res, { found: true, user });
    } catch (error) {
      next(error);
    }
  }
}
