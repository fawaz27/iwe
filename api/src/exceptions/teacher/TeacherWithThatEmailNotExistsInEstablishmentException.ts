import { HttpException } from "../HttpException";



class TeacherWithThatEmailNotExistsInEstablishmentException extends HttpException
{

    constructor(email: string,id_ets:number)
    {
        super(404, `Teacher with email ${email} not exists in establishment with id ${id_ets}`);
    }
}

export default TeacherWithThatEmailNotExistsInEstablishmentException;
