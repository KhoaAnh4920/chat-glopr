import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
@Injectable()
export class UploadService {
  async uploadImage(
    file: Express.Multer.File,
    nameFolder: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: nameFolder,
          use_filename: true,
          unique_filename: true,
        },
        (error: Error, result: UploadApiResponse) => {
          if (result) resolve(result);
          else reject(error);
        },
      );
      // read file and upload to cloundinary  //
      toStream(file.buffer).pipe(upload);
    });
  }

  async uploadImageToCloudinary(file: Express.Multer.File, nameFolder: string) {
    return await this.uploadImage(file, nameFolder).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }

  async uploadMultiImageToCloudinary(
    files: Express.Multer.File[],
    nameFolder: string,
  ): Promise<string[]> {
    // return await this.uploadImage(file).catch(() => {
    //   throw new BadRequestException('Invalid file type.');
    // });
    const result: string[] = [];
    await Promise.all(
      files.map(async (file) => {
        const res = await this.uploadImage(file, nameFolder).catch(() => {
          throw new BadRequestException('Invalid file type.');
        });
        result.push(res.secure_url);
      }),
    );
    console.log('result: ', result);
    console.log('Type: ', typeof result);
    return result;
  }
}
