import { Response,NextFunction } from "express";
import RequestWithUser from "../interfaces/requestWithTeacher.interface";
import OnlyAdminCanCreateAnotherAdminException from "../exceptions/OnlyAdminCanCreateAnotherAdmin";

async function OnlyAdminCanCreateAnotherAdminMiddleware(request: RequestWithUser, response: Response, next: NextFunction){
    
    if (request.user.role!="admin" && request.body.role==="admin") {
        next (new OnlyAdminCanCreateAnotherAdminException()); 
    }
    else{   
        next ();         
    }

}

export default OnlyAdminCanCreateAnotherAdminMiddleware;