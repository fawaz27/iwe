import { HttpException } from "../HttpException";



class NoTeacherFoundInEstablishmentException extends HttpException
{

    constructor(id:number)
    {
        super(404, `No Teachers exist in establishment with id ${id}`);
    }
}

export default NoTeacherFoundInEstablishmentException;