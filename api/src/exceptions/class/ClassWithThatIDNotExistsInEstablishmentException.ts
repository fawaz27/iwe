import { HttpException } from "../HttpException";



class ClassWithThatIDNotExistsInEstablishmentException extends HttpException
{

    constructor(id: number,ets:string)
    {
        super(404, `Class with id ${id} not exists in establishment ${ets}`);
    }
}

export default ClassWithThatIDNotExistsInEstablishmentException;
