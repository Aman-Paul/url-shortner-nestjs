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

        return shortId
    }
}
