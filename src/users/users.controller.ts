import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){}

    @Get('me')
    getUserDetails(@GetUser() user: User){
        return this.usersService.getUserDetailsService(user);
    }

    @Get('/:userId')
    getUserById(@Param('userId', ParseIntPipe) userId: number){
        return this.usersService.getUserDetailsById(userId);
    }
}
