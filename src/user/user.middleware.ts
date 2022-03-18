import { NextFunction, Request, Response } from 'express';
import { authProps } from 'src/constants';
import JwtService from '../shared/jwt.service';
import { UserRoles } from './entity';
import { HttpStatus } from '@nestjs/common';
import ErrorService, { ERROR } from '../utils/errors';

export const isAdminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const jwt = (req.headers[authProps.key] ||
      req.headers[authProps.key.toLowerCase()]) as string;
    if (!jwt) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(ErrorService.getError(ERROR.NO_TOKEN));
    }
    const clientData = await JwtService.decodeJwt(jwt);

    if (Number(clientData.role) >= UserRoles.ADMIN) {
      next();
    } else {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(ErrorService.getError(ERROR.NO_ACCESS));
    }
  } catch (err: any) {
    if (err.message === 'jwt expired') {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json(ErrorService.getError(ERROR.TOKEN_EXPIRED));
    }
    return res
      .status(HttpStatus.UNAUTHORIZED)
      .json(ErrorService.getError(-1, err.message));
  }
};
