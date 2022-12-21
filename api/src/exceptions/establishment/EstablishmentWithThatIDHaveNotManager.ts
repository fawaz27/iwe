import { HttpException } from "../HttpException";



class EstablishmentWithThatIDHaveNotManager extends HttpException
{

    constructor(id: number,manager:string)
    {
        super(404, `Establishment with id ${id} have not manager ${manager}`);
    }
}

export default EstablishmentWithThatIDHaveNotManager;
