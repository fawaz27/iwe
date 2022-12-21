import express from 'express';
import{Request,Response,NextFunction} from 'express';
import validationMiddleware from '../middlewares/validationMiddleware';
import authMiddleware from '../middlewares/authMiddleware';
import RequestWithTeacher from '../interfaces/requestWithTeacher.interface';
import isAdminOrManagerMiddleware from '../middlewares/isAdminOrManagerMiddleware';
import { InformationService } from '../services/information.service';
import CreateInformationDto from '../dto/information.dto';


export class InformationController{

    public path = '/establishments/:id_ets/informations'
    public router =express.Router();
    public informationService:InformationService;

    constructor(){      
        this.informationService = new InformationService();
        this.initializeRoutes();
    }

    private initializeRoutes()
    {

        this.router
            .all(`${this.path}`,authMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .all(`${this.path}`,isAdminOrManagerMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .get(this.path,this.getAllInformations)
            .post(this.path,validationMiddleware(CreateInformationDto),this.createInformation as unknown as (req:Request,res:Response,net:NextFunction)=>{});

        this.router
            .all(`${this.path}/*`,authMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .all(`${this.path}`,isAdminOrManagerMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .get(`${this.path}/:id`,this.getInformationById)
            .put(`${this.path}/:id`,validationMiddleware(CreateInformationDto),this.updateInformation)
            .delete(`${this.path}/:id`,this.deleteInformation)
    }

    public getAllInformations = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{
      
        try {
            const id_teacher = request.query.teacherId;
            const id_ets = request.params.id_ets;
            const result = await this.informationService.getAllInformations(Number(id_ets),Number(id_teacher));
            response.status(200).send(result);
        } catch (error) {
            next(error);
        }
    }

    public createInformation = async (request: RequestWithTeacher, response: express.Response, next: express.NextFunction) => {
        const InformationData:CreateInformationDto =request.body;
        const id_ets = request.params.id_ets;
        const id_teacher = request.user.id;

        try {
            
            const created= await this.informationService.createInformation(Number(id_ets),Number(id_teacher),InformationData);
            response.status(201).send(created);
        } catch (error) {

            next(error);            
        }
    }

    public getInformationById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

        const id_ets = request.params.id_ets;
        const id = request.params.id;
        try {
            const request = await this.informationService.getInformationById(Number(id_ets),Number(id));
            response.status(200).send(request);
        } catch (error) {
            next(error);
        }

    }

    public updateInformation = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{
    
        const id_ets = request.params.id_ets;
        const id = request.params.id;
        const InformationData:CreateInformationDto = request.body;

        try {
           const result = await this.informationService.updateInformation(Number(id_ets),Number(id),InformationData);
           response.status(200).send(result);        
        } catch (error) {
            next(error);
        }
    }

    public deleteInformation = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{

        const id_ets = request.params.id_ets;
        const id = request.params.id;
        try {
            const result = await this.informationService.deleteInformation(Number(id_ets),Number(id)) ;
            response.status(200).send(`Information with id ${id} has been deleted`);
            
        } catch (error) {
            next(error);
        }
    }

   

}