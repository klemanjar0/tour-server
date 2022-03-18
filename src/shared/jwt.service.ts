import * as randomString from 'randomstring';
import * as jsonwebtoken from 'jsonwebtoken';
import { VerifyErrors } from 'jsonwebtoken';
import { IClientData, IOptions } from '../utils/entities';
import { config as initialize_env } from 'dotenv';

initialize_env();
export class JwtService {
  private readonly secret: string;
  private readonly options: IOptions;

  constructor() {
    this.secret = process.env.JWT_SECRET || randomString.generate(100);
    this.options = { expiresIn: process.env.JWT_MAX_AGE || '3600' };
  }

  public getJwt(data: IClientData): Promise<string> {
    return new Promise((resolve, reject) => {
      jsonwebtoken.sign(data, this.secret, this.options, (err, token) => {
        err ? reject(err) : resolve(token || '');
      });
    });
  }

  public decodeJwt(jwt: string): Promise<IClientData> {
    return new Promise((res, rej) => {
      jsonwebtoken.verify(
        jwt,
        this.secret,
        (err: VerifyErrors | null, decoded?: object) => {
          return err ? rej(err) : res(decoded as IClientData);
        },
      );
    });
  }
}

export default new JwtService();
