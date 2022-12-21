import { IsString,IsNotEmpty,IsNumber, ValidateIf} from 'class-validator';

class CreateSubjectDto{

    @IsNumber()
    public quota_hours:number;

    @IsNumber()
    public hourly_billing: number;

    @IsNumber()
    @ValidateIf((object,value)=>value!==null)
    public id_teacher:number|null;

}

export default CreateSubjectDto;