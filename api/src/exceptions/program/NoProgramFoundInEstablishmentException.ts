import { HttpException } from "../HttpException";



class NoProgramFoundException extends HttpException
{

    constructor(id_ets:number)
    {
        super(404, `No Program exists in Establishment with id ${id_ets}`);
    }
}

export default NoProgramFoundException;