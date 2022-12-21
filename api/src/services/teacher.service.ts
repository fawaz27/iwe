
import { AppDataSource } from '../database/AppDataSource';
import CreateTeacherDto from '../dto/teacher.dto';
import InternalErrorException from '../exceptions/InternalErrorException';
import UserWithThatIDNotExistsException from '../exceptions/teacher/UserWithThatIDNotExistsException';
import { Teacher } from '../models/teacher.entity'
import { Subject } from '../models/subject.entity';
import { Textbook } from '../models/textbook.entity';
import { Session } from '../models/session.entity';
import { Year_Academic } from '../models/year_academic.entity';
import   bcrypt from 'bcrypt';
import TeacherWithIdHasNoSubjectsException from '../exceptions/teacher/TeacherWithIdHasNoSubjectsException';
import NoTexbookFoundForClassForYearException from '../exceptions/textbook/NoTexbookFoundForClassForYearException';
import YearWithThatNameNotExistsException from '../exceptions/year/YearWithThatNameNotExistsException';
import NoSessionFoundForSubjectInClassForYearException from '../exceptions/session/NoSessionFoundForSubjectInClassForYearException';
import CreateSessionDto from '../dto/session.dto';
import SessionWithThatIDNotExistsInTextbookException from '../exceptions/session/SessionWithThatIDNotExistsInTextbookException';
import TeacherWithIdHasNoSubjectsWithIDException from '../exceptions/teacher/TeacherWithIdHasNoSubjectsWithIDException';
import validate_year_academic from '../utils/validator-year_academic';
import FormatYearException from '../exceptions/year/FormatYearException';
import CreateSessionYearDto from '../dto/sessionyear.dto';
import YearIsStringException from '../exceptions/year/YearIsStringException';
import TeacherWithThatEmailAlreadyExistsException from '../exceptions/teacher/TeacherWithThatEmailAlreadyExistsException';
import NoTeacherFoundException from '../exceptions/teacher/NoTeacherFoundException';
import TeacherWithThatEmailNotExistsException from '../exceptions/teacher/TeacherWithThatEmailNotExistsException';
import TeacherWithThatIDNotExistsException from '../exceptions/teacher/UserWithThatIDNotExistsException';
import { Teacher_Ets } from '../models/teacher_ets.entity';
import { Establishment } from '../models/establishment.entity';
import EstablishmentWithThatIDNotExistsException from '../exceptions/establishment/EstablishmentWithThatIDNotExistsException';
import { In } from 'typeorm';
import NoTeacherFoundInEstablishmentException from '../exceptions/teacher/NoTeacherFoundInEstablishmentException';
import TeacherWithThatEmailNotExistsInEstablishmentException from '../exceptions/teacher/TeacherWithThatEmailNotExistsInEstablishmentException';
import TeacherWithThatIDNotExistsInEstablishmentException from '../exceptions/teacher/TeacherWithThatIDNotExistsInEstablishmentException';
import TeacherWithThatIdIsAlreadyManagerInEstablishmentException from '../exceptions/teacher/TeacherWithThatIdIsAlreadyManagerInEstablishmentException';
import AdminWithThatEmailNotExistsException from '../exceptions/AdminWithThatEmailNotExistsException';

export class TeacherService{

    public teacherRepository;
    public subjectRepository;
    public textbookRepository;
    public sessionRepository;
    public yearRepository;
    public etsRepository;
    public teacherEtsRepository;
    
    
    constructor(){
        
        this.teacherRepository=AppDataSource.getRepository(Teacher);
        this.subjectRepository=AppDataSource.getRepository(Subject);
        this.textbookRepository=AppDataSource.getRepository(Textbook);
        this.sessionRepository=AppDataSource.getRepository(Session);
        this.yearRepository=AppDataSource.getRepository(Year_Academic);
        this.etsRepository=AppDataSource.getRepository(Establishment);
        this.teacherEtsRepository=AppDataSource.getRepository(Teacher_Ets)
        
    }

    public async createTeacher(id_ets:number,teacher:CreateTeacherDto){

        const estab =  await this.etsRepository
                    .createQueryBuilder("etablishment")
                    .leftJoinAndSelect("etablishment.year","year")
                    .where("etablishment.id = :id ",{id:id_ets})
                    .getOne();
        
        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }
        
        
        const result = await this.teacherRepository.findOne( {where:{email:teacher.email}}  );

        if (result) {
            throw new TeacherWithThatEmailAlreadyExistsException(teacher.email);

        } 
        else {

            const hashedPassword = await bcrypt.hash(teacher.hashPassword, 10);

            teacher.hashPassword=hashedPassword;
            
            const newTeacher = this.teacherRepository.create(teacher);
            const created = await this.teacherRepository.save(newTeacher); 

            // console.log(created);
            if (created) {
            
                const teacher_ets = new Teacher_Ets();
                teacher_ets.teacherId=created.id;
                teacher_ets.establishmentId=id_ets;
                teacher_ets.role="teacher";

                const result = await this.teacherEtsRepository.save(teacher_ets);

                if (result) {
                    return [created,result]
                }
                else{
                    throw new InternalErrorException();
                }
 
            } else {
                throw new InternalErrorException();
                
            }
        }

    }

    public async addExistTeacher(id_ets:number,email:string){

        const teacher = await this.teacherRepository.findOne( {where:{email:email}}  );

        if (teacher) {

            const estab =  await this.etsRepository
                    .createQueryBuilder("etablishment")
                    .leftJoinAndSelect("etablishment.year","year")
                    .where("etablishment.id = :id ",{id:id_ets})
                    .getOne();
        
            if (estab == null) {
                throw new EstablishmentWithThatIDNotExistsException(id_ets);
            }

            // const isAlreadyManager = await this.teacherEtsRepository
            //     .createQueryBuilder("teacher_ets")
            //     .where("teacher_ets.establishmentId = :establishmentId",{establishmentId:estab.id})
            //     .andWhere("teacher_ets.teacherId = :teacherId",{teacherId:teacher.id})
            //     .getOne();

            // if (isAlreadyManager && isAlreadyManager.role!="teacher") {
            //     throw new TeacherWithThatIdIsAlreadyManagerInEstablishmentException(teacher.id,estab.id);
            // }

            const teacher_ets = new Teacher_Ets();
            teacher_ets.teacherId=teacher.id;
            teacher_ets.establishmentId=estab.id;
            teacher_ets.role="teacher";

            const result = await this.teacherEtsRepository.save(teacher_ets);
            if (result) {
                return result;
            } 
            else {
                throw new InternalErrorException();    
            }

        } 
        else {
            throw new TeacherWithThatEmailNotExistsException(email);
        }
    }

    public async getAllTeachersInEstablishment(id_ets:number){

        const estab =  await this.etsRepository
                .createQueryBuilder("etablishment")
                .leftJoinAndSelect("etablishment.year","year")
                .where("etablishment.id = :id ",{id:id_ets})
                .getOne();

        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }

        const teachers = await this.teacherEtsRepository
                .createQueryBuilder("teacher_ets")
                .leftJoinAndSelect("teacher_ets.teacher","teacher")
                .where("teacher_ets.establishmentId = :establishmentId",{establishmentId:id_ets})
                .andWhere("teacher_ets.role = :role",{role:"teacher"})
                .getMany();
        
        if (teachers && teachers.length!=0)  {
            return teachers;
        } 
        else {
            throw  new NoTeacherFoundInEstablishmentException(id_ets);
            
        }

    }

    public async getAllTeachersAndManagersInEstablishment(id_ets:number){

        const estab =  await this.etsRepository
                .createQueryBuilder("etablishment")
                .leftJoinAndSelect("etablishment.year","year")
                .where("etablishment.id = :id ",{id:id_ets})
                .getOne();

        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }

        const teachers = await this.teacherEtsRepository
                .createQueryBuilder("teacher_ets")
                .leftJoinAndSelect("teacher_ets.teacher","teacher")
                .where("teacher_ets.establishmentId = :establishmentId",{establishmentId:id_ets})
                .getMany();
        
        if (teachers && teachers.length!=0)  {
            return teachers;
        } 
        else {
            throw  new NoTeacherFoundInEstablishmentException(id_ets);
            
        }

    }

    public async getAdminByEmail(email:string){

        const teacher = await this.teacherRepository.findOneBy({email:`${email},`,role:'admin'});
        if(teacher)
            return teacher;
        else
            throw new AdminWithThatEmailNotExistsException(email);
    }

    // A vérifier
    public async getTeacherByEmail(id_ets:number,email:string){

        const estab =  await this.etsRepository
                    .createQueryBuilder("etablishment")
                    .leftJoinAndSelect("etablishment.year","year")
                    .where("etablishment.id = :id ",{id:id_ets})
                    .getOne();
        
        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }
        
        const teacher = await this.teacherRepository.findOneBy({email:`${email}`});
        const teacher_ets = await this.teacherEtsRepository
                .createQueryBuilder("teacher_ets")
                .leftJoinAndSelect("teacher_ets.teacher","teacher")
                .where("teacher_ets.establishmentId = :establishmentId",{establishmentId:id_ets})
                .andWhere("teacher_ets.teacherId = :teacherId",{teacherId:teacher?.id})
                .getOne();
        
        if (teacher && teacher_ets) {
            
            return teacher;
        } 
        else {
            throw new TeacherWithThatEmailNotExistsInEstablishmentException(email,id_ets);
        }

    }

    // A vérifier
    public async GetTeacherById(id_ets:number,id:number){

        const estab =  await this.etsRepository
                    .createQueryBuilder("etablishment")
                    .leftJoinAndSelect("etablishment.year","year")
                    .where("etablishment.id = :id ",{id:id_ets})
                    .getOne();
        
        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }

        const teacher = await this.teacherRepository.findOneBy({id:id});
        
        const teacher_ets = await this.teacherEtsRepository
                .createQueryBuilder("teacher_ets")
                .leftJoinAndSelect("teacher_ets.teacher","teacher")
                .where("teacher_ets.establishmentId = :establishmentId",{establishmentId:id_ets})
                .andWhere("teacher_ets.teacherId = :teacherId",{teacherId:teacher?.id})
                .getOne();
        
        if (teacher && teacher_ets) {
            
            return teacher;
        } 
        else {
            throw new TeacherWithThatIDNotExistsInEstablishmentException(id,id_ets);
        }


    }

    // A vérifier
    public async UpdateTeacher(id_ets:number,teacher:CreateTeacherDto,id:number){

        const estab =  await this.etsRepository
                    .createQueryBuilder("etablishment")
                    .leftJoinAndSelect("etablishment.year","year")
                    .where("etablishment.id = :id ",{id:id_ets})
                    .getOne();
        
        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }

        const teacherUpdate = await this.teacherRepository.findOneBy({id:id});

        const teacher_ets = await this.teacherEtsRepository
                .createQueryBuilder("teacher_ets")
                .leftJoinAndSelect("teacher_ets.teacher","teacher")
                .where("teacher_ets.establishmentId = :establishmentId",{establishmentId:id_ets})
                .andWhere("teacher_ets.teacherId = :teacherId",{teacherId:teacherUpdate?.id})
                .getOne();

        if (teacherUpdate && teacher_ets) {
    
            const alreadyExistEmail = await this.teacherRepository.findOneBy({email:teacher.email});
            if (alreadyExistEmail) {    
                throw new TeacherWithThatEmailAlreadyExistsException(teacher.email);
            } 
            else {
                const isAlreadyManager = await this.teacherEtsRepository
                    .createQueryBuilder("teacher_ets")
                    .where("teacher_ets.establishmentId = :establishmentId",{establishmentId:id_ets})
                    .andWhere("teacher_ets.teacherId = :teacherId",{teacherId:id})
                    .getOne();

                if (isAlreadyManager && isAlreadyManager.role!="teacher") {
                    throw new TeacherWithThatIdIsAlreadyManagerInEstablishmentException(id,id_ets);
                }
                
                const updated = await this.teacherRepository.update(id,teacher);
                if (updated) {
                    
                    return updated;
                }
                else{
                    throw new InternalErrorException();
                }
            }

        } 
        else {
            throw new TeacherWithThatIDNotExistsInEstablishmentException(id,id_ets);
        }

    }

    // A vérifier
    public async dropTeacherInEstablishment (id_ets:number,id:number){

        const teacher = await this.teacherRepository.findOneBy({id:id});

        const teacher_ets = await this.teacherEtsRepository
                .createQueryBuilder("teacher_ets")
                .leftJoinAndSelect("teacher_ets.teacher","teacher")
                .where("teacher_ets.establishmentId = :establishmentId",{establishmentId:id_ets})
                .andWhere("teacher_ets.teacherId = :teacherId",{teacherId:teacher?.id})
                .getOne();


        if (teacher && teacher_ets) {

            const result = await this.teacherEtsRepository
                        .createQueryBuilder()
                        .delete()
                        .where("establishmentId = :establishmentId",{establishmentId:id_ets})
                        .andWhere("teacherId = :teacherId ",{teacherId:id})
                        .andWhere("role = :role ",{role:"teacher"})
                        .execute();
                        
                if (result) {
                    //console.log(result);
                    
                    return result;
                } 
                else {
                    throw new InternalErrorException()
                }

        } 
        else {
            throw new TeacherWithThatIDNotExistsInEstablishmentException(id,id_ets);
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
            //console.log(subject);
                

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
            throw new UserWithThatIDNotExistsException(id);
        }



    }


    public async addSession(id:number,id_subject:number,year_academic:string,session:CreateSessionYearDto){

        const user = await this.teacherRepository.findOneBy({id:id});
        
        if (user) {


            
            const subject= await this.subjectRepository 
                .createQueryBuilder("subject")
                .leftJoinAndSelect("subject.teacher","teacher")
                .leftJoinAndSelect("subject.classe","classe")
                .where("teacher.id = :id_teacher",{id_teacher:id})
                .andWhere("subject.subjectId = :id_subject",{id_subject:id_subject})
                .getOne();

            if (subject) {
                
                
                
                if(!validate_year_academic(year_academic)){
                    throw new FormatYearException();
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
                        const newSession = new Session();
                        newSession.title=session.title;
                        newSession.date=session.date;
                        newSession.annex_document=session.annex_document;
                        newSession.description=session.description;
                        newSession.duration=this.convertInTime(session.end_time)-this.convertInTime(session.start_time);
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
                    else{
                        throw new NoTexbookFoundForClassForYearException(subject.classe.name,year_academic);
                    }
                        
                } 
                else {
                    throw  new YearWithThatNameNotExistsException(year_academic);
                }      
            } 
            else {
                throw new TeacherWithIdHasNoSubjectsException(id)
            }
        } 
        else {
            throw new UserWithThatIDNotExistsException(id);
        }

        
    }


    public async updateSession(id:number,id_subject:number,year_academic:string,id_session:number,session:CreateSessionDto){

        const user = await this.teacherRepository.findOneBy({id:id});
        
        if (user) {


            
            const subject= await this.subjectRepository 
                .createQueryBuilder("subject")
                .leftJoinAndSelect("subject.teacher","teacher")
                .leftJoinAndSelect("subject.classe","classe")
                .where("teacher.id = :id_teacher",{id_teacher:id})
                .andWhere("subject.subjectId = :id_subject",{id_subject:id_subject})
                .getOne();

            if (subject) {

                if(!validate_year_academic(year_academic)){
                    throw new FormatYearException();
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

                        const sessionUpdate = await this.sessionRepository
                            .createQueryBuilder("session")
                            .leftJoinAndSelect("session.subject","subject")
                            .leftJoinAndSelect("session.textbook","textbook")
                            .where("session.id = :id_session",{id_session:id_session})
                            .andWhere("textbook.id = :id_textbook",{id_textbook:textbook.id})
                            .andWhere("subject.subjectId = :id_subject",{id_subject:subject.subjectId})
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
                    else{
                        throw new NoTexbookFoundForClassForYearException(subject.classe.name,year_academic);
                    }
                        
                } 
                else {
                    throw  new YearWithThatNameNotExistsException(year_academic);
                }      
            } 
            else {
                throw new TeacherWithIdHasNoSubjectsException(id)
            }
        } 
        else {
            throw new UserWithThatIDNotExistsException(id);
        }

    }


    public async deleteSession(id:number,id_subject:number,year_academic:any,id_session:number){

        const user = await this.teacherRepository.findOneBy({id:id});
        
        if (user) {


            
            const subject= await this.subjectRepository 
                .createQueryBuilder("subject")
                .leftJoinAndSelect("subject.teacher","teacher")
                .leftJoinAndSelect("subject.classe","classe")
                .where("teacher.id = :id_teacher",{id_teacher:id})
                .andWhere("subject.subjectId = :id_subject",{id_subject:id_subject})
                .getOne();

            if (subject) {

                if (typeof(year_academic)!="string") {
                    throw new YearIsStringException()
                } 
                else if(!validate_year_academic(year_academic)){
                    throw new FormatYearException();
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

                        const session = await this.sessionRepository
                            .createQueryBuilder("session")
                            .leftJoinAndSelect("session.subject","subject")
                            .leftJoinAndSelect("session.textbook","textbook")
                            .where("session.id = :id_session",{id_session:id_session})
                            .andWhere("textbook.id = :id_textbook",{id_textbook:textbook.id})
                            .andWhere("subject.subjectId = :id_subject",{id_subject:subject.subjectId})
                            .getOne();

                        if (session) {
                            const result = await this.sessionRepository.delete(id_session);
                            return id_session;           
                        } 
                        else {
                            throw new SessionWithThatIDNotExistsInTextbookException(id_session,textbook.title);
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
                throw new TeacherWithIdHasNoSubjectsException(id)
            }
        } 
        else {
            throw new UserWithThatIDNotExistsException(id);
        }
    }



    public convertInTime(timeInHour:string){

        var timeParts = timeInHour.split(":");
        return Number(timeParts[0]) * 60 + Number(timeParts[1]);
    }



    




}