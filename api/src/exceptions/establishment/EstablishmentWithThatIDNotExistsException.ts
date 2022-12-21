import { HttpException } from "../HttpException";



class EstablishmentWithThatIDNotExistsException extends HttpException
{

    constructor(id: number)
    {
        super(404, `Establishment with id ${id} not exists`);
    }
}

export default EstablishmentWithThatIDNotExistsException;
