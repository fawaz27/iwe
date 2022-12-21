import { AppDataSource } from '../database/AppDataSource';
import CreateProgramDto from '../dto/program.dto';
import ClassWithThatNameNotExistsException from '../exceptions/class/ClassWithThatNameNotExistsException';
import EstablishmentWithThatIDNotExistsException from '../exceptions/establishment/EstablishmentWithThatIDNotExistsException';
import InternalErrorException from '../exceptions/InternalErrorException';
import DestinatairesCanNotBeEmptyException from '../exceptions/program/DestinatairesCanNotBeEmptyException';
import NoProgramFoundException from '../exceptions/program/NoProgramFoundInEstablishmentException';
import NoProgramFoundInEstablishmentForTeacherWithIDException from '../exceptions/program/NoProgramFoundInEstablishmentForTeacherWithIDException';
import ProgramWithThatIDNotExistsException from '../exceptions/program/ProgramWithThatIDInEstablishmentNotExistsException';
import TeacherWithThatIDNotExistsInEstablishmentException from '../exceptions/teacher/TeacherWithThatIDNotExistsInEstablishmentException';
import TeacherWithThatIDNotExistsException from '../exceptions/teacher/UserWithThatIDNotExistsException';
import { Class } from '../models/class.entity';
import { Establishment } from '../models/establishment.entity';
import { Program } from '../models/program.entity';
import { Teacher } from '../models/teacher.entity';
import validator_teachers from '../utils/validator-teachers';


export class ProgramService{
    public programRepository;
    public teacherRepository;
    public classRepository;
    public etsRepository;

    constructor(){
        this.programRepository=AppDataSource.getRepository(Program);
        this.teacherRepository=AppDataSource.getRepository(Teacher);
        this.classRepository=AppDataSource.getRepository(Class);   
        this.etsRepository=AppDataSource.getRepository(Establishment);
    }

    public async getAllPrograms(id_ets:number,id_teacher:number){

        const estab =  await this.etsRepository
        .createQueryBuilder("etablishment")
        .leftJoinAndSelect("etablishment.year","year")
        .where("etablishment.id = :id ",{id:id_ets})
        .getOne();

        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }        
        
        let programs = await this.programRepository
                .createQueryBuilder("program")
                .leftJoinAndSelect("program.teacher","teacher")
                .where("program.establishment = :id_ets",{id_ets:estab.id})
                .getMany();

        if (programs && programs.length!=0) {
            
            if (id_teacher) {
                programs = programs.filter(it=>it.access=="ALL-TEACHERS" || it.destinataires.includes(id_teacher));
                
                if (programs && programs.length!=0)
                    throw new NoProgramFoundInEstablishmentForTeacherWithIDException(id_ets,id_teacher);
                return programs;
            } 
            else {
                return programs;
            }
            
        
        } 
        else {
           throw new NoProgramFoundException(id_ets);
        }

    }

    public async createProgram(id_ets:number,id_teacher:number,program:CreateProgramDto){

        const estab =  await this.etsRepository
            .createQueryBuilder("etablishment")
            .leftJoinAndSelect("etablishment.year","year")
            .where("etablishment.id = :id ",{id:id_ets})
            .getOne();

        if (estab == null) {
        throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }

        const teacher = await  this.teacherRepository
            .createQueryBuilder("teacher")
            .where("teacher.id = :id_teacher",{id_teacher:id_teacher})
            .getOne();

        if (teacher) {

            const classe = await this.classRepository.findOneBy({name:program.classe});

            if (classe) {
                const result = await validator_teachers(program.destinataires,id_ets);

                if (result) {
                    throw new TeacherWithThatIDNotExistsInEstablishmentException(result,id_ets);
                } 
                else {
                    const newProgram = new Program();

                    newProgram.access=program.access;
                    newProgram.classe=program.classe;
                    newProgram.destinataires=program.destinataires;
                    newProgram.subject=program.subject;
                    newProgram.date=program.date;
                    newProgram.establishment=estab.id;

                    if (newProgram.access=="ALL-TEACHERS") {
                        newProgram.destinataires=[];
                    } 
                    else if (newProgram.access=="GROUP-TEACHERS") {
                        if (newProgram.destinataires.length==0) {
                           throw new DestinatairesCanNotBeEmptyException();
                        }
                    }

                    newProgram.teacher=teacher;
                    

                    const created = await this.programRepository.save(newProgram);

                    if (created) {
                        return created;
                    } 
                    else {
                        throw new InternalErrorException();
                    }
                }
            }
            else 
            {
                throw new ClassWithThatNameNotExistsException(program.classe);
            }
            
            
        } 
        else {
            throw new TeacherWithThatIDNotExistsException(id_teacher);  
        }

    
           

    }



    public async getProgramById(id_ets:number,id:number){

        const estab =  await this.etsRepository
            .createQueryBuilder("etablishment")
            .leftJoinAndSelect("etablishment.year","year")
            .where("etablishment.id = :id ",{id:id_ets})
            .getOne();

        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }        
        
        const program = await this.programRepository
                .createQueryBuilder("program")
                .leftJoinAndSelect("program.teacher","teacher")
                .where("program.id = :id",{id:id})
                .andWhere("program.establishment = :id_ets",{id_ets:estab.id})
                .getOne();

        if (program) {
            return program;
        } 
        else {
           throw new ProgramWithThatIDNotExistsException(id,id_ets);
        }
        
    }


    public async updateProgram(id_ets:number,id:number,program:CreateProgramDto){
 
        const estab =  await this.etsRepository
            .createQueryBuilder("etablishment")
            .leftJoinAndSelect("etablishment.year","year")
            .where("etablishment.id = :id ",{id:id_ets})
            .getOne();

        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }        
        
        const programUpdate = await this.programRepository
                .createQueryBuilder("program")
                .leftJoinAndSelect("program.teacher","teacher")
                .where("program.id = :id",{id:id})
                .andWhere("program.establishment = :id_ets",{id_ets:estab.id})
                .getOne();

        if (programUpdate) {

            programUpdate.access=program.access;
            programUpdate.classe=program.classe;
            programUpdate.destinataires=program.destinataires;
            programUpdate.subject=program.subject;
            programUpdate.date=program.date;

            if (programUpdate.access=="ALL-TEACHERS") {
                programUpdate.destinataires=[];
            } 
            else if (programUpdate.access=="GROUP-TEACHERS") {
                if (programUpdate.destinataires.length==0) {
                   throw new DestinatairesCanNotBeEmptyException();
                }
            }
            
            const result = await this.programRepository.save(programUpdate);

            if (result) {
                return result;
            } 
            else {
                throw new InternalErrorException();
            }
            
        } 
        else {
            throw new ProgramWithThatIDNotExistsException(id,id_ets);
        }

    }

    public async deleteProgram(id_ets:number,id:number){

        const estab =  await this.etsRepository
            .createQueryBuilder("etablishment")
            .leftJoinAndSelect("etablishment.year","year")
            .where("etablishment.id = :id ",{id:id_ets})
            .getOne();

        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }        
        
        const program = await this.programRepository
                .createQueryBuilder("program")
                .leftJoinAndSelect("program.teacher","teacher")
                .where("program.id = :id",{id:id})
                .andWhere("program.establishment = :id_ets",{id_ets:estab.id})
                .getOne();

    

        if (program) {
            const result = await this.programRepository.delete(id);
                return id;
        } 
        else {
            throw new ProgramWithThatIDNotExistsException(id,id_ets);
        }

    } 
            
}



