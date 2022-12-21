import { HttpException } from "../HttpException";



class TeacherWithThatIDNotExistsInEstablishmentException extends HttpException
{

    constructor(id: number,id_ets:number)
    {
        super(404, `Teacher with id ${id} not exists in etablishment with ${id_ets} or not exists `);
    }
}

export default TeacherWithThatIDNotExistsInEstablishmentException;
