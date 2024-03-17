import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UrlShortenerModule } from './url-shortener/url-shortener.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), ScheduleModule.forRoot(),AuthModule, PrismaModule, UrlShortenerModule],
})
export class AppModule {}
