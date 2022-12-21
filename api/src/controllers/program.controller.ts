import express from 'express';
import{Request,Response,NextFunction} from 'express';
import validationMiddleware from '../middlewares/validationMiddleware';
import authMiddleware from '../middlewares/authMiddleware';
import RequestWithTeacher from '../interfaces/requestWithTeacher.interface';
import isAdminOrManagerMiddleware from '../middlewares/isAdminOrManagerMiddleware';
import { ProgramService } from '../services/program.service';
import CreateProgramDto from '../dto/program.dto';


export class ProgramController{

    public path = '/establishments/:id_ets/programs'
    public router =express.Router();
    public programService:ProgramService;

    constructor(){      
        this.programService = new ProgramService();
        this.initializeRoutes();
    }

    private initializeRoutes()
    {

        this.router
            .all(`${this.path}`,authMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .all(`${this.path}`,isAdminOrManagerMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .get(this.path,this.getAllPrograms)
            .post(this.path,validationMiddleware(CreateProgramDto),this.createProgram as unknown as (req:Request,res:Response,net:NextFunction)=>{});

        this.router
            .all(`${this.path}/*`,authMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .all(`${this.path}`,isAdminOrManagerMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .get(`${this.path}/:id`,this.getProgramById)
            .put(`${this.path}/:id`,validationMiddleware(CreateProgramDto),this.updateProgram)
            .delete(`${this.path}/:id`,this.deleteProgram)
    }

    public getAllPrograms = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{
      
        try {
            const id_teacher = request.query.teacherId;
            const id_ets = request.params.id_ets;
            const result = await this.programService.getAllPrograms(Number(id_ets),Number(id_teacher));
            response.status(200).send(result);
        } catch (error) {
            next(error);
        }
    }

    public createProgram = async (request: RequestWithTeacher, response: express.Response, next: express.NextFunction) => {
        const ProgramData:CreateProgramDto =request.body;
        const id_ets = request.params.id_ets;
        const id_teacher = request.user.id;

        try {
            
            const created= await this.programService.createProgram(Number(id_ets),Number(id_teacher),ProgramData);
            response.status(201).send(created);
        } catch (error) {

            next(error);            
        }
    }

    public getProgramById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

        const id_ets = request.params.id_ets;
        const id = request.params.id;
        try {
            const request = await this.programService.getProgramById(Number(id_ets),Number(id));
            response.status(200).send(request);
        } catch (error) {
            next(error);
        }

    }

    public updateProgram = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{
    
        const id_ets = request.params.id_ets;
        const id = request.params.id;
        const ProgramData:CreateProgramDto = request.body;

        try {
           const result = await this.programService.updateProgram(Number(id_ets),Number(id),ProgramData);
           response.status(200).send(result);        
        } catch (error) {
            next(error);
        }
    }

    public deleteProgram = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{

        const id_ets = request.params.id_ets;
        const id = request.params.id;
        try {
            const result = await this.programService.deleteProgram(Number(id_ets),Number(id)) ;
            response.status(200).send(`Program with id ${id} has been deleted`);
            
        } catch (error) {
            next(error);
        }
    }

    

}