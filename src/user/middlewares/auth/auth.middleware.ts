import { Injectable, NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { ExpressRequest } from 'src/types/expressRequest.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: ExpressRequest, res: Response, next: NextFunction) {
    if (!req.headers['authorization']) {
      req.user = null;
      next();
      return;
    }
    const token = req.headers['authorization'].split(' ')[1];

    try {
      const decodedToken = verify(token, 'secret');
      const user = await this.userService.findUserById(
        (decodedToken as any).id,
      );
      req.user = user;
      next();
    } catch (error) {
      req.user = null;
      next();
      return;
    }
  }
}
