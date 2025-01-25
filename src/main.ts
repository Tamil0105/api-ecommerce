import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:true});

  app.enableCors({
    origin: '*', // Allow all origins (You can specify allowed origins instead)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
