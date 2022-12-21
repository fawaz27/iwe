import { HttpException } from "../HttpException";



class DestinatairesCanNotBeEmptyException extends HttpException
{

    constructor()
    {
        super(404, `Destinataires can not be empty when access is 'GROUP-TEACHERS' `);
    }
}

export default DestinatairesCanNotBeEmptyException;
