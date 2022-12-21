import { HttpException } from "../HttpException";



class NoScheduleForClassFoundException extends HttpException
{

    constructor(classe:string)
    {
        super(404, `No Schedule  found for the class ${classe}`);
    }
}

export default NoScheduleForClassFoundException