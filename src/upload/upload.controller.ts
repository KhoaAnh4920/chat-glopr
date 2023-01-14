import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  Get,
  HttpStatus,
  Param,
  Patch,
  Query,
  Res,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ISingleRes, ResponseMessage } from 'src/shared/response';
import { UploadService } from './upload.service';
import { Response } from 'express';
import { IResponseUpload } from './upload.type';
import { MaxSizeFileValidator, TypeFileValidator } from './constants';

@Controller('upload')
export class UploadController {
  constructor(private readonly appService: UploadService) {}

  @ApiTags('Upload')
  @Post('/avatar')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
    description: 'Type: image/jpeg or image/png \n\n Max size: 2 MB',
  })
  @UseInterceptors(FileInterceptor('file'))
  public async uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxSizeFileValidator({ maxSize: 2000000 }),
          new TypeFileValidator({ fileType: /\.(jpg|jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Res() res: Response,
  ) {
    //return this.appService.uploadImageToCloudinary(file);
    const result = await this.appService.uploadImageToCloudinary(file);
    const resBody: ISingleRes<IResponseUpload> = {
      success: true,
      statusCode: 201,
      message: ResponseMessage.CREATE_SUCCESS,
      data: {
        secure_url: result.secure_url,
        created_at: result.created_at,
      },
    };

    return res.status(HttpStatus.OK).send(resBody);
  }
}
