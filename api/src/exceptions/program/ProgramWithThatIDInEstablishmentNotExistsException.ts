import { HttpException } from "../HttpException";



class ProgramWithThatIDNotExistsException extends HttpException
{

    constructor(id: number,id_ets: number)
    {
        super(404, `Program with id ${id} not exists in Establishment with id ${id_ets}`);
    }
}

export default ProgramWithThatIDNotExistsException;
