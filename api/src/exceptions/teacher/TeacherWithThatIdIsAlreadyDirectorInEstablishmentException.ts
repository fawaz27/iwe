import { HttpException } from "../HttpException";



class TeacherWithThatIdIsAlreadyDirectorInEstablishmentException extends HttpException
{

    constructor(id_teacher: number,id_ets: number)
    {
        super(400, `Teacher with id ${id_teacher} is already director in Establishment with id ${id_ets}`);
    }
}

export default TeacherWithThatIdIsAlreadyDirectorInEstablishmentException;
