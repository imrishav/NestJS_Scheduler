import { NestFactory } from '@nestjs/core';
import {Logger} from '@nestjs/common'
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap() {
  const serverConfig = config.get('server')
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule, { cors: true });

  
  console.log(serverConfig.port)
  const port = serverConfig.port;
  await app.listen(port);

  logger.log(`Application listing on Port ${port}`)

}
bootstrap();
