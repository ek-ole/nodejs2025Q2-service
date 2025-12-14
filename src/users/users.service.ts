import { LoggingService } from 'src/commom/logger/logging.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { User } from './entities/user.entity';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly loggingService: LoggingService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.loggingService.info(
      `Creating user with login: ${createUserDto.login}`,
      'UsersService',
    );
    const user = this.usersRepository.create(createUserDto);

    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    if (id.length !== 36) {
      throw new BadRequestException('User id is not a valid uuid');
    }

    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const user = await this.findOne(id);
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }
    user.password = updatePasswordDto.newPassword;
    user.version += 1;

    return await this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    if (id.length !== 36) {
      throw new BadRequestException('User id is not a valid uuid');
    }

    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
