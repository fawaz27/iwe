import {IsString,IsNotEmpty, Validate} from 'class-validator'
import { Role } from '../utils/validator-role';
class CreateUserDto
{
    
    @IsString()
    public lastName: string;

    @IsString()
    public firstName: string;

    @IsNotEmpty({message: ' please the email is required'})
    @IsString()
    public email: string;

    @IsNotEmpty({message: ' please the hashPassword is required'})
    @IsString()
    public hashPassword: string;

    @IsString()
    public phone: string;

    @IsString()
    @Validate(Role,{message:' please role is either user or admin'})
    public role: string;

}

export default CreateUserDto;
