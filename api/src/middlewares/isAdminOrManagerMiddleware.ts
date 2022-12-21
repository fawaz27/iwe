import { Response,NextFunction } from "express";
import RequestWithUser from "../interfaces/requestWithTeacher.interface";
import { AppDataSource } from '../database/AppDataSource'
import { Teacher_Ets } from "../models/teacher_ets.entity";
import IsNotAdminAndManager from "../exceptions/NotAdminAndManager";
import { Establishment } from "../models/establishment.entity";
import EstablishmentWithThatIDNotExistsException from "../exceptions/establishment/EstablishmentWithThatIDNotExistsException";

async function isAdminOrManagerMiddleware(request: RequestWithUser, response: Response, next: NextFunction){
    
    if (request.user.role==="admin") {
        next();
        
    }
    else{
       
        const id_ets = Number( request.params.id_ets);

        const estab =  await AppDataSource.getRepository(Establishment)
                    .createQueryBuilder("etablishment")
                    .leftJoinAndSelect("etablishment.year","year")
                    .where("etablishment.id = :id ",{id:id_ets})
                    .getOne();
        
        if (estab) {

            

            const isDirector = await  AppDataSource.getRepository(Teacher_Ets)
                .createQueryBuilder("teacher_ets")
                .where("teacher_ets.teacherId = :teacherId ",{teacherId:request.user.id})
                .andWhere("teacher_ets.establishmentId = :establishmentId",{establishmentId:id_ets})
                .andWhere("teacher_ets.role = :role ",{role:'director'})
                .getOne();

            const isCensor = await  AppDataSource.getRepository(Teacher_Ets)
                    .createQueryBuilder("teacher_ets")
                    .where("teacher_ets.teacherId = :teacherId ",{teacherId:request.user.id})
                    .andWhere("teacher_ets.establishmentId = :establishmentId",{establishmentId:id_ets})
                    .andWhere("teacher_ets.role = :role ",{role:'censor'})
                    .getOne();

            if (isDirector || isCensor) {
                next();
            } else {
                next (new IsNotAdminAndManager(String(request.user.id),String(id_ets)));
            }
        } 
        else{
            next(new EstablishmentWithThatIDNotExistsException(id_ets)) ;
        }

        
        
    }

}

export default isAdminOrManagerMiddleware;