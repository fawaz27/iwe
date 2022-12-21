import { AppDataSource } from '../database/AppDataSource';
import { Subject } from '../models/subject.entity';
import { Class } from '../models/class.entity';
import { Teacher } from '../models/teacher.entity';
import CreateSubjectDto from '../dto/subject.dto';
import NoSubjectForClassFoundException from '../exceptions/subject/NoSubjectForClassFoundException';
import InternalErrorException from '../exceptions/InternalErrorException';
import TeacherWithThatIDNotExistsException from '../exceptions/teacher/TeacherWithThatIDNotExistsException';
import ClassWithThatIDNotExistsException from '../exceptions/class/ClassWithThatIDNotExistsException';
import SubjectWithThatIDNotExistsInClassException from '../exceptions/subject/SubjectWithThatIDNotExistsInClassException';
import TeacherWithIdHasNoSubjectsException from '../exceptions/teacher/TeacherWithIdHasNoSubjectsException';
import { Establishment } from '../models/establishment.entity';
import EstablishmentWithThatIDNotExistsException from '../exceptions/establishment/EstablishmentWithThatIDNotExistsException';
import NoClassFoundInEstablishmentException from '../exceptions/class/NoClassFoundExceptionInEstablishment';
import { Subject_Ets } from '../models/subject_ets.entity';
import SubjectWithThatIDInClassForEstablishmentNotExistsException from '../exceptions/subjectEts/SubjectWithThatIDInClassForEstablishmentNotExistsException';


export class SubjectService{

    public classRepository;
    public subjectRepository;
    public teacherRepository;
    public subjectsEtsRepository;
    public etsRepository;

    constructor(){
        
        this.classRepository=AppDataSource.getRepository(Class);
        this.subjectRepository=AppDataSource.getRepository(Subject);
        this.teacherRepository=AppDataSource.getRepository(Teacher);
        this.subjectsEtsRepository=AppDataSource.getRepository(Subject_Ets); 
        this.etsRepository=AppDataSource.getRepository(Establishment);
        
    }


    public async getAllSubjects(id_class:number){

        const classe =await this.classRepository.findOneBy({id:id_class});

        if (classe) {
            const subjects= await this.subjectRepository 
                .createQueryBuilder("subject")
                .leftJoinAndSelect("subject.classe","class")
                .leftJoinAndSelect("subject.teacher","teacher")
                .where("class.id = :id_class",{id_class:classe.id})
                .getMany();
        
            if (subjects && subjects.length!=0) {
                return subjects;
            } 
            else {
                throw new NoSubjectForClassFoundException(classe.name);
            }
        } else {
            throw new ClassWithThatIDNotExistsException(id_class);
        }

        
    
        
    }

    public async createSubjectInClass(id_class:number,id_subjectEts:number){

            const classe = await this.classRepository
                .createQueryBuilder("class")
                .leftJoinAndSelect("class.etablishment","establishment")
                .where("class.id = :id_class ",{id_class:id_class})
                .getOne();

            if (classe) {

                const subjectEts = await this.subjectsEtsRepository
                    .createQueryBuilder("subject")
                    .leftJoinAndSelect("subject.etablishment","establishment")
                    .where("subject.id = :id",{id:id_subjectEts})
                    .andWhere("establishment.id = :id_ets ",{id_ets:classe.etablishment.id})
                    .getOne();

                if(subjectEts){
                   
                    const newSubject = new Subject();
                    newSubject.subjectId = subjectEts.id;
                    newSubject.name = subjectEts.name;
                    newSubject.hourly_billing = 0;
                    newSubject.quota_hours = 0;
                    newSubject.classe = classe ;
        
                    const created = await this.subjectRepository.save(newSubject);
                    if (created) 
                        return created;
                    else
                        throw new InternalErrorException();

                }
                else{
                    throw new SubjectWithThatIDInClassForEstablishmentNotExistsException(id_subjectEts,id_class);
                }    
                
            } 
            else {
                throw new ClassWithThatIDNotExistsException(id_class);
            }
    
            

        
    }

    public async getSubjectById(id_class:number,id_subject:number){
        
        const classe =await this.classRepository.findOneBy({id:id_class});

        if (classe) {
            const subject= await this.subjectRepository 
                .createQueryBuilder("subject")
                .leftJoinAndSelect("subject.classe","class")
                .leftJoinAndSelect("subject.teacher","teacher")
                .where("subject.subjectId = :id_subject",{id_subject:id_subject})
                .andWhere("class.id = :id_class",{id_class:classe.id})
                .getOne();
        
            if (subject) {
                return subject;
            } 
            else {
                throw new SubjectWithThatIDNotExistsInClassException(id_subject,classe.name);
            }
        } 
        else {
            throw new ClassWithThatIDNotExistsException(id_class);
        }
        

    }

    public async updateSubject(subject:CreateSubjectDto,id_class:number,id_subject:number){
    
        const classe = await this.classRepository.findOneBy({id:id_class});

        if (classe) {

            const subjectUpdate= await this.subjectRepository 
                    .createQueryBuilder("subject")
                    .leftJoinAndSelect("subject.classe","class")
                    .leftJoinAndSelect("subject.teacher","teacher")
                    .where("subject.subjectId = :id_subject",{id_subject:id_subject})
                    .andWhere("class.id = :id_class",{id_class:classe.id})
                    .getOne();
            
            if (subjectUpdate) {
                if (subject.id_teacher!=null && typeof(subject.id_teacher)==='number') {
                    const teacher = await this.teacherRepository.findOneBy({id:subject.id_teacher});
                    
                    if (teacher) {

                        subjectUpdate.hourly_billing = subject.hourly_billing;
                        subjectUpdate.quota_hours = subject.quota_hours;
                        subjectUpdate.teacher = teacher;
                        const result = await this.subjectRepository.save(subjectUpdate);
                        
                        if (result) {
                            return result;
                        } 
                        else {
                            throw new InternalErrorException();
                        }

                    } 
                    else {
                        throw new TeacherWithThatIDNotExistsException(subject.id_teacher)
                    }
                } 
                else{
  
                    subjectUpdate.hourly_billing = subject.hourly_billing;
                    subjectUpdate.quota_hours = subject.quota_hours;

                    const result = await this.subjectRepository.save(subjectUpdate);

                        if (result) {
                            return result;
                        } else {
                            throw new InternalErrorException();
                        }

                }
            } 
            else {
                throw new SubjectWithThatIDNotExistsInClassException(id_subject,classe.name);
            }
            
        }
        else{
            throw new ClassWithThatIDNotExistsException(id_class);
        }
    }

    public async deleteSubject(id_class:number,id_subject:number){ 

        const classe = await this.classRepository.findOneBy({id:id_class});

        if (classe) {

            const subject = await this.subjectRepository 
                .createQueryBuilder("subject")
                .leftJoinAndSelect("subject.classe","class")
                .where("subject.subjectId = :id_subject",{id_subject:id_subject})
                .andWhere("class.id = :id_class",{id_class:classe.id})
                .getOne();
        
            if (subject) {
                const result = await this.subjectRepository.delete(id_subject);
                if (result)
                    return id_subject;
            } 
            else {
                throw new SubjectWithThatIDNotExistsInClassException(id_subject,classe.name);
            }
        } 
        else {
            throw new ClassWithThatIDNotExistsException(id_class);
        }
        

    }

    public async getSubjectsTeacher(id_ets:number,id_teacher:number){

        const estab =  await this.etsRepository
            .createQueryBuilder("etablishment")
            .leftJoinAndSelect("etablishment.year","year")
            .where("etablishment.id = :id ",{id:id_ets})
            .getOne();

        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        } 

        const teacher = await this.teacherRepository.findOneBy({id:id_teacher});

        if (teacher) {

            const classes = await this.classRepository
                    .createQueryBuilder("class")
                    .leftJoinAndSelect("class.etablishment","etablishment")
                    .where("etablishment.id = :id_ets",{id_ets:id_ets})
                    .getMany();

            if (classes==null || classes.length==0) {
                throw new NoClassFoundInEstablishmentException(estab.name);
            } 
            
          
            const  subjects = await this.subjectRepository 
                .createQueryBuilder("subject")
                .leftJoinAndSelect("subject.teacher","teacher")
                .leftJoinAndSelect("subject.classe","classe")
                .where("teacher.id = :id_teacher",{id_teacher:id_teacher})
                .getMany();

            const classeIds = classes.map(it=>it.id);
            
            if (subjects && subjects.length!=0) {

                const result = subjects.filter(it=>classeIds.includes(it.classe.id));

                if (result && result.length!=0) {
                    return result;
                }
                else{
                    throw new TeacherWithIdHasNoSubjectsException(id_teacher);
                } 
            } 
            else {
                throw new TeacherWithIdHasNoSubjectsException(id_teacher);
            }
        } 
        else {
            throw new TeacherWithThatIDNotExistsException(id_teacher);
        }
    }




}