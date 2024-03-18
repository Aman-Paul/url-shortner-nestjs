import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService){}

    getUserDetailsService(user: User){
        const userInfo = this.prisma.user.findFirst({
            where: {
                email: user.email
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                shortUrl: {
                    select: {
                        id: true,
                        shortId: true,
                        redirectUrl: true,
                    }
                }
            }
        })
        return userInfo
    }

    getUserDetailsById(userId: number){
        const userInfo = this.prisma.user.findFirst({
            where: {
                id: userId
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                shortUrl: {
                    select: {
                        id: true,
                        shortId: true,
                        redirectUrl: true,
                    }
                }
            }
        })
        return userInfo
    }
}
