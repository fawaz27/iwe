import { HttpException } from "../HttpException";



class NoTeacherFoundException extends HttpException
{

    constructor()
    {
        super(404, `No Teachers exist`);
    }
}

export default NoTeacherFoundException;