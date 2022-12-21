import express from 'express';
import{Request,Response,NextFunction} from 'express';
import {TeacherService} from '../services/teacher.service'
import validationMiddleware from '../middlewares/validationMiddleware';
import CreateTeacherDto from '../dto/teacher.dto';
import authMiddleware from '../middlewares/authMiddleware';
import RequestWithTeacher from '../interfaces/requestWithTeacher.interface';
import CreateSessionYearDto from '../dto/sessionyear.dto';
import isAdminOrManagerMiddleware from '../middlewares/isAdminOrManagerMiddleware';
import OnlyAdminCanCreateAnotherAdminMiddleware from '../middlewares/onlyAdminCanCreateAnotherAdminMiddleware';
import AddTeacherExistDto from '../dto/mail.dto';
export class TeacherController{

    public path = '/establishments/:id_ets/teachers'
    public router =express.Router();
    public teacherService:TeacherService;

    constructor(){      
        this.teacherService = new TeacherService();
        this.initializeRoutes();
    }

    private initializeRoutes()
    {
        this.router
            .all(`${this.path}`,authMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .all(`${this.path}`,isAdminOrManagerMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .get(this.path,this.getAllTeachers)
            .post(this.path,validationMiddleware(CreateTeacherDto),OnlyAdminCanCreateAnotherAdminMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{}, this.createTeacher)
            .post(
                this.path+'Exists',
                authMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{},
                isAdminOrManagerMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{},
                validationMiddleware(AddTeacherExistDto), 
                this.addTeacherExist
                );

        this.router
            .all(`${this.path}/:id`,authMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .all(`${this.path}/:id`,isAdminOrManagerMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .get(`${this.path}/:id`,this.getTeacherById)  
            .put(`${this.path}/:id`,validationMiddleware(CreateTeacherDto),OnlyAdminCanCreateAnotherAdminMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{},this.updateTeacher)
            .delete(`${this.path}/:id`,this.dropTeacher)
            
            

        this.router
            .all(`/mysubjects*`,authMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .get(`/mysubjects/:id_subject/sessions`,this.getSessionSubjects as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .post(`/mysubjects/:id_subject/sessions`,validationMiddleware(CreateSessionYearDto),this.addSession as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .put(`/mysubjects/:id_subject/sessions/:id_session`,validationMiddleware(CreateSessionYearDto),this.updateSession as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .delete(`/mysubjects/:id_subject/sessions/:id_session`,this.deleteSession as unknown as (req:Request,res:Response,net:NextFunction)=>{})

            


        
        
    }

    public getAllTeachers = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{
      
        try {

            const id_ets = request.params.id_ets;
            const result = await this.teacherService.getAllTeachersInEstablishment(Number(id_ets));
            response.status(200).send(result);
        } catch (error) {
            next(error);
        }
    }
    public createTeacher = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const TeacherData:CreateTeacherDto =request.body;

        try {
            
            const id_ets = request.params.id_ets;
            const created= await this.teacherService.createTeacher(Number(id_ets),TeacherData);
            response.status(201).send(created);
        } catch (error) {

            next(error);            
        }
    }

    public addTeacherExist = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const TeacherData:AddTeacherExistDto =request.body;

        try {
            
            const id_ets = request.params.id_ets;
            const created= await this.teacherService.addExistTeacher(Number(id_ets),TeacherData.email);
            response.status(201).send(created);
        } catch (error) {

            next(error);            
        }
    }

    public getTeacherById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

        const id_ets = request.params.id_ets;
        const id = request.params.id;
        try {
            const user = await this.teacherService.GetTeacherById(Number(id_ets),Number(id));
            response.status(200).send(user);
        } catch (error) {
            next(error);
        }

    }

    public GetTeacherByEmail = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

        const id_ets = request.params.id_ets;
        const email = request.params.email;
        try {
            const user = await this.teacherService.getTeacherByEmail(Number(id_ets),email);
            response.status(200).send(user);
        } catch (error) {
            next(error);
        }

    }

    public updateTeacher = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{
    
        const id_ets = request.params.id_ets;
        const id = request.params.id;
        const TeacherData:CreateTeacherDto = request.body;

        try {
           const result = await this.teacherService.UpdateTeacher(Number(id_ets),TeacherData,Number(id));
           response.status(200).send(result);        
        } catch (error) {
            next(error);
        }
    }

    public dropTeacher = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{

        const id_ets = request.params.id_ets;
        const id = request.params.id;
        try {
            const result = await this.teacherService.dropTeacherInEstablishment(Number(id_ets),Number(id)) ;
            response.status(200).send(`Teachers with id ${id} has been deleted`)
            
        } catch (error) {
            next(error);
        }
    }

   

    public getSessionSubjects = async (request: RequestWithTeacher, response: express.Response, next: express.NextFunction) => {

        const id = request.user.id;
        const id_subject = request.params.id_subject;
        const yearData=request.query.yearAcademic;
        try {

            const result = await this.teacherService.getSessionsTeacher(Number(id),Number(id_subject),yearData) ;
            response.status(200).send(result)
            
        } catch (error) {
            next(error);
        }

    }

    public addSession = async (request: RequestWithTeacher, response: express.Response, next: express.NextFunction) => {
        const Session:CreateSessionYearDto =request.body;
        const id = request.user.id;
        const id_subject = request.params.id_subject;
        const year_academic=Session.yearAcademic;

        try {
            
            const created= await this.teacherService.addSession(Number(id),Number(id_subject),year_academic,Session);
            response.status(201).send(created);
        } catch (error) {

            next(error);            
        }
    }


    public updateSession = async(request: RequestWithTeacher, response: express.Response, next: express.NextFunction)=>{
    
        const Session:CreateSessionYearDto=request.body;
        const id = request.user.id;
        const id_session = request.params.id_session;
        const id_subject = request.params.id_subject;
        const year_academic=Session.yearAcademic;

        try {
           const result = await this.teacherService.updateSession(Number(id),Number(id_subject),year_academic,Number(id_session),Session);
           response.status(200).send(result);        
        } catch (error) {
            next(error);
        }
    }


    public deleteSession = async(request: RequestWithTeacher, response: express.Response, next: express.NextFunction)=>{

        const id_session = request.params.id_session;
        const id = request.user.id;
        const id_subject = request.params.id_subject;
        const year_academic=request.query.yearAcademic;
        try {
            const result = await this.teacherService.deleteSession(Number(id),Number(id_subject),year_academic,Number(id_session));
            response.status(200).send(`Sessions with id ${id_session} has been deleted`);
            
        } catch (error) {
            next(error);
        }
    }






}