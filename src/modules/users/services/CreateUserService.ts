import { hash } from 'bcryptjs';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface Request {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) { }

  public async execute({ name, email, password }: Request): Promise<User> {
    const userExists = await this.usersRepository.findByEmail(email);

    if (userExists) throw new AppError('Email address alredy used.');

    const hashedPassord = await hash(password, 8);

    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassord,
    });

    return user;
  }
}

export default CreateUserService;