import { HttpException } from "./HttpException";



class AdminWithThatEmailNotExistsException extends HttpException
{

    constructor(email: string)
    {
        super(404, `Admin with email ${email} not exists`);
    }
}

export default AdminWithThatEmailNotExistsException;
