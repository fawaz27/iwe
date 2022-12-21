import { HttpException } from "../HttpException";



class ClassWithThatNameNotExistsException extends HttpException
{

    constructor(name: string)
    {
        super(404, `Class with name ${name} not exists`);
    }
}

export default ClassWithThatNameNotExistsException;
