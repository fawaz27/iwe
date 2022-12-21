import { HttpException } from "./HttpException";

class OnlyAdminCanCreateAnotherAdminException extends HttpException{
    constructor(){
        super(403, `Only admin can create another admin`);
    }
}

export default OnlyAdminCanCreateAnotherAdminException;
