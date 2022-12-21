import { HttpException } from "../HttpException";



class EstablishmentWithThatIDNotExistsForYearException extends HttpException
{

    constructor(id: number,year:string)
    {
        super(404, `Establishment with id ${id} not exists for year academic ${year}`);
    }
}

export default EstablishmentWithThatIDNotExistsForYearException;
