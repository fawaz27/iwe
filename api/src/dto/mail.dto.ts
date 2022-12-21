import { IsNotEmpty, IsString } from 'class-validator';


class AddTeacherExistDto 
{

    @IsNotEmpty({message: ' please the email is required'})
    @IsString()
    public email: string;
}

export default AddTeacherExistDto;
