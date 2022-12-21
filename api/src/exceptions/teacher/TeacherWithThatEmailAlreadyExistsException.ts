import { HttpException } from "../HttpException";



class TeacherWithThatEmailAlreadyExistsException extends HttpException
{

    constructor(email: string)
    {
        super(400, `Teacher with email ${email} already exists`);
    }
}

export default TeacherWithThatEmailAlreadyExistsException;
