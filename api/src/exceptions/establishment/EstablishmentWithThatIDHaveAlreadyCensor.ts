import { HttpException } from "../HttpException";



class EstablishmentWithThatIDHaveAlreadyCensor extends HttpException
{

    constructor(id: number)
    {
        super(500, `Establishment with id ${id} have already a censor.`);
    }
}

export default EstablishmentWithThatIDHaveAlreadyCensor;
