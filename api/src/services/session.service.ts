import { AppDataSource } from '../database/AppDataSource';
import { Session } from '../models/session.entity';
import { Subject } from '../models/subject.entity';
import { Textbook } from '../models/textbook.entity';
import { Class } from '../models/class.entity';
import CreateSessionDto from '../dto/session.dto';
import NoSessionFoundForSubjectException from '../exceptions/session/NoSessionFoundForSubjectException';
import NoSessionFoundInTextbookException from '../exceptions/session/NoSessionFoundInTextbookException';
import InternalErrorException from '../exceptions/InternalErrorException';
import SubjectWithThatIDNotExistsInClassException from '../exceptions/subject/SubjectWithThatIDNotExistsInClassException';
import SessionWithThatIDNotExistsInTextbookException from '../exceptions/session/SessionWithThatIDNotExistsInTextbookException';
import TextbookWithThatIDNotExistsException from '../exceptions/textbook/TextbookWithThatIDNotExistsException';
import { Teacher } from '../models/teacher.entity';
import YearIsStringException from '../exceptions/year/YearIsStringException';
import validate_year_academic from '../utils/validator-year_academic';
import FormatYearException from '../exceptions/year/FormatYearException';
import { Year_Academic } from '../models/year_academic.entity';
import NoSessionFoundForSubjectInClassForYearException from '../exceptions/session/NoSessionFoundForSubjectInClassForYearException';
import NoTexbookFoundForClassForYearException from '../exceptions/textbook/NoTexbookFoundForClassForYearException';
import YearWithThatNameNotExistsException from '../exceptions/year/YearWithThatNameNotExistsException';
import TeacherWithIdHasNoSubjectsWithIDException from '../exceptions/teacher/TeacherWithIdHasNoSubjectsWithIDException';
import TeacherWithThatIDNotExistsException from '../exceptions/teacher/UserWithThatIDNotExistsException';
import { Teacher_Ets } from '../models/teacher_ets.entity';
import { Establishment } from '../models/establishment.entity';



export class SessionService{

    public sessionRepository;
    public subjectRepository;
    public textbookRepository;
    public classRepository;
    public teacherRepository;
    public yearRepository;
    public teacherEtsRepository;
    public etsRepository;
    constructor(){
        
        this.sessionRepository=AppDataSource.getRepository(Session);
        this.subjectRepository=AppDataSource.getRepository(Subject);
        this.textbookRepository=AppDataSource.getRepository(Textbook);
        this.classRepository=AppDataSource.getRepository(Class);
        this.teacherRepository=AppDataSource.getRepository(Teacher);
        this.yearRepository=AppDataSource.getRepository(Year_Academic);
        this.teacherEtsRepository=AppDataSource.getRepository(Teacher_Ets);
        this.etsRepository=AppDataSource.getRepository(Establishment);
        
    }

    public async getAllSessionsSubject(id_textbook:number,id_subject:number){

        
            const textbook = await this.textbookRepository
                .createQueryBuilder("textbook")
                .leftJoinAndSelect("textbook.classe","class")
                .where("textbook.id = :id_textbook",{id_textbook:id_textbook})
                .getOne();
            if (textbook) {

                const subject = await AppDataSource.getRepository(Subject)
                        .createQueryBuilder("subject")
                        .leftJoinAndSelect("subject.classe","class")
                        .where("subject.subjectId = :id_subject",{id_subject:id_subject})
                        .andWhere("class.id = :id_class",{id_class:textbook.classe.id})
                        .getOne();

                if (subject) {

                    const sessions = await this.sessionRepository   
                            .createQueryBuilder("session")
                            .leftJoinAndSelect("session.subject","subject")
                            .leftJoinAndSelect("session.textbook","textbook")
                            .where("subject.subjectId = :id_subject",{id_subject:subject.subjectId})
                            .andWhere("textbook.id = :id_textbook",{id_textbook:textbook.id})
                            .getMany();

                    if (sessions && sessions.length!=0) {
                        return sessions;
                    
                    } 
                    else {
                       
                        throw new NoSessionFoundForSubjectException(subject.name,textbook.classe.name);

                        
                    }


                    
                } 
                else {
                    throw new SubjectWithThatIDNotExistsInClassException(id_subject,textbook.classe.name);
                }
                
            } 
            else {
                throw new TextbookWithThatIDNotExistsException(id_textbook);
            }
            
         
        

        
    
        
    }

    public async getAllSessions(id_textbook:number){


        
            
            const textbook = await this.textbookRepository
                .createQueryBuilder("textbook")
                .leftJoinAndSelect("textbook.classe","class")
                .where("textbook.id = :id_textbook",{id_textbook:id_textbook})
                .getOne();

            if (textbook) {


                const sessions = await this.sessionRepository   
                        .createQueryBuilder("session")
                        .leftJoinAndSelect("session.subject","subject")
                        .leftJoinAndSelect("session.textbook","textbook")
                        .where("textbook.id = :id_textbook",{id_textbook:textbook.id})
                        .getMany();

                if (sessions && sessions.length!=0) {
                    return sessions;
                
                } 
                else {
                    
                    throw new NoSessionFoundInTextbookException(textbook.title,textbook.classe.name);

                    
                }
                
            } 
            else {
                throw new TextbookWithThatIDNotExistsException(id_textbook);
            }
            
        
       

    }


    public async createSession(id_textbook:number,id_subject:number,session:CreateSessionDto){

        
            
            const textbook = await this.textbookRepository
                .createQueryBuilder("textbook")
                .leftJoinAndSelect("textbook.classe","class")
                .where("textbook.id = :id_textbook",{id_textbook:id_textbook})
                .getOne();
            if (textbook) {

                const subject = await AppDataSource.getRepository(Subject)
                        .createQueryBuilder("subject")
                        .leftJoinAndSelect("subject.classe","class")
                        .where("subject.subjectId = :id_subject",{id_subject:id_subject})
                        .andWhere("class.id = :id_class",{id_class:textbook.classe.id})
                        .getOne();

                if (subject) {
                    
                    const newSession = new Session();
                    newSession.title=session.title;
                    newSession.date=session.date;
                    newSession.annex_document=session.annex_document;
                    newSession.description=session.description;
                    newSession.duration = this.convertInTime(session.end_time)-this.convertInTime(session.start_time) ;
                    newSession.summary_course=session.summary_course;
                    newSession.point_of_presence=session.point_of_presence;
                    newSession.start_time=session.start_time;
                    newSession.end_time=session.end_time;
                    newSession.subject=subject;
                    newSession.textbook=textbook;
                    const created = await this.sessionRepository.save(newSession);

                    if (created) {
                        return created;
                        
                    } 
                    else {
                        throw new InternalErrorException();
                    }

                } 
                else {
                    throw new SubjectWithThatIDNotExistsInClassException(id_subject,textbook.classe.name);
                }
                
            } 
            else {
                throw new TextbookWithThatIDNotExistsException(id_textbook);
            }
            
        



    }

    public async getSessionById(id_textbook:number,id_session:number){

        
            
            const textbook = await this.textbookRepository
                    .createQueryBuilder("textbook")
                    .leftJoinAndSelect("textbook.classe","class")
                    .where("textbook.id = :id_textbook",{id_textbook:id_textbook})
                    .getOne();

            if (textbook) {
                

                const session = await this.sessionRepository
                        .createQueryBuilder("session")
                        .leftJoinAndSelect("session.subject","subject")
                        .leftJoinAndSelect("session.textbook","textbook")
                        .where("session.id = :id_session",{id_session:id_session})
                        .andWhere("textbook.id = :id_textbook",{id_textbook:textbook.id})
                        .getOne();

                if (session) {
                    return session;
                } 
                else {
                    throw new SessionWithThatIDNotExistsInTextbookException(id_session,textbook.title);
                }

                

            } 
            else {
                throw new TextbookWithThatIDNotExistsException(id_textbook);
            }
                


    }


    public async updateSession(id_textbook:number,id_session:number,session:CreateSessionDto){
    

              
        
            
            const textbook = await this.textbookRepository
                    .createQueryBuilder("textbook")
                    .leftJoinAndSelect("textbook.classe","class")
                    .where("textbook.id = :id_textbook",{id_textbook:id_textbook})
                    .getOne();

            if (textbook) {
                

                const sessionUpdate = await this.sessionRepository
                        .createQueryBuilder("session")
                        .leftJoinAndSelect("session.subject","subject")
                        .leftJoinAndSelect("session.textbook","textbook")
                        .where("session.id = :id_session",{id_session:id_session})
                        .andWhere("textbook.id = :id_textbook",{id_textbook:textbook.id})
                        .getOne();

                if (sessionUpdate) {
                    
                    sessionUpdate.title=session.title;
                    sessionUpdate.date=session.date;
                    sessionUpdate.annex_document=session.annex_document;
                    sessionUpdate.description=session.description;
                    sessionUpdate.duration=this.convertInTime(session.end_time)-this.convertInTime(session.start_time);
                    sessionUpdate.summary_course=session.summary_course;
                    sessionUpdate.point_of_presence=session.point_of_presence;
                    sessionUpdate.start_time=session.start_time;
                    sessionUpdate.end_time=session.end_time;

                    const result = await this.sessionRepository.save(sessionUpdate);

                    if (result) {
                        return result;
                    } 
                    else {
                        throw new InternalErrorException();
                    }
                    

                } 
                else {
                    throw new SessionWithThatIDNotExistsInTextbookException(id_session,textbook.title);
                }


            } 
            else {
                throw new TextbookWithThatIDNotExistsException(id_textbook);
            }
                
       

    }

    public async deleteSession(id_textbook:number,id_session:number){


       
            const textbook = await this.textbookRepository
                    .createQueryBuilder("textbook")
                    .leftJoinAndSelect("textbook.classe","class")
                    .where("textbook.id = :id_textbook",{id_textbook:id_textbook})
                    .getOne();

            if (textbook) {
                

                const session = await this.sessionRepository
                        .createQueryBuilder("session")
                        .leftJoinAndSelect("session.subject","subject")
                        .leftJoinAndSelect("session.textbook","textbook")
                        .where("session.id = :id_session",{id_session:id_session})
                        .andWhere("textbook.id = :id_textbook",{id_textbook:textbook.id})
                        .getOne();

                if (session) {
                    
                    const result = await this.sessionRepository.delete(id_session);
                    return id_session;

                } 
                else {
                    throw new SessionWithThatIDNotExistsInTextbookException(id_session,textbook.title);
                }

                    

            } 
            else {
                throw new TextbookWithThatIDNotExistsException(id_textbook);
            }
                        
        

    
    }


    public async getSessionsTeacher(id:number,id_subject:number,year_academic:any){

        const user = await this.teacherRepository.findOneBy({id:id});
        
        if (user) {


            
            const subject= await this.subjectRepository 
                .createQueryBuilder("subject")
                .leftJoinAndSelect("subject.teacher","teacher")
                .leftJoinAndSelect("subject.classe","classe")
                .where("teacher.id = :id_teacher",{id_teacher:id})
                .andWhere("subject.subjectId = :id_subject",{id_subject:id_subject})
                .getOne();
                console.log(subject);
                

            if (subject) {

                // if(year_academic==undefined){
                //     let year_now = (new Date()).getFullYear();
                //     year_academic=year_now-1+'-'+year_now;
                // }

                if (typeof(year_academic)!="string") {
                    throw new YearIsStringException()
                }                
                else if(!validate_year_academic(year_academic)){
                    throw  new FormatYearException();
                }              

                const year = await this.yearRepository.findOne({  where:{year:`${year_academic}`}});

                if (year) {

                    const textbook = await this.textbookRepository
                        .createQueryBuilder("textbook")
                        .leftJoinAndSelect("textbook.classe","class")
                        .leftJoinAndSelect("textbook.year_academic","year")
                        .where("year.year = :year_academic",{year_academic:year_academic})
                        .andWhere("class.id = :id_class",{id_class:subject.classe.id})
                        .getOne();

                    if (textbook) {

                        const sessions = await this.sessionRepository
                            .createQueryBuilder("session")
                            .leftJoinAndSelect("session.subject","subject")
                            .leftJoinAndSelect("session.textbook","textbook")
                            .where("subject.subjectId = :id_subject",{id_subject:subject.subjectId})
                            .andWhere("textbook.id = :id_textbook",{id_textbook:textbook.id})
                            .getMany();

                        if (sessions && sessions.length!=0) {
                            return sessions;
                        } 
                        else {
                            throw new NoSessionFoundForSubjectInClassForYearException(subject.name,subject.classe.name,year_academic);
                        }                    
                    } 
                    else{
                        throw new NoTexbookFoundForClassForYearException(subject.classe.name,year_academic);
                    }
                        
                } 
                else {
                    throw  new YearWithThatNameNotExistsException(year_academic);
                }      
            } 
            else {
                throw new TeacherWithIdHasNoSubjectsWithIDException(id,id_subject);
            }
        } 
        else {
            throw new TeacherWithThatIDNotExistsException(id);
        }



    }

    public convertInTime(timeInHour:string){

        var timeParts = timeInHour.split(":");
        return Number(timeParts[0]) * 60 + Number(timeParts[1]);
    }
  



}