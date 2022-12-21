import { HttpException } from "../HttpException";



class FormatDateException extends HttpException
{

    constructor()
    {
        super(400, `Date follows mm/dd/yy or yy-mm-dd  format . For example 03/22/2021 , 2021-03-22."`);
    }
}

export default FormatDateException;