import { FileValidator, UnsupportedMediaTypeException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { AppError, ERROR_CODE } from 'src/shared/error';

export const CLOUDINARY = 'Cloudinary';

export declare type MaxFileSizeValidatorOptions = {
  maxSize: number;
};
export declare type FileTypeValidatorOptions = {
  fileType: string | RegExp;
};
export class MaxSizeFileValidator extends FileValidator<MaxFileSizeValidatorOptions> {
  constructor(readonly options: MaxFileSizeValidatorOptions) {
    super({ maxSize: options.maxSize });
  }
  isValid(file?: any): boolean {
    return file.size < this.options.maxSize;
  }
  buildErrorMessage(): string {
    return 'File size is more than 2 MB';
  }
}

export class TypeFileValidator extends FileValidator<FileTypeValidatorOptions> {
  constructor(readonly options: FileTypeValidatorOptions) {
    super({ fileType: options.fileType });
  }
  isValid(file?: any): boolean {
    if (typeof this.options.fileType !== 'string') {
      return this.options.fileType.test(file.originalname);
    }
    return file.mimetype === 'image/jpeg' || file.mimetype === 'image/png';
  }
  buildErrorMessage(): string {
    return 'Unsupported file format';
  }
}

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: (error: Error, acceptFile: boolean) => void,
) => {
  if (
    !Boolean(
      file.mimetype.match(
        /(jpg|jpeg|png|gif|mp3|mp4|pdf|doc|docx|ppt|pptx|rar|zip)/,
      ),
    )
  )
    callback(
      new UnsupportedMediaTypeException(`Unsupported ${file.mimetype} file`),
      false,
    );
  callback(null, true);
};

export const filesOptions: MulterOptions = {
  limits: { fileSize: 20971520 },
  fileFilter: fileFilter,
};
