import { Injectable } from '@nestjs/common';
import { ShortUrl, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UrlShortenerDto } from './dto';

import ShortUniqueId from 'short-unique-id';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlShortenerService {
    constructor(private prisma: PrismaService, private config: ConfigService){}
    
    async shortUrlService( dto: UrlShortenerDto, user: User) {
        const { randomUUID } = new ShortUniqueId({ length: 8});
        const shortId: ShortUrl = await this.prisma.shortUrl.create({
            data:  {
                shortId: randomUUID(),
                redirectUrl: dto.url,
                userId: user.id
            }
        })
        const shortUrl = this.config.get("BASE_URL") + shortId.shortId;

        return { shortId: shortUrl }
    }

    async redirectUrlService(shortId: string, deviceType: string, user: User) {
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

        if(!rediectUrl) {
            return false;
        }

        const [updatedShortUrl, clickAnalytics] = await Promise.all([this.prisma.shortUrl.update({
            where: {
                id: rediectUrl.id,
                shortId: shortId
            },
            data: {
                clickCount: rediectUrl.clickCount + 1,
            }
        }), this.prisma.clickAnalytics.create({
            data: {
                deviceType: deviceType,
                shortUrlId: rediectUrl.id,
            }
        })]) 

        console.log("Click DAta:::::::", updatedShortUrl, clickAnalytics)


        return { url: rediectUrl.redirectUrl }
    }


    async deleteExpiredUrls(): Promise<void> {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 1);
    
        const inactiveShortUrl = await this.prisma.shortUrl.findMany({
          where: {
            isActive: false,
            createdAt: { lt: twentyFourHoursAgo },
          },
        });
    
        await Promise.all(
            inactiveShortUrl.map(async (url) => {
            await this.prisma.shortUrl.delete({
              where: { id: url.id, shortId: url.shortId }
            });
          }),
        );
      }


      async getUrlAnalytics(shortId){

      }
}
