import { HttpException } from "../HttpException";



class NoSubjectFoundException extends HttpException
{

    constructor(id_ets:number)
    {
        super(404, `No Subject exists in Establishment with id ${id_ets}`);
    }
}

export default NoSubjectFoundException;