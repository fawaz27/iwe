import express from 'express';
import{Request,Response,NextFunction} from 'express';
import { SubjectService } from '../services/subject.service';
import validationMiddleware from '../middlewares/validationMiddleware';
import authMiddleware from '../middlewares/authMiddleware';
import isAdminMiddleware from '../middlewares/isAdminMiddleware';
import CreateSubjectDto from '../dto/subject.dto';


export class SubjectController{

    public path = '/classes/:id_class/subjects'
    public router =express.Router();
    public subjectService:SubjectService;
    

    constructor(){      
        this.subjectService = new SubjectService();
        this.initializeRoutes();
    }
   
    private initializeRoutes()
    {
        this.router
            .all(`${this.path}`,authMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .all(`${this.path}`,isAdminMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .get(this.path,this.getAllSubjects)
            .get('/establishments/:id_ets/subjectsTeacher',this.getAllSubjectsTeacher)
            .post(this.path,this.createSubject);

        this.router
            .all(`${this.path}/*`,authMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .all(`${this.path}`,isAdminMiddleware as unknown as (req:Request,res:Response,net:NextFunction)=>{})
            .get(`${this.path}/:id_subject`,this.getSubjectById)
            .put(`${this.path}/:id_subject`,validationMiddleware(CreateSubjectDto),this.updateSubject)
            .delete(`${this.path}/:id_subject`,this.deleteSubject)


        
        
    }


    public getAllSubjects = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{
      
        const id_class = request.params.id_class;
        try {
            const result = await this.subjectService.getAllSubjects(Number(id_class));
            response.status(200).send(result);
        } catch (error) {
            next(error);
        }
    }


    public createSubject = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id_class = request.params.id_class;
        const id_subjectEts = request.query.subjectId;

        try {
            
            const created= await this.subjectService.createSubjectInClass(Number(id_class),Number(id_subjectEts));
            response.status(201).send(created);
        } catch (error) {

            next(error);            
        }
    }


    public getSubjectById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

        const id_class = request.params.id_class;
        const id_subject = request.params.id_subject;
        try {
            const subject = await this.subjectService.getSubjectById(Number(id_class),Number(id_subject));
            response.status(200).send(subject);
        } catch (error) {
            next(error);
        }

    }

    public updateSubject = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{
    
        const id_class = request.params.id_class;
        const id_subject = request.params.id_subject;
        const SubjectData:CreateSubjectDto = request.body;

        try {
           const result = await this.subjectService.updateSubject(SubjectData,Number(id_class),Number(id_subject));
           response.status(200).send(result);        
        } catch (error) {
            next(error);
        }
    }


    public deleteSubject = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{

        const id_class = request.params.id_class;
        const id_subject = request.params.id_subject;
        try {
            const result = await this.subjectService.deleteSubject(Number(id_class),Number(id_subject)) ;
            response.status(200).send(`Subject with id ${id_subject} has been deleted in Class ${id_class} `)
            
        } catch (error) {
            next(error);
        }
    }

    public getAllSubjectsTeacher = async(request: express.Request, response: express.Response, next: express.NextFunction)=>{
      
        try {
            const id_teacher = request.query.teacherId;
            const id_ets = request.params.id_ets;
            const result = await this.subjectService.getSubjectsTeacher(Number(id_ets),Number(id_teacher));
            response.status(200).send(result);
        } catch (error) {
            next(error);
        }
    }







}