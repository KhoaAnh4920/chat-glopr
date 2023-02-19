import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './shared/auth';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WebsocketAdapter } from './gateway/gateway.adapter';
// import { PeerServer } from 'peer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const adapter = new WebsocketAdapter(app);
  // app.useWebSocketAdapter(adapter);
  app.setGlobalPrefix('api');
  app.enableCors({ credentials: true, origin: true });
  app.useGlobalPipes(new ValidationPipe({}));
  // setup AuthGuard
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuard(reflector));

  const config = new DocumentBuilder()
    .setTitle('Chat Glopr')
    .setDescription('The chat API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // const peerServer = PeerServer({ port: 9000, path: '/peer' });
  // peerServer.on('connection', (client) => {
  //   console.log(`New client connected: ${client.getId()}`);
  // });

  await app.listen(process.env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
