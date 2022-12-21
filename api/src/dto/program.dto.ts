import { IsString,IsNotEmpty, IsArray, Validate,} from 'class-validator';
import { Access } from '../utils/validator-access';

class CreateProgramDto{

    @IsNotEmpty({message: ' please the subject is required'})
    @IsString()
    public subject : string;

    @IsNotEmpty({message: ' please the date is required'})
    @IsString()
    public date : string;

    @IsNotEmpty({message: ' please the classe is required'})
    @IsString()
    public classe : string;
    
    
    @IsString()
    @Validate(Access,{message:'please access is either ALL-TEACHERS or GROUP-TEACHERS'})
    public access : string;

    @IsArray()
    public destinataires : number[];


}

export default CreateProgramDto;