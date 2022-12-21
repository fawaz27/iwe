import express from 'express';
import{Request,Response,NextFunction} from 'express';
import validationMiddleware from '../middlewares/validationMiddleware';
import authMiddleware from '../middlewares/authMiddleware';
import isAdminMiddleware from '../middlewares/isAdminMiddleware';
import { EtablishmentService } from '../services/etablishment.service';
import CreateEstablishmentDto from '../dto/establishment.dto';
import CreateManagerDto from '../dto/manager.dto';
import DeleteRoleManagerDto from '../dto/roleManager.dto';

export class EstablishmentController{

    public path = '/establishments'
    public router =express.Router();
    public etsService:EtablishmentService;

    constructor(){      
        this.etsService = new EtablishmentService();
        this.initializeRoutes();
    }


    private initializeRoutes()
    {
        this.router
            .all(`${this.path}`,authMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .all(`${this.path}`,isAdminMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .get(this.path,this.getAllEstablishments)
            .post(this.path,validationMiddleware(CreateEstablishmentDto),this.createEstablishment);

        this.router
            .all(`${this.path}/*`,authMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .all(`${this.path}`,isAdminMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .get(`${this.path}/:id`,this.getEstablishmentById)
            .put(`${this.path}/:id`,validationMiddleware(CreateEstablishmentDto),this.updateEstablishment)
            .delete(`${this.path}/:id`,this.deleteEstablishment)
            .post(`${this.path}/:id/manager`,validationMiddleware(CreateManagerDto),this.addManagerToEstablishment)
            .delete(`${this.path}/:id/manager`,this.deleteManagerEstablishment);
            


        
        
    }

    public getAllEstablishments = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{
      
        try {
            
            const result = await this.etsService.getAllEtablishment();
            response.status(200).send(result);
        } catch (error) {
            next(error);
        }
    }

    public createEstablishment = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const EstablishmentData:CreateEstablishmentDto =request.body;
        

        try {
            
            const created= await this.etsService.createEtablishment(EstablishmentData);
            response.status(201).send(created);
        } catch (error) {

            next(error);            
        }
    }


    public getEstablishmentById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

        const id = request.params.id;

        try {
            const classe = await this.etsService.getEtablishmentById(Number(id));
            response.status(200).send(classe);
        } catch (error) {
            next(error);
        }

    }

    

    public updateEstablishment = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{
    
        const id = request.params.id;
        const EstablishmentData:CreateEstablishmentDto = request.body;

        try {
           const result = await this.etsService.updateEtablishment(Number(id),EstablishmentData);
           response.status(200).send(result);        
        } catch (error) {
            next(error);
        }
    }


    public deleteEstablishment = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{

        const id = request.params.id;
        try {
            const result = await this.etsService.deleteEtablishment(Number(id)) ;
            response.status(200).send(`Establishment with id ${id} has been deleted`);
            
        } catch (error) {
            next(error);
        }
    }


    public addManagerToEstablishment = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        
        const id = request.params.id;
        const ManagerData:CreateManagerDto =request.body;
        
        try {
            
            const created= await this.etsService.addManagerToEstablishment(Number(id),ManagerData);
            response.status(201).send(created);
        } catch (error) {

            next(error);            
        }
    }


    public deleteManagerEstablishment = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{

        const id = request.params.id;
        const RoleManagerData:DeleteRoleManagerDto =request.body;
        try {
            const result = await this.etsService.deleteManagerToEstablishment(Number(id)) ;
            response.status(200).send(`Manager ${RoleManagerData.roleManager} of Establishment with id ${id} has been deleted`);
            
        } catch (error) {
            next(error);
        }
    }




}