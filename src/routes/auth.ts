import { Request, Router, Response, NextFunction } from 'express';
import {
  forgotPassword,
  login,
  refreshToken,
  register,
  resetPassword,
} from '../controllers/auth.controller';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from '../docs/swagger';
import passport from 'passport';


export default (app: any) => {
  const router = Router();

  app.use('/api', router);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const response = await login(email, password);
      return res.status(200).json(response);
    } catch (error) {
      return next(error);
    }
  }
  );

  router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response: any = await register(req.body);
      if (response && response.exists) {
        return res.status(403).json({ success: false, message: 'User already exists' });
      }
      if (response) {
        return res.status(200).json({ success: true, response });
      }
      return res.status(204).json({});
    } catch (error) {
      return next(error);
    }
  });

  router.post('/validate-token', passport.authenticate('jwt', { session: false }), (req: Request, res: Response, next: NextFunction) => {
    const user: any = req.user;

    try {
      res.status(200).json({ token: req.headers['authorization'].split(' ')[1], userId: user._id });
    } catch (error) {
      return res.status(401).json({ message: 'Token not valid.' });
    }
  });

  router.post('/refresh-token', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      // call refresh token controller
      const response: any = await refreshToken(token);
      if (response && response.token) {
        return res.json(response);
      }
      return res.status(401).json({ message: 'Wrong refresh token' });
    } catch (error) {
      next(error);
    }
  });

  router.post('/forgot-password', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const response: any = await forgotPassword(req.body.email);
      if (response && response['success'] == true) {
        return res.status(200).json({
          success: true,
          message: 'A link to reset password was sent to the email',
        });
      }
    } catch (error) {
      return next(error);
    }
  });

  router.post('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token: string = String(req.body.token);
      const email: string = String(req.body.email);
      const password: string = String(req.body.password);
      const response: any = await resetPassword(email, password, token);
      if (response && response['success'] == true) {
        return res.status(200).json({
          success: true,
          message:
            'Your password was updated succesfully. Now you can login with your new password',
        });
      }
      if (response && !response.exists) {
        return res.status(403).json({ success: false });
      }
    } catch (error) {
      return next(error);
    }
  });
};
