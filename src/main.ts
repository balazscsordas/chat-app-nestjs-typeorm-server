import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Chat App')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors({
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    origin: [process.env.CLIENT_URL],
  });

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
