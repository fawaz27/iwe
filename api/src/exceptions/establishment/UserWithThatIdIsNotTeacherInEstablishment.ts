import { HttpException } from "../HttpException";



class UserWithThatIdIsNotTeacherInEstablishmentException extends HttpException
{

    constructor(id_teacher:number,id_ets:number)
    {
        super(404, ` User with that id ${id_teacher} is not teacher in establishment with id ${id_ets}`);
    }
}

export default UserWithThatIdIsNotTeacherInEstablishmentException;