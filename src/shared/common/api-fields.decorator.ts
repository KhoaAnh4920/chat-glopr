import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  MulterField,
  MulterOptions,
} from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { typeMessage } from 'src/messages/messages.enum';

export type UploadFields = MulterField & {
  required?: boolean;
  type?: string;
  default?: any;
};

export function ApiFileFields(
  uploadFields: UploadFields[],
  localOptions?: MulterOptions,
) {
  const bodyProperties: Record<string, SchemaObject | ReferenceObject> =
    Object.assign(
      {},
      ...uploadFields.map((field) => {
        const obj: any = {};
        obj.type = field.type;
        if (field.type === typeMessage.FILE) {
          console.log('Run !!!');
          obj.format = 'binary';
          obj.type = 'string';
        }
        if (field.default) obj.default = field.default;

        // console.log('Check: ', ...obj);

        return { [field.name]: { ...obj } };
      }),
    );
  const apiBody = ApiBody({
    schema: {
      type: 'object',
      properties: bodyProperties,
      required: uploadFields.filter((f) => f.required).map((f) => f.name),
    },
  });

  return applyDecorators(
    UseInterceptors(FileFieldsInterceptor(uploadFields, localOptions)),
    ApiConsumes('multipart/form-data'),
    apiBody,
  );
}
