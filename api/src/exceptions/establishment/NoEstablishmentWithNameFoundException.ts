import { HttpException } from "../HttpException";



class NoEstablishmentWithNameFoundException extends HttpException
{

    constructor(name:string)
    {
        super(404, `No Establishment with name ${name} found`);
    }
}

export default NoEstablishmentWithNameFoundException;