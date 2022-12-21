import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'AccessValidator', async: false })
export class Access implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return ["ALL-TEACHERS","GROUP-TEACHERS"].includes(text); // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Text ($value) is either director or censor!';
  }
}


