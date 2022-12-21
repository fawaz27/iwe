import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import HourlyDto from "./hourlyInterface.dto";

class ScheduleIntefaceDto {
    
    @Type(()=>HourlyDto)
    public Monday:HourlyDto[];

    @Type(()=>HourlyDto)
    public Tuesday:HourlyDto[];

    @Type(()=>HourlyDto)
    public Wednesday:HourlyDto[];

    @Type(()=>HourlyDto)
    public Thursday:HourlyDto[];

    @Type(()=>HourlyDto)
    public Friday:HourlyDto[];

    @Type(()=>HourlyDto)
    public Saturday:HourlyDto[];

    @ValidateNested()
    public Sunday:HourlyDto[];

}

export default ScheduleIntefaceDto;