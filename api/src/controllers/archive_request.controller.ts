import express from 'express';
import{Request,Response,NextFunction} from 'express';
import validationMiddleware from '../middlewares/validationMiddleware';
import authMiddleware from '../middlewares/authMiddleware';
import isAdminMiddleware from '../middlewares/isAdminMiddleware';
import { ArchiveRequestService } from '../services/archive_request.service';
import CreateArchiveRequestDto from '../dto/archive_request.dto';
import RequestWithTeacher from '../interfaces/requestWithTeacher.interface';
import isAdminOrManagerMiddleware from '../middlewares/isAdminOrManagerMiddleware';


export class ArchiveRequestController{

    public path = '/establishments/:id_ets/archives_requests'
    public router =express.Router();
    public archiveRequestService:ArchiveRequestService;

    constructor(){      
        this.archiveRequestService = new ArchiveRequestService();
        this.initializeRoutes();
    }

    private initializeRoutes()
    {

        this.router
            .all(`${this.path}`,authMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .all(`${this.path}`,isAdminOrManagerMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .get(this.path,this.getAllRequests)
            .post(this.path,validationMiddleware(CreateArchiveRequestDto),this.createRequest as unknown as (req:Request,res:Response,net:NextFunction)=>{});

        this.router
            .all(`${this.path}/*`,authMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .all(`${this.path}`,isAdminOrManagerMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .get(`${this.path}/:id`,this.getRequestById)
            .put(`${this.path}/:id`,validationMiddleware(CreateArchiveRequestDto),this.updateRequest)
            .delete(`${this.path}/:id`,this.deleteRequest)
    }

    public getAllRequests = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{
      
        try {
            const id_ets = request.params.id_ets;
            const result = await this.archiveRequestService.getAllRequests(Number(id_ets));
            response.status(200).send(result);
        } catch (error) {
            next(error);
        }
    }

    public createRequest = async (request: RequestWithTeacher, response: express.Response, next: express.NextFunction) => {
        const ArchiveRequestData:CreateArchiveRequestDto =request.body;
        const id_ets = request.params.id_ets;
        const id_teacher = request.user.id;

        try {
            
            const created= await this.archiveRequestService.createRequest(Number(id_ets),Number(id_teacher),ArchiveRequestData);
            response.status(201).send(created);
        } catch (error) {

            next(error);            
        }
    }

    public getRequestById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

        const id_ets = request.params.id_ets;
        const id = request.params.id;
        try {
            const request = await this.archiveRequestService.getRequestById(Number(id_ets),Number(id));
            response.status(200).send(request);
        } catch (error) {
            next(error);
        }

    }

    public updateRequest = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{
    
        const id_ets = request.params.id_ets;
        const id = request.params.id;
        const ArchiveRequestData:CreateArchiveRequestDto = request.body;

        try {
           const result = await this.archiveRequestService.updateRequest(Number(id_ets),Number(id),ArchiveRequestData);
           response.status(200).send(result);        
        } catch (error) {
            next(error);
        }
    }

    public deleteRequest = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{

        const id_ets = request.params.id_ets;
        const id = request.params.id;
        try {
            const result = await this.archiveRequestService.deleteRequest(Number(id_ets),Number(id)) ;
            response.status(200).send(`Archive Request with id ${id} has been deleted`);
            
        } catch (error) {
            next(error);
        }
    }

}