import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { Schedule} from '../models/schedule.entity';

export function IsSchedule( validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isWorking',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value instanceof Schedule;
        },
      },
    });
  };
}

