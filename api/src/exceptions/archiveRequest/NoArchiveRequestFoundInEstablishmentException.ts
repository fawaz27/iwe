import { HttpException } from "../HttpException";



class NoArchiveRequestFoundException extends HttpException
{

    constructor(id_ets:number)
    {
        super(404, `No Archive Request exists in Establishment with id ${id_ets}`);
    }
}

export default NoArchiveRequestFoundException;