import { IsString,IsNotEmpty} from 'class-validator';

class CreateSubjectEtsDto{

    @IsNotEmpty({message: ' please the name is required'})
    @IsString()
    public name: string;
}

export default CreateSubjectEtsDto;