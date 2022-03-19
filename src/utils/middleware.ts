import { NextFunction, Request, Response } from 'express';
import { authProps } from '../constants';
import { HttpStatus } from '@nestjs/common';
import ErrorService, { ERROR } from './errors';
import JwtService from '../shared/jwt.service';

export const setUserIdToLocals = async (
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
    const reqUser = { id: clientData.id, role: clientData.role };

    if (Number(clientData.id)) {
      res.locals.user = reqUser;
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
