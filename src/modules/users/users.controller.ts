import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return new UserResponseDto(user);
  }

  @Get('profile')
  async getProfile(): Promise<any> {
    // Placeholder - will use @GetUser() decorator in Phase 3
    return { message: 'Get profile endpoint - requires authentication' };
  }

  @Patch('profile')
  async updateProfile(@Body() updateUserDto: UpdateUserDto): Promise<any> {
    // Placeholder - will use @GetUser() decorator in Phase 3
    return { message: 'Update profile endpoint - requires authentication' };
  }

  @Delete('profile')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteProfile(): Promise<void> {
    // Placeholder - will use @GetUser() decorator in Phase 3
  }
}