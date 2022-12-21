import { HttpException } from "../HttpException";



class ScheduleAlreadyExistsException extends HttpException
{

    constructor(classname:string,year: string)
    {
        super(400, `Schedule for class  ${classname} already exists in yearAcademic  ${year} `);
    }
}

export default ScheduleAlreadyExistsException;
