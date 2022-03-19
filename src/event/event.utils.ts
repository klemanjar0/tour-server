import Event from './event.model';
import { get } from 'lodash';
import { Response } from 'express';
import { IRequestUser } from '../utils/entities';

export const isValidEvent = (event: Event) => {};

export const getLocalUser = (req: Response): IRequestUser => {
  return get(req, ['locals', 'user'], {});
};
