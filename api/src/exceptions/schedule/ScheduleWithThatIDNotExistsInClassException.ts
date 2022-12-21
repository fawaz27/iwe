import { HttpException } from "../HttpException";



class ScheduleWithThatIDNotExistsInClassException extends HttpException
{

    constructor(id: number, classe:string )
    {
        super(404, `Schedule with id ${id} not exists in class ${classe} or there is no Schedule with id ${id}`);
    }
}

export default ScheduleWithThatIDNotExistsInClassException;
