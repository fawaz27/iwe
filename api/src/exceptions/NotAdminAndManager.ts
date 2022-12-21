import { HttpException } from "./HttpException";

class IsNotAdminAndManager extends HttpException{
    constructor(id : string,id_ets:string){
        super(403, `User with id ${id} is not admin or manager of etablishment with id ${id_ets}`);
    }
}

export default IsNotAdminAndManager;
