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
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ISingleRes, ResponseMessage } from 'src/shared/response';
import { UploadService } from './upload.service';
import { Response } from 'express';
import { IResponseUpload } from './upload.type';
import { MaxSizeFileValidator, TypeFileValidator } from './constants';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @ApiTags('Upload')
  @Post('/avatar')
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      example: {
        success: true,
        statusCode: 201,
        message: ResponseMessage.CREATE_SUCCESS,
        data: {
          secure_url:
            'https://res.cloudinary.com/dpo9d3otr/raw/upload/v1657627689/image/avatar/Phuongly.jpg',
          created_at: '2023-01-02T06:52:02.305Z',
        },
      },
    },
  })
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
    const result = await this.uploadService.uploadImageToCloudinary(
      file,
      'avatar',
    );
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
