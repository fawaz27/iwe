import { HttpException } from "../HttpException";



class SubjectWithThatIDInClassForEstablishmentNotExistsException extends HttpException
{

    constructor(id: number,id_class: number)
    {
        super(404, `Subject with id ${id} not exists in Establishment for class with id ${id_class}`);
    }
}

export default SubjectWithThatIDInClassForEstablishmentNotExistsException;
