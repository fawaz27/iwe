import { HttpException } from "../HttpException";



class TeacherWithThatEmailNotExistsException extends HttpException
{

    constructor(email: string)
    {
        super(404, `Teacher with email ${email} not exists`);
    }
}

export default TeacherWithThatEmailNotExistsException;
