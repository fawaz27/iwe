import { IsString, Validate } from 'class-validator';
import { RoleManager } from '../utils/validator-roleManager';


class DeleteRoleManagerDto 
{

    @IsString()
    @Validate(RoleManager,{message:'please roleManager is either director or censor'})
    public roleManager: string;

}

export default DeleteRoleManagerDto;