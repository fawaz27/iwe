import express from 'express';
import{Request,Response,NextFunction} from 'express';
import validationMiddleware from '../middlewares/validationMiddleware';
import authMiddleware from '../middlewares/authMiddleware';
import isAdminMiddleware from '../middlewares/isAdminMiddleware';
import { ScheduleService } from '../services/schedule.service';
import CreateScheduleDto from '../dto/schedule.dto';


export class ScheduleController{

    public path = '/classes/:id_class/schedules'
    public router =express.Router();
    public ScheduleService:ScheduleService;
    

    constructor(){      
        this.ScheduleService = new ScheduleService();
        this.initializeRoutes();
    }

    private initializeRoutes()
    {
        this.router
            .all(`${this.path}`,authMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .all(`${this.path}`,isAdminMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .put(`${this.path}/:id_schedule`,validationMiddleware(CreateScheduleDto),this.updateSchedule)
            .post(this.path,validationMiddleware(CreateScheduleDto),this.createSchedule)
            .delete(`${this.path}/:id_schedule`,this.deleteSchedule);

        this.router
            .all(`${this.path}/*`,authMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .get(this.path,this.getAllSchedules)
            .get(`${this.path}Teacher`,this.getScheduletTeacher)
            .get(`${this.path}/:id_schedule`,this.getScheduleById)   
        
    }


    public getAllSchedules = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{
      
        const id_class = request.params.id_class;
        try {
            const result = await this.ScheduleService.getAllSchedules(Number(id_class));
            response.status(200).send(result);
        } catch (error) {
            next(error);
        }
    }


    public createSchedule = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id_class = request.params.id_class;
        const ScheduleData:CreateScheduleDto =request.body;

        try {
            
            const created= await this.ScheduleService.createSchedule(Number(id_class),ScheduleData);
            response.status(201).send(created);
        } catch (error) {

            next(error);            
        }
    }


    public getScheduleById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

        const id_class = request.params.id_class;
        const id_schedule = request.params.id_schedule;
        try {
            const schedule = await this.ScheduleService.getScheduleById(Number(id_class),Number(id_schedule));
            response.status(200).send(schedule);
        } catch (error) {
            next(error);
        }

    }

    public updateSchedule = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{
    
        const id_class = request.params.id_class;
        const id_schedule = request.params.id_schedule;
        const scheduleData:CreateScheduleDto = request.body;

        try {
           const result = await this.ScheduleService.updateSchedule(scheduleData,Number(id_class),Number(id_schedule));
           response.status(200).send(result);        
        } catch (error) {
            next(error);
        }
    }


    public deleteSchedule = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{

        const id_class = request.params.id_class;
        const id_schedule = request.params.id_schedule;
        try {
            const result = await this.ScheduleService.deleteSchedule(Number(id_class),Number(id_schedule)) ;
            response.status(200).send(`Schedule with id ${result} has been deleted`)
            
        } catch (error) {
            next(error);
        }
    }

    public getScheduletTeacher = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

        const id_class = request.params.id_class;
        const id_teacher = request.query.teacherId;
        const yearAcademic = request.query.yearAcademic;

        try {
            const schedule = await this.ScheduleService.getScheduleTeacher(Number(id_class),Number(id_teacher),String(yearAcademic));
            response.status(200).send(schedule);
        } catch (error) {
            next(error);
        }

    }






}