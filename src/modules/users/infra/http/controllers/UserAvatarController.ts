import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

export default class UserAvatarContoller {
  public async update(request: Request, response: Response): Promise<Response> {
    const user = await container.resolve(UpdateUserAvatarService).execute(
      {
        user_id: request.user.id,
        avatarFilename: request.file.filename,
      },
    );

    return response.json(classToClass(user));
  }
}
