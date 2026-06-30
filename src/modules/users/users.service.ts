import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if email exists
    const existingEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
      withDeleted: true,
    });
    if (existingEmail) {
      throw new ConflictException('Email already in use');
    }

    // Check if username exists
    const existingUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
      withDeleted: true,
    });
    if (existingUsername) {
      throw new ConflictException('Username already taken');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.userRepository.save(user);
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
  select: {
    id: true,
    email: true,
    username: true,
    createdAt: true,
    updatedAt: true,
  },    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    
    // If updating password, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Check email uniqueness if being updated
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
        withDeleted: true,
      });
      if (existing) {
        throw new ConflictException('Email already in use');
      }
    }

    // Check username uniqueness if being updated
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existing = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
        withDeleted: true,
      });
      if (existing) {
        throw new ConflictException('Username already taken');
      }
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.softDelete(id);
  }

  // Internal method for auth (Phase 3)
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
  select: {
    id: true,
    email: true,
    username: true,
    createdAt: true,
    updatedAt: true,
  },    });
  }

  // Check if user is soft-deleted
  async isSoftDeleted(id: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    return !!user?.deletedAt;
  }
}