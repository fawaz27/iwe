import { Response,NextFunction } from "express";
import { AppDataSource } from '../database/AppDataSource'
import YearWithThatNameNotExistsException from "../exceptions/year/YearWithThatNameNotExistsException";
import RequestWithTeacher from "../interfaces/requestWithTeacher.interface";
import { Establishment } from "../models/establishment.entity";
import { Year_Academic } from "../models/year_academic.entity";


async function validateSubscriptionMiddleware(request: RequestWithTeacher, response: Response, next: NextFunction){


    const id_ets = Number( request.params.id_ets);

    const year_now =  process.env.YEAR;

    const year = await AppDataSource.getRepository(Year_Academic).findOne({  where:{year:`${year_now}`}}); 

    if (year==null) {
        throw  new YearWithThatNameNotExistsException(year_now as string);
    }

    const estab =  await AppDataSource.getRepository(Establishment)
                    .createQueryBuilder("etablishment")
                    .leftJoinAndSelect("etablishment.year","year")
                    .where("etablishment.id = :id ",{id:id_ets})
                    .andWhere("year.id = :id_year",{id_year:year.id})
                    .getOne();

    
}    