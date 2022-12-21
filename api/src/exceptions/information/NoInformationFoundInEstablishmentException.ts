import { HttpException } from "../HttpException";



class NoInformationFoundException extends HttpException
{

    constructor(id_ets:number)
    {
        super(404, `No Information exists in Establishment with id ${id_ets}`);
    }
}

export default NoInformationFoundException;