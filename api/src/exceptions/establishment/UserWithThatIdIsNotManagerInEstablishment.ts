import { HttpException } from "../HttpException";



class UserWithThatIdIsNotManagerInEstablishmentException extends HttpException
{

    constructor(id_teacher:number,id_ets:number)
    {
        super(404, ` User with that id ${id_teacher} is not manager in establishment with id ${id_ets}`);
    }
}

export default UserWithThatIdIsNotManagerInEstablishmentException;