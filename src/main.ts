import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // bufferLogs: true,
    // logger: false,
  });
  // app.useLogger(app.get(Logger));

  var PORT: any = 3200;
  if (process.env.PORT) {
    PORT = process.env.PORT;
  }

  const config = new DocumentBuilder()
    .setTitle('Sunflower-API')
    .setDescription('Sunflower Core REST Api Developed With Nest.JS')
    .setVersion('alpha')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document, {
    customfavIcon: '/favicon.png',
    customSiteTitle: 'API Explorer',
  });

  app.enableCors({
    origin: [
      'http://localhost:3006',
      'http://192.168.43.123:3006',
      'https://sunflowerpanel.com.au',
      'http://localhost:3200',
    ],
  });

  // app.use(LoggerMiddleware);
  await app.listen(PORT);
}
bootstrap();
