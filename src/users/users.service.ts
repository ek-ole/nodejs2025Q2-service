import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: string): User {
    return null;
  }

  create(createUserDto: CreateUserDto): User {
    return null;
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto): User {
    return null;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
