import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  if (process.env.NODE_ENV === 'production') {
    app.enableCors({
      origin: process.env.WEB_URL,
      credentials: true,
    });
    await app.listen(process.env.PORT, process.env.HOST);
  } else {
    app.enableCors();
    await app.listen(3001);
  }
}
bootstrap();
