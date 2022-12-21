import { HttpException } from "../HttpException";



class ClassWithThatNameInEstablishmentAlreadyExistsException extends HttpException
{

    constructor(name: string,ets:string)
    {
        super(400, `Class with name ${name}  already exists in establishment ${ets}`);
    }
}

export default ClassWithThatNameInEstablishmentAlreadyExistsException;
