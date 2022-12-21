import {IsString,IsNotEmpty, Matches} from 'class-validator'


class CreateSessionYearDto{


    @IsNotEmpty({message: ' please the date is required'})
    @IsString()
    public date: string;

    @IsNotEmpty({message: ' please the start time is required'})
    @IsString()
    @Matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    public start_time: string;

    @IsNotEmpty({message: ' please the end   time is required'})
    @IsString()
    @Matches(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
    public end_time: string;


    @IsNotEmpty({message: ' please the title is required'})
    @IsString()
    public title: string;

    @IsString()
    public description: string;

    @IsString()
    public annex_document: string;

    @IsString()
    public point_of_presence: string;

    @IsNotEmpty({message: ' please the summary_course is required'})
    @IsString()
    public summary_course: string;

    @IsNotEmpty({message: ' please yearAcademic is required'})
    @IsString()
    public yearAcademic: string;

    

}

export default CreateSessionYearDto;