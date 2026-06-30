import { Exclude } from 'class-transformer';

export class UserResponseDto {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  password: string;

  @Exclude()
  deletedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}