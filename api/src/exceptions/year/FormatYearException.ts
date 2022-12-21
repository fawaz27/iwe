import { HttpException } from "../HttpException";



class FormatYearException extends HttpException
{

    constructor()
    {
        super(400, `Year must be in format [0-*]-[0-*]+1 . For example 2021-2022.`);
    }
}

export default FormatYearException;