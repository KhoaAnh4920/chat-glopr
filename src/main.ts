import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AuthGuard } from './shared/auth';
// import { PeerServer } from 'peer';
// Import firebase-admin
import * as admin from 'firebase-admin';
const serviceAccount = {
  type: 'service_account',
  project_id: 'glopr-chat',
  private_key_id: process.env.FIREBASE_ADMIN_PRIVATE_KEY_ID,
  private_key: (process.env.FIREBASE_ADMIN_PRIVATE_KEY as string).replace(
    /\\n/g,
    '\n',
  ),
  client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_ADMIN_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url:
    process.env.FIREBASE_ADMIN_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_ADMIN_CLIENT_X509_CERT_URL,
} as admin.ServiceAccount;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const adapter = new WebsocketAdapter(app);
  // app.useWebSocketAdapter(adapter);
  app.setGlobalPrefix('api');
  app.enableCors({ credentials: true, origin: true });
  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: false,
    }),
  );
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

  // Initialize the firebase admin app
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  // const peerServer = PeerServer({ port: 9000, path: '/peer' });
  // peerServer.on('connection', (client) => {
  //   console.log(`New client connected: ${client.getId()}`);
  // });

  await app.listen(process.env.PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
