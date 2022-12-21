import { AppDataSource } from '../database/AppDataSource';
import { Session } from '../models/session.entity';
import { Subject } from '../models/subject.entity';
import { Textbook } from '../models/textbook.entity';
import { Class } from '../models/class.entity';
import { Teacher } from '../models/teacher.entity';
import validate_year_academic from '../utils/validator-year_academic';
import FormatYearException from '../exceptions/year/FormatYearException';
import { Year_Academic } from '../models/year_academic.entity';
import TeacherWithThatIDNotExistsException from '../exceptions/teacher/UserWithThatIDNotExistsException';
import { Teacher_Ets } from '../models/teacher_ets.entity';
import { Establishment } from '../models/establishment.entity';
import EstablishmentWithThatIDNotExistsException from '../exceptions/establishment/EstablishmentWithThatIDNotExistsException';
import UserWithThatIdIsNotTeacherInEstablishmentException from '../exceptions/establishment/UserWithThatIdIsNotTeacherInEstablishment';
import NoClassFoundInEstablishmentException from '../exceptions/class/NoClassFoundExceptionInEstablishment';
import TeacherWithIdHasNoSubjectsException from '../exceptions/teacher/TeacherWithIdHasNoSubjectsException';
import billing from '../interfaces/billing.interface';
import UserWithThatIdIsNotManagerInEstablishmentException from '../exceptions/establishment/UserWithThatIdIsNotManagerInEstablishment';
import { Brackets } from 'typeorm';



export class UtilsService{

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

    public async getTimeDoneYearAcademic(sessions:Session[]){

            if (sessions && sessions.length!=0) {
                let total:number = 0;
                sessions.forEach(it=> total += it.duration);
                return total;
            }
            else
                return 0;
    }


    public getTotalToDoTime(subjects:Subject[]){

        let TotalToDoTime:number = 0;


        subjects.forEach((it)=> {
            let minutes = Math.floor(it.quota_hours * 60);
            TotalToDoTime += minutes;
        });
        
        return TotalToDoTime;
    }   

    public async getHourlyAmount(sessions:Session[],subjects:Subject[],){

            let tab: billing[] = [];
            subjects.forEach((it)=>{
                let duration = 0;
                sessions.forEach((el)=>{
                    if(el.subject.subjectId == it.subjectId)
                        duration += el.duration;
                });
                
                tab.push({duration:duration,billing:it.hourly_billing});       

            });

            let result:number = 0;

            tab.forEach((it)=>{
                result += it.billing * (Math.floor(it.duration / 60)+ ((it.duration % 60) / 60 ));
            });

            return result ;

    }
        
    


    public async getUtilsInfosTeacher(id_teacher:number,id_ets:number,year_academic:string){

    
        if (!validate_year_academic(year_academic)) {
            throw new FormatYearException();
        }
        
        
        const teacher = await this.teacherRepository.findOneBy({id:id_teacher});

        if (teacher) {

            const estab =  await this.etsRepository
                .createQueryBuilder("etablishment")
                .leftJoinAndSelect("etablishment.year","year")
                .where("etablishment.id = :id ",{id:id_ets})
                .getOne();
    
            if (estab == null) {
                throw new EstablishmentWithThatIDNotExistsException(id_ets);
            }

            const teacher_estab = await this.teacherEtsRepository
                    .createQueryBuilder("teacher_ets")
                    .leftJoinAndSelect("teacher_ets.establishment","establishment")
                    .leftJoinAndSelect("teacher_ets.teacher","teacher")
                    .where("teacher.id = :id_teacher",{id_teacher:id_teacher})
                    .andWhere("establishment.id = :id_ets",{id_ets:id_ets})
                    .andWhere("teacher_ets.role = :role ",{role:'teacher'})
                    .getOne();
                
            if (teacher_estab) {
                
                const classes = await this.classRepository
                    .createQueryBuilder("class")
                    .leftJoinAndSelect("class.etablishment","etablishment")
                    .where("etablishment.id = :id_ets",{id_ets:id_ets})
                    .getMany();
                
                if (classes==null || classes.length==0) {
                    throw new NoClassFoundInEstablishmentException(estab.name);
                }

                const classeIds = classes.map(it=>it.id);

                // const textbooks = await this.textbookRepository
                //     .createQueryBuilder("textbook")
                //     .leftJoinAndSelect("textbook.classe","class")
                //     .leftJoinAndSelect("textbook.year_academic","year_academic.year")
                //     .where("class.id IN (:...ids)",{ids:classeIds})
                //     .andWhere("year_academic.year = :yearAcademic",{yearAcademic:year_academic})
                //     .getMany();
                
                

                let  subjects= await this.subjectRepository 
                    .createQueryBuilder("subject")
                    .leftJoinAndSelect("subject.teacher","teacher")
                    .leftJoinAndSelect("subject.classe","classe")
                    .where("teacher.id = :id_teacher",{id_teacher:id_teacher})
                    .getMany();
    
                

                subjects = subjects.filter(it=>classeIds.includes(it.classe.id));

                

                if (subjects && subjects.length!=0) {
    
                    const subjectIds = subjects.map(it=>it.subjectId);

                    let sessions = await this.sessionRepository   
                        .createQueryBuilder("session")
                        .leftJoinAndSelect("session.textbook","textbook")
                        .leftJoinAndSelect("session.subject","subject")
                        .getMany();
    
                    sessions = sessions.filter((it)=> {
                        let title = it.textbook.title;
                        let componentTitle = title.split(" - ");
                        let year = componentTitle[2];
                        if (subjectIds.includes(it.subject.subjectId) && year==year_academic) {
                            return it;
                        }               
                    });


                    const TotalToDoTime = this.getTotalToDoTime(subjects);    
                    const TimeDone = await this.getTimeDoneYearAcademic(sessions);
                    const TimeRemaining = TotalToDoTime - TimeDone;
                    const HourlyAmount = await this.getHourlyAmount(sessions,subjects);
                    
                    return {

                        TimeDone : TimeDone ,
                        TimeRemaining : TimeRemaining,
                        HourlyAmount:HourlyAmount
                    };
                } 
                else {
                    throw new TeacherWithIdHasNoSubjectsException(id_teacher);
                }
                
            } 
            else {
               throw new UserWithThatIdIsNotTeacherInEstablishmentException(id_teacher,id_ets); 
            }


        } 

        else{
            throw new TeacherWithThatIDNotExistsException(id_teacher);
        }
    }

    

    public async getUtilsInfosManager(id_teacher:number,id_ets:number){

        const teacher = await this.teacherRepository.findOneBy({id:id_teacher});

        if (teacher) {
            const estab =  await this.etsRepository
                .createQueryBuilder("etablishment")
                .leftJoinAndSelect("etablishment.year","year")
                .where("etablishment.id = :id ",{id:id_ets})
                .getOne();
    
            if (estab == null) {
                throw new EstablishmentWithThatIDNotExistsException(id_ets);
            }

            const teacher_estab = await this.teacherEtsRepository
                    .createQueryBuilder("teacher_ets")
                    .leftJoinAndSelect("teacher_ets.establishment","establishment")
                    .leftJoinAndSelect("teacher_ets.teacher","teacher")
                    .where("teacher.id = :id_teacher",{id_teacher:id_teacher})
                    .andWhere("establishment.id = :id_ets",{id_ets:id_ets})
                    .andWhere("teacher_ets.role != :role ",{role:'teacher'})
                    .getOne();
            
            if (teacher_estab) {

                const number_of_teachers = await this.countTeachers(id_ets);
                const number_of_managers = await this.countManagers(id_ets);
                const number_of_students = await this.countStudents(id_ets);

                return {number_of_teachers,number_of_managers,number_of_students};

            }
            else {
                throw new UserWithThatIdIsNotManagerInEstablishmentException(id_teacher,id_ets); 
            }        
        }

        else{
            throw new TeacherWithThatIDNotExistsException(id_teacher);
        }
    }
    

    public async countTeachers(id_ets:number){

        const teacher_estab = await this.teacherEtsRepository
                    .createQueryBuilder("teacher_ets")
                    .leftJoinAndSelect("teacher_ets.establishment","establishment")
                    .andWhere("establishment.id = :id_ets",{id_ets:id_ets})
                    .andWhere("teacher_ets.role = :role ",{role:'teacher'})
                    .getMany();

        return teacher_estab.length;
    }

    public async countManagers(id_ets:number){

        const teacher_estab = await this.teacherEtsRepository
                    .createQueryBuilder("teacher_ets")
                    .leftJoinAndSelect("teacher_ets.establishment","establishment")
                    .where("establishment.id = :id_ets",{id_ets:id_ets})
                    .andWhere(
                        new Brackets((qb)=>{
                            qb.where("teacher_ets.role = :role ",{role:'director'})
                            .orWhere("teacher_ets.role = :role2 ",{role2:'censor'})
                        })
                    )
                    .getMany();
        
                        
        return teacher_estab.length;
    }

    public async countStudents(id_ets:number){

        const teacher_estab = await this.teacherEtsRepository
                    .createQueryBuilder("teacher_ets")
                    .leftJoinAndSelect("teacher_ets.establishment","establishment")
                    .andWhere("establishment.id = :id_ets",{id_ets:id_ets})
                    .andWhere("teacher_ets.role = :role ",{role:'student'})
                    .getMany();

        return teacher_estab.length;
    }

    



}