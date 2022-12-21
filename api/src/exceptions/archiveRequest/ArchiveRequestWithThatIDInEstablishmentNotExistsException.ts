import { HttpException } from "../HttpException";



class ArchiveRequestWithThatIDNotExistsException extends HttpException
{

    constructor(id: number,id_ets: number)
    {
        super(404, `Archive Request with id ${id} not exists in Establishment with id ${id_ets}`);
    }
}

export default ArchiveRequestWithThatIDNotExistsException;
