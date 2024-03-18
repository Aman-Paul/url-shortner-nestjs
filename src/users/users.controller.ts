import { Controller, Get, Param, ParseIntPipe, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService){}

    @UseInterceptors(CacheInterceptor)
    @CacheTTL(10)
    @Get('me')
    getUserDetails(@GetUser() user: User){
        return this.usersService.getUserDetailsService(user);
    }

    @UseInterceptors(CacheInterceptor)
    @CacheTTL(10)
    @Get('/:userId')
    getUserById(@Param('userId', ParseIntPipe) userId: number){
        return this.usersService.getUserDetailsById(userId);
    }
}
