import { AppDataSource } from '../database/AppDataSource';
import { Class } from '../models/class.entity';
import { Schedule} from '../models/schedule.entity';
import InternalErrorException from '../exceptions/InternalErrorException';
import ClassWithThatIDNotExistsException from '../exceptions/class/ClassWithThatIDNotExistsException';
import { Year_Academic } from '../models/year_academic.entity';
import YearWithThatNameNotExistsException from '../exceptions/year/YearWithThatNameNotExistsException';
import validate_year_academic from '../utils/validator-year_academic';
import FormatYearException from '../exceptions/year/FormatYearException';
import CreateScheduleDto from '../dto/schedule.dto';
import NoScheduleForClassFoundException from '../exceptions/schedule/NoScheduleForClassFoundException';
import ScheduleAlreadyExistsException from '../exceptions/schedule/ScheduleAlreadyExistsException';
import ScheduleWithThatIDNotExistsInClassException from '../exceptions/schedule/ScheduleWithThatIDNotExistsInClassException';
import ScheduleWithThatIDNotExistsInClassForYearException from '../exceptions/schedule/ScheduleWithThatIDNotExistsInClassExceptionForYear';
import { Teacher } from '../models/teacher.entity';
import TeacherWithThatIDNotExistsException from '../exceptions/teacher/UserWithThatIDNotExistsException';
import { Subject } from '../models/subject.entity';
import ScheduleInteface from '../interfaces/schedule.Interface';
import ClassWithIDHaveNotScheduleForYearException from '../exceptions/schedule/ClassWithIDHaveNotScheduleForYearException';


export class ScheduleService{

    public classRepository;
    public scheduleRepository;
    public yearRepository;
    public teacherRepository;
    public subjectRepository;
    constructor(){
        
        this.classRepository=AppDataSource.getRepository(Class);
        this.scheduleRepository=AppDataSource.getRepository(Schedule);
        this.yearRepository=AppDataSource.getRepository(Year_Academic);
        this.teacherRepository=AppDataSource.getRepository(Teacher);
        this.subjectRepository=AppDataSource.getRepository(Subject);
        
    }


    public async getAllSchedules(id_class:number){

        const classe = await this.classRepository.findOneBy({id:id_class});

        if (classe) {
            const schedules = await this.scheduleRepository 
                .createQueryBuilder("schedule")
                .leftJoinAndSelect("schedule.classe","class")
                .leftJoinAndSelect("schedule.year","year")
                .where("class.id = :id_class",{id_class:classe.id})
                .getMany();
        
            if (schedules && schedules.length!=0) {
                return schedules;
            } 
            else {
                throw new NoScheduleForClassFoundException(classe.name);
            }
        } else {
            throw new ClassWithThatIDNotExistsException(id_class);
        }

        
    
        
    }

    public async createSchedule(id_class:number,schedule:CreateScheduleDto){

            
            const classe = await this.classRepository.findOneBy({id:id_class});

            if (classe) {

                if (!validate_year_academic(schedule.yearAcademic)) {
                    throw new FormatYearException();
                } 

                const year = await this.yearRepository.findOne({  where:{year:`${schedule.yearAcademic}`}});

                if (year) {

                    const isAlreadyExist =  await this.scheduleRepository
                        .createQueryBuilder("schedule")
                        .leftJoinAndSelect("schedule.classe","class")
                        .leftJoinAndSelect("schedule.year","year")
                        .where("class.id = :id",{id:classe.id})
                        .andWhere("year.year = :yearAcademic",{yearAcademic:schedule.yearAcademic})
                        .getOne();
        
                    if (isAlreadyExist) {
                        throw new ScheduleAlreadyExistsException(classe.name,year.year);
                    }  
                    const newschedule = new Schedule();
                    newschedule.schedule=schedule.schedule;
                    newschedule.classe=classe;
                    newschedule.year=year;
                    const created = await this.scheduleRepository.save(newschedule);

                    // console.log(created);
                    if (created) 
                        return created;
                    else
                        throw  new InternalErrorException()                           
                } 
                else {
                    throw  new YearWithThatNameNotExistsException(schedule.yearAcademic);
                }                  
            } 
            else {
                throw new ClassWithThatIDNotExistsException(id_class);
            }
    }




    public async getScheduleById(id_class:number,id_schedule:number){
        
        const classe =await this.classRepository.findOneBy({id:id_class});

        if (classe) {

            const schedule= await this.scheduleRepository 
                .createQueryBuilder("schedule")
                .leftJoinAndSelect("schedule.classe","class")
                .leftJoinAndSelect("schedule.year","year")
                .where("schedule.id = :id_schedule",{id_schedule:id_schedule})
                .andWhere("class.id = :id_class",{id_class:classe.id})
                .getOne();
        
            if (schedule) {
                return schedule;
            } 
            else {
                throw new ScheduleWithThatIDNotExistsInClassException(id_schedule,classe.name);
            }
        } 
        else {
            throw new ClassWithThatIDNotExistsException(id_class);
        }
        

    }



    public async updateSchedule(schedule:CreateScheduleDto,id_class:number,id_schedule:number){
    
        const classe =await this.classRepository.findOneBy({id:id_class});

        if (classe) {
            
            if (!validate_year_academic(schedule.yearAcademic)) {
                throw new FormatYearException();
            }

            const year = await this.yearRepository.findOne({  where:{year:`${schedule.yearAcademic}`}});

            if (year) {

                const scheduleUpdate= await this.scheduleRepository 
                    .createQueryBuilder("schedule")
                    .leftJoinAndSelect("schedule.classe","class")
                    .leftJoinAndSelect("schedule.year","year")
                    .where("schedule.id = :id_schedule",{id_schedule:id_schedule})
                    .andWhere("class.id = :id_class",{id_class:classe.id})
                    .andWhere("year.year = :yearAcademic",{yearAcademic:schedule.yearAcademic})
                    .getOne();



                if (scheduleUpdate) {

                    
                    scheduleUpdate.schedule=schedule.schedule;
                    
                    const result = await this.scheduleRepository.save(scheduleUpdate);

                    if (result) {
                        return result;
                    } 
                    else {
                        throw new InternalErrorException();
                    }
                    
                } 
                else {
                    throw new ScheduleWithThatIDNotExistsInClassForYearException(id_schedule,classe.name,year.year);
                }


            }
            else {
                throw  new YearWithThatNameNotExistsException(schedule.yearAcademic);
            }  

        } 
        else{
            throw new ClassWithThatIDNotExistsException(id_class);
        }
    }





    public async deleteSchedule(id_class:number,id_schedule:number){ 

        const classe =await this.classRepository.findOneBy({id:id_class});

        if (classe) {
            const schedule= await this.scheduleRepository 
                .createQueryBuilder("schedule")
                .leftJoinAndSelect("schedule.classe","class")
                .where("schedule.id = :id_schedule",{id_schedule:id_schedule})
                .andWhere("class.id = :id_class",{id_class:classe.id})
                .getOne();
        
            if (schedule) {
                const result = await this.scheduleRepository.delete(id_schedule);
                return id_schedule;
            } 
            else {
                throw new ScheduleWithThatIDNotExistsInClassException(id_schedule,classe.name);
            }
        } 
        else {
            throw new ClassWithThatIDNotExistsException(id_class);
        }
        

    }



    public async getScheduleTeacher(id_class:number,id_teacher:number,yearAcademic:string){


        const classe = await this.classRepository.findOneBy({id:id_class});
        const teacher = await this.teacherRepository.findOneBy({id:id_teacher});

        if (!validate_year_academic(yearAcademic))
            throw new FormatYearException();

        if (teacher == null) 
            throw new TeacherWithThatIDNotExistsException(id_teacher);

        if (classe == null)  
            throw new ClassWithThatIDNotExistsException(id_class);

        
        
        const  subjects = await this.subjectRepository 
                .createQueryBuilder("subject")
                .leftJoinAndSelect("subject.teacher","teacher")
                .leftJoinAndSelect("subject.classe","classe")
                .where("teacher.id = :id_teacher",{id_teacher:id_teacher})
                .andWhere("classe.id = :id_class",{id_class:id_class})
                .getMany();

        
        let schedule = await this.scheduleRepository 
                .createQueryBuilder("schedule")
                .leftJoinAndSelect("schedule.classe","class")
                .leftJoinAndSelect("schedule.year","year")
                .where("year.year = :yearAcademic",{yearAcademic:yearAcademic})
                .andWhere("class.id = :id_class",{id_class:classe.id})
                .getOne();

        console.log(schedule);
                

        if (schedule) {
            if (subjects && subjects.length!=0) {

                const subjectIds = subjects.map(it=>it.subjectId);

                schedule.schedule = this.filterSchedule(subjectIds,schedule.schedule); 
    
                console.log(schedule);

                return schedule;
            } 
            else {
                schedule.schedule = this.cleanSchedule(schedule.schedule);
                return schedule;
            }
        } 
        else {
           throw new ClassWithIDHaveNotScheduleForYearException(id_class,yearAcademic);
        }
        
        
        
    }



    private  filterSchedule(subjectIds:number[],schedule : ScheduleInteface){

        schedule["Monday"] = schedule["Monday"].filter(it=>subjectIds.includes(it.id_subject));
        schedule["Tuesday"] = schedule["Tuesday"].filter(it=>subjectIds.includes(it.id_subject));
        schedule["Wednesday"] = schedule["Wednesday"].filter(it=>subjectIds.includes(it.id_subject));
        schedule["Thursday"] = schedule["Thursday"].filter(it=>subjectIds.includes(it.id_subject));
        schedule["Friday"] = schedule["Friday"].filter(it=>subjectIds.includes(it.id_subject));
        schedule["Saturday"] = schedule["Saturday"].filter(it=>subjectIds.includes(it.id_subject));
        schedule["Sunday"] = schedule["Sunday"].filter(it=>subjectIds.includes(it.id_subject));

        return schedule;   
    }

    private cleanSchedule (schedule : ScheduleInteface){
        schedule["Monday"] = [];
        schedule["Tuesday"] = [];
        schedule["Wednesday"] = [];
        schedule["Thursday"] = [];
        schedule["Friday"] = [];
        schedule["Saturday"] = [];
        schedule["Sunday"] = [];
        return schedule;
    }

}

