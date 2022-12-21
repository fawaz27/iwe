import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'roleManagerValidator', async: false })
export class RoleManager implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    return ["censor"].includes(text); // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Text ($value) is censor!';
  }
}


