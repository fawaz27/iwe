import { HttpException } from "../HttpException";



class EstablishmentWithThatIDHaveAlreadyDirector extends HttpException
{

    constructor(id: number)
    {
        super(500, `Establishment with id ${id} have already a director.`);
    }
}

export default EstablishmentWithThatIDHaveAlreadyDirector;
