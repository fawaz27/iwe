import { IsString,IsNotEmpty, IsArray, Validate,} from 'class-validator';
import { Access } from '../utils/validator-access';

class CreateInformationDto{

    @IsNotEmpty({message: ' please the contents is required'})
    @IsString()
    public contents : string;
    
    
    @IsString()
    @Validate(Access,{message:'please access is either ALL-TEACHERS or GROUP-TEACHERS'})
    public access : string;

    @IsArray()
    public destinataires : number[];


}

export default CreateInformationDto;