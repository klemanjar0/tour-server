import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { BalanceService } from './balance.service';
import { Response } from 'express';
import { getLocalUser } from '../event/event.utils';

@Controller('balance')
export class BalanceController {
  constructor(
    private readonly userService: UserService,
    private readonly balanceService: BalanceService,
  ) {}

  @Get('get')
  async getBalance(@Res() res: Response) {
    const userId = getLocalUser(res).id;
    const response = await this.balanceService.getBalance(userId);
    return res.status(HttpStatus.OK).json(response);
  }

  @Post('increase')
  async verifyPayment(
    @Res() res: Response,
    @Body() body: { id: number; amount: number },
  ) {
    const response = await this.balanceService.augmentBalance(
      body.id,
      body.amount,
    );
    return res.status(HttpStatus.OK).json(response);
  }

  @Post('withdrawal')
  async withdrawalPayment(
    @Res() res: Response,
    @Body() body: { id: number; amount: number; cardNumber: string },
  ) {
    const response = await this.balanceService.decreaseBalance(
      body.id,
      body.amount,
    );
    return res.status(HttpStatus.OK).json(response);
  }
}
