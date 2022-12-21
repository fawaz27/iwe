import { HttpException } from "../HttpException";



class NoEstablishmentFoundForTeacherException extends HttpException
{

    constructor(id_teacher:number)
    {
        super(404, `No Establishment found for teacher with id ${id_teacher}`);
    }
}

export default NoEstablishmentFoundForTeacherException;