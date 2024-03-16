import { Injectable } from '@nestjs/common';
import { ShortUrl, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UrlShortenerDto } from './dto';

import ShortUniqueId from 'short-unique-id';

@Injectable()
export class UrlShortenerService {
    constructor(private prisma: PrismaService){}
    
    async shortUrlService( dto: UrlShortenerDto, user: User) {
        const { randomUUID } = new ShortUniqueId({ length: 8});
        const shortId: ShortUrl = await this.prisma.shortUrl.create({
            data:  {
                shortId: randomUUID(),
                redirectUrl: dto.url,
                userId: user.id
            }
        })

        return { shortId: shortId.shortId }
    }

    async redirectUrlService(shortId: string, user: User) {
        const rediectUrl = await this.prisma.shortUrl.findFirst({
            where: {
                shortId: shortId
            },
            select: {
                id: true,
                redirectUrl: true,
                clickCount: true
            }
        })

        await this.prisma.shortUrl.update({
            where:{
                id: rediectUrl.id,
                shortId: shortId
            },
            data: {
                clickCount: rediectUrl.clickCount + 1,
            }
        })

        return { url: rediectUrl.redirectUrl}
    }
}
