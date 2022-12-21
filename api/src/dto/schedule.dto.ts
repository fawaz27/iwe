import { Type } from 'class-transformer';
import {IsString,IsNotEmpty, ValidateNested} from 'class-validator'
import ScheduleIntefaceDto from './scheduleInterface.dto';

class CreateScheduleDto
{

    // @IsNotEmpty({message: ' please the schedule is required'})
    // @IsSchedule({message: ' schedule must be a schedule'})
    @Type(()=>ScheduleIntefaceDto)
    @ValidateNested()
    public schedule: ScheduleIntefaceDto;

    @IsNotEmpty({message: ' please the yearAcademic is required'})
    @IsString()
    public yearAcademic: string;

    

}

export default CreateScheduleDto;