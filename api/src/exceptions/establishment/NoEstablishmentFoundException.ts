import { HttpException } from "../HttpException";



class NoEstablishmentFoundException extends HttpException
{

    constructor()
    {
        super(404, `No Establishment found`);
    }
}

export default NoEstablishmentFoundException;