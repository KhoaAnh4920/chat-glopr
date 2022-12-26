import passwordValidator from 'password-validator';
import { PASSWORD_MIN_LENGTH } from './auth.constant';
import { registerDecorator, ValidationOptions } from 'class-validator';

const validatePassword = (password: string): boolean => {
  // Create a schema
  const schema = new passwordValidator();

  // Add properties to it
  schema
    .is()
    .min(PASSWORD_MIN_LENGTH) // Minimum length 6
    .has()
    .uppercase() // Must have uppercase letters
    // .has()
    // .lowercase() // Must have lowercase letters
    .has()
    .digits() // Must have digits
    .has()
    .not()
    .spaces(); // Should not have spaces

  // Validate against a password string
  return schema.validate(password) as boolean;
};

export function IsPasswordValid(validationOptions?: ValidationOptions) {
  return function(object: any, propertyName: string) {
    registerDecorator({
      name: 'isPasswordValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) {
            return true;
          }
          return typeof value === 'string' && validatePassword(value); // you can return a Promise<boolean> here as well, if you want to make async validation
        },
      },
    });
  };
}
