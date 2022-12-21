import { HttpException } from "../HttpException";



class TeacherWithThatIdIsAlreadyManagerInEstablishmentException extends HttpException
{

    constructor(id_teacher: number,id_ets: number)
    {
        super(400, `Teacher with id ${id_teacher} is already manager in Establishment with id ${id_ets}`);
    }
}

export default TeacherWithThatIdIsAlreadyManagerInEstablishmentException;
