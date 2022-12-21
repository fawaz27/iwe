import { HttpException } from "../HttpException";



class SubjectWithThatNameInEstblishmentAlreadyExistsException extends HttpException
{

    constructor(name: string,etsName:string)
    {
        super(400, `Subject with name ${name} in establishment ${etsName} already exists`);
    }
}

export default SubjectWithThatNameInEstblishmentAlreadyExistsException;
