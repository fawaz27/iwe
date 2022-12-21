import { HttpException } from "../HttpException";



class NoClassFoundInEstablishmentException extends HttpException
{

    constructor(ets:string)
    {
        super(404, `No class exist in establishment ${ets}`);
    }
}

export default NoClassFoundInEstablishmentException;