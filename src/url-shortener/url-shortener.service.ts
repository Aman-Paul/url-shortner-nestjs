import { Injectable } from '@nestjs/common';
import { ShortUrl, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { UrlShortenerDto } from './dto';

import ShortUniqueId from 'short-unique-id';
import { URL_ACTIVE_TIME } from '../config/appConstants.json';

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
        try {
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

            if (!rediectUrl) {
                return false;
            }

            await Promise.all([this.prisma.shortUrl.update({
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
            return { url: rediectUrl.redirectUrl }
        } catch (error) {
            throw `Error in redirectUrlService:${error}`;
        }
    }


    async deleteExpiredUrls(): Promise<void> {
        const twentyFourHoursAgo = new Date();
        twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - URL_ACTIVE_TIME);
    
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


      async getUrlAnalytics(shortId: string){
        try {
            let urlAnalytics = await this.prisma.shortUrl.findFirst({
                where: {
                    shortId: shortId
                },
                select: {
                    clickCount: true,
                    clickAnalytics: {
                        select: {
                            id: true,
                            createdAt: true,
                            deviceType: true
                        }
                    }
                }
            })

            urlAnalytics['mostActiveHours'] = this.getMostActiveHours(urlAnalytics.clickAnalytics);
            
            return urlAnalytics;
        } catch (error) {
            throw `Error in getUrlAnalytics: ${error}`;
        }
      }


    getMostActiveHours(clicks) {
        const hourCounts: Object = {};
    
        // Count the clicks for each hour
        clicks.forEach(click => {
            const hour = new Date(click.createdAt).getHours();
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });
    
        // Find the hour(s) with the maximum clicks
        const maxClicks = Math.max(...Object.values(hourCounts));
        const mostActiveHours = Object.keys(hourCounts).filter(hour => hourCounts[hour] === maxClicks);
    
        return { mostActiveHours, hourlyClickCounts: hourCounts };
    }
}
