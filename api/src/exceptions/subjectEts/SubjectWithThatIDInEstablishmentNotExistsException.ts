import { HttpException } from "../HttpException";



class SubjectWithThatIDNotExistsInEstablishmentException extends HttpException
{

    constructor(id: number,id_ets: number)
    {
        super(404, `Subject with id ${id} not exists in Establishment with id ${id_ets}`);
    }
}

export default SubjectWithThatIDNotExistsInEstablishmentException;
