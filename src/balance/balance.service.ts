import { Injectable } from '@nestjs/common';
import Balance from './balance.model';
import sequelize from '../database';
import { Transaction } from 'sequelize';
import ErrorService, { ERROR } from '../utils/errors';

@Injectable()
export class BalanceService {
  async getBalance(userId: number) {
    return await Balance.findOne({ where: { userId: userId } });
  }

  async augmentBalance(id: number, amount: number) {
    try {
      return await sequelize.transaction(async (t: Transaction) => {
        const balance = await Balance.findByPk(id, { transaction: t });
        if (amount <= 0) {
          throw new Error('Non valid value');
        }
        const initialBalance = Number(balance.account);
        balance.account = initialBalance + Number(amount);
        await balance.save({ transaction: t });
        return balance;
      });
    } catch (e) {
      return ErrorService.getError(ERROR.DATABASE);
    }
  }

  async decreaseBalance(id: number, amount: number) {
    try {
      return await sequelize.transaction(async (t: Transaction) => {
        const balance = await Balance.findByPk(id, { transaction: t });
        if (amount >= 0) {
          throw new Error('Non valid value');
        }
        const initialBalance = Number(balance.account);
        balance.account = initialBalance - Number(amount);
        if (balance.account < 0) throw new Error('Negative Balance');
        await balance.save({ transaction: t });
        return balance;
      });
    } catch (e) {
      return ErrorService.getError(ERROR.DATABASE);
    }
  }
}
