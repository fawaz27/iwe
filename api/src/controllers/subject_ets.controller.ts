import express from 'express';
import{Request,Response,NextFunction} from 'express';
import validationMiddleware from '../middlewares/validationMiddleware';
import authMiddleware from '../middlewares/authMiddleware';
import RequestWithTeacher from '../interfaces/requestWithTeacher.interface';
import isAdminOrManagerMiddleware from '../middlewares/isAdminOrManagerMiddleware';
import { SubjectsEtsService } from '../services/subject_ets.service';
import CreateSubjectEtsDto from '../dto/subject_ets.dto';


export class SubjectsEtsController{

    public path = '/establishments/:id_ets/subjects'
    public router = express.Router();
    public subjectEtsService:SubjectsEtsService;

    constructor(){      
        this.subjectEtsService = new SubjectsEtsService();
        this.initializeRoutes();
    }

    private initializeRoutes()
    {

        this.router
            .all(`${this.path}`,authMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .all(`${this.path}`,isAdminOrManagerMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .get(this.path,this.getAllSubjectsEstablishment)
            .post(this.path,validationMiddleware(CreateSubjectEtsDto),this.createSubjectEstablishment as unknown as (req:Request,res:Response,net:NextFunction)=>{});

        this.router
            .all(`${this.path}/*`,authMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .all(`${this.path}`,isAdminOrManagerMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .get(`${this.path}/:id`,this.getSubjectById)
            .put(`${this.path}/:id`,validationMiddleware(CreateSubjectEtsDto),this.updateSubject)
            .delete(`${this.path}/:id`,this.deleteSubject)
    }

    public getAllSubjectsEstablishment = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{
      
        try {
            
            const id_ets = request.params.id_ets;
            const result = await this.subjectEtsService.getAllSubjectsEstablishment(Number(id_ets));
            response.status(200).send(result);
        } catch (error) {
            next(error);
        }
    }

    public createSubjectEstablishment = async (request: RequestWithTeacher, response: express.Response, next: express.NextFunction) => {
        const SubjectData:CreateSubjectEtsDto =request.body;
        const id_ets = request.params.id_ets;
        

        try {
            
            const created= await this.subjectEtsService.createSubjectEstablishment(Number(id_ets),SubjectData);
            response.status(201).send(created);
        } catch (error) {

            next(error);            
        }
    }

    public getSubjectById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

        const id_ets = request.params.id_ets;
        const id = request.params.id;
        try {
            const request = await this.subjectEtsService.getSubjectById(Number(id_ets),Number(id));
            response.status(200).send(request);
        } catch (error) {
            next(error);
        }

    }

    public updateSubject = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{
    
        const id_ets = request.params.id_ets;
        const id = request.params.id;
        const SubjectData:CreateSubjectEtsDto =request.body;

        try {
           const result = await this.subjectEtsService.updateSubject(Number(id_ets),Number(id),SubjectData);
           response.status(200).send(result);        
        } catch (error) {
            next(error);
        }
    }

    public deleteSubject = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{

        const id_ets = request.params.id_ets;
        const id = request.params.id;
        try {
            const result = await this.subjectEtsService.deleteSubject(Number(id_ets),Number(id)) ;
            response.status(200).send(`Subject with id ${id} has been deleted in Esatblishment with ${id_ets}`);
            
        } catch (error) {
            next(error);
        }
    }

    

}