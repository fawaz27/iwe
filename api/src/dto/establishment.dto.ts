import { IsString,IsNotEmpty, IsNumber} from 'class-validator';

class CreateEstablishmentDto{

    @IsNotEmpty({message: ' please the name is required'})
    @IsString()
    public name : string;
    
    @IsNotEmpty({message: ' please yearAcademic is required'})
    @IsString()
    public yearAcademic: string;

    @IsNotEmpty({message: ' please teacherId is required'})
    @IsNumber()
    public teacherId: number;
    
}

export default CreateEstablishmentDto;