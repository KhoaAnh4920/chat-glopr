import { FileValidator } from '@nestjs/common';

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
