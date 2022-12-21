import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { RoleManager } from '../utils/validator-roleManager';

class CreateManagerDto 
{
    

    @IsNotEmpty({message: ' please the email is required'})
    @IsString()
    public email: string;

}

export default CreateManagerDto;