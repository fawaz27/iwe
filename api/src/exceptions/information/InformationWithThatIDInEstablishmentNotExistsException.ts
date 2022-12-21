import { HttpException } from "../HttpException";



class InformationWithThatIDNotExistsException extends HttpException
{

    constructor(id: number,id_ets: number)
    {
        super(404, `Information with id ${id} not exists in Establishment with id ${id_ets}`);
    }
}

export default InformationWithThatIDNotExistsException;
