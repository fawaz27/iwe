import { IsString,IsNotEmpty, IsArray,} from 'class-validator';

class CreateArchiveRequestDto{

    @IsNotEmpty({message: ' please the contents is required'})
    @IsString()
    public contents: string;

    @IsNotEmpty({message: ' please the state is required'})
    @IsString()
    public state : string;

    @IsNotEmpty({message: ' please the type_archivage is required'})
    @IsString()
    public type_archivage: string;
    
    @IsNotEmpty({message: ' please the firstname is required'})
    @IsString()
    public firstname : string;

    @IsNotEmpty({message: ' please the lastname is required'})
    @IsString()
    public lastname : string;

    @IsNotEmpty({message: ' please the email is required'})
    @IsString()
    public email : string;

    @IsNotEmpty({message: ' please the date_request is required'})
    @IsString()
    public date_request : string;


}

export default CreateArchiveRequestDto;