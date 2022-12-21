import { HttpException } from "../HttpException";



class NoProgramFoundInEstablishmentForTeacherWithIDException extends HttpException
{

    constructor(id_ets:number,id_teacher:number)
    {
        super(404, `No Program exists in Establishment with id ${id_ets} for the teacher with id ${id_teacher}`);
    }
}

export default NoProgramFoundInEstablishmentForTeacherWithIDException;