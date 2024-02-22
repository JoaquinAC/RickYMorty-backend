// src/middlewares/authenticateJWT.ts
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (error:any, user:any, info:any) => {
    if (error || !user) {
      // Opcional: Puedes personalizar el manejo del error basado en `info`
      return res.status(401).json({ message: "No autorizado. " + (info?.message || "") });
    }
    req.user = user;
    next();
  })(req, res, next);
};

export default authenticateJWT;
