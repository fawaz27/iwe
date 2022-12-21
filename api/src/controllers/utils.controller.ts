import express from 'express';
import{Request,Response,NextFunction} from 'express';
import authMiddleware from '../middlewares/authMiddleware';
import { UtilsService } from '../services/utils.service';


export class UtilsController{

    public path = '/utils'
    public router =express.Router();
    public utilsService:UtilsService;


    constructor(){      
        this.utilsService = new UtilsService();
        this.initializeRoutes();
    }


    private initializeRoutes()
    {
        this.router
            .all(`${this.path}*`,authMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .get(`${this.path}/infosTeacher`,this.getInfosTeacher)
            .get(`${this.path}/infosManager`,this.getInfosManager)

          
        
    }

    public getInfosTeacher = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{
      
        try {
            const id_teacher = request.query.teacherId;
            const year_academic = request.query.yearAcademic;
            const id_ets = request.query.id_ets;
            const result = await this.utilsService.getUtilsInfosTeacher(Number(id_teacher),Number(id_ets),String(year_academic));
            
            response.status(200).send(result);
        } catch (error) {
            next(error);
        }
    }

    public getInfosManager = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{
      
        try {
            const id_teacher = request.query.teacherId;
            const id_ets = request.query.id_ets;
            const result = await this.utilsService.getUtilsInfosManager(Number(id_teacher),Number(id_ets));
            
            response.status(200).send(result);
        } catch (error) {
            next(error);
        }
    }

}