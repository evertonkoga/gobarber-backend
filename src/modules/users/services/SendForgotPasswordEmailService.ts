import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IMailProvider from '@shared/container/providers/mailProvider/models/IMailProvider';
import IUserTokenRepository from '../repositories/IUserTokensRepository';

interface Request {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokenRepository')
    private userTokensRepository: IUserTokenRepository
  ) { }

  public async execute({ email }: Request): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) throw new AppError('User does not exists.');

    await this.userTokensRepository.generate(user.id);

    this.mailProvider.sendMail(email, 'Pedito de reuperação de senha recebido.');
  }
}

export default SendForgotPasswordEmailService;
