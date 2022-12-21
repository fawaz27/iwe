import { HttpException } from "../HttpException";



class EstablishmentWithThatNameAndYearAlreadyExistsException extends HttpException
{

    constructor(name: string, year : string,id_teacher:number)
    {
        super(500, `Establishment with name ${name} in year ${year} already exists for teacher with ${id_teacher}`);
    }
}

export default EstablishmentWithThatNameAndYearAlreadyExistsException;
