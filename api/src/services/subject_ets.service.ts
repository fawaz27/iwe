import { AppDataSource } from '../database/AppDataSource';
import CreateSubjectEtsDto from '../dto/subject_ets.dto';
import EstablishmentWithThatIDNotExistsException from '../exceptions/establishment/EstablishmentWithThatIDNotExistsException';
import InternalErrorException from '../exceptions/InternalErrorException';
import NoSubjectFoundException from '../exceptions/subjectEts/NoSubjectFoundInEstablishmentException';
import SubjectWithThatIDNotExistsInEstablishmentException from '../exceptions/subjectEts/SubjectWithThatIDInEstablishmentNotExistsException';
import SubjectWithThatNameInEstblishmentAlreadyExistsException from '../exceptions/subjectEts/SubjectWithThatNameAlreadyExistsException';
import { Establishment } from '../models/establishment.entity';
import { Subject } from '../models/subject.entity';
import { Subject_Ets } from '../models/subject_ets.entity';


export class SubjectsEtsService{
    public subjectsEtsRepository;
    public etsRepository;
    public subjectRepository;

    constructor(){
        this.subjectsEtsRepository=AppDataSource.getRepository(Subject_Ets); 
        this.etsRepository=AppDataSource.getRepository(Establishment);
        this.subjectRepository=AppDataSource.getRepository(Subject);
    }

    public async getAllSubjectsEstablishment(id_ets:number){


        
        const estab =  await this.etsRepository
            .createQueryBuilder("etablishment")
            .leftJoinAndSelect("etablishment.year","year")
            .where("etablishment.id = :id ",{id:id_ets})
            .getOne();

        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }        
       
        
        let subjects = await this.subjectsEtsRepository
                .createQueryBuilder("subject")
                .leftJoinAndSelect("subject.etablishment","establishment")
                .where("establishment.id = :id_ets",{id_ets:estab.id})
                .getMany();
        
        if (subjects && subjects.length!=0) {  
                return subjects;
        } 
        else {
           throw new NoSubjectFoundException(id_ets);
        }

    }

    public async createSubjectEstablishment(id_ets:number,subject:CreateSubjectEtsDto){

        const estab =  await this.etsRepository
            .createQueryBuilder("etablishment")
            .leftJoinAndSelect("etablishment.year","year")
            .where("etablishment.id = :id ",{id:id_ets})
            .getOne();

        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }

        const isAlreadyExistName = await this.subjectsEtsRepository
                .createQueryBuilder("subject")
                .leftJoinAndSelect("subject.etablishment","establishment")
                .where("subject.name = :name",{name:subject.name})
                .andWhere("establishment.id = :id ",{id:id_ets})
                .getOne();

        if (isAlreadyExistName) {
            throw new SubjectWithThatNameInEstblishmentAlreadyExistsException(subject.name,estab.name);
        }
    
        const newSubject = new Subject_Ets();

        newSubject.name = subject.name;
        newSubject.etablishment = estab;

        const created = await this.subjectsEtsRepository.save(newSubject);

        if (created) {
            return created;
        } 
        else {
            throw new InternalErrorException();
        }   

    }



    public async getSubjectById(id_ets:number,id:number){

        const estab =  await this.etsRepository
            .createQueryBuilder("etablishment")
            .leftJoinAndSelect("etablishment.year","year")
            .where("etablishment.id = :id ",{id:id_ets})
            .getOne();

        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }        
        
        const subject = await this.subjectsEtsRepository
                .createQueryBuilder("subject")
                .leftJoinAndSelect("subject.etablishment","establishment")
                .where("subject.id = :id",{id:id})
                .andWhere("establishment.id = :id_ets ",{id_ets:id_ets})
                .getOne();

        if (subject) {
            return subject;
        } 
        else {
           throw new SubjectWithThatIDNotExistsInEstablishmentException(id,id_ets);
        }
        
    }


    public async updateSubject(id_ets:number,id:number,subject:CreateSubjectEtsDto){
 
        const estab =  await this.etsRepository
            .createQueryBuilder("etablishment")
            .leftJoinAndSelect("etablishment.year","year")
            .where("etablishment.id = :id ",{id:id_ets})
            .getOne();

        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }     
        
        const isAlreadyExistName = await this.subjectsEtsRepository
                .createQueryBuilder("subject")
                .leftJoinAndSelect("subject.etablishment","establishment")
                .where("subject.name = :name",{name:subject.name})
                .andWhere("establishment.id = :id ",{id:id_ets})
                .getOne();

        if (isAlreadyExistName && isAlreadyExistName.id!=id) {
            throw new SubjectWithThatNameInEstblishmentAlreadyExistsException(subject.name,estab.name);
        }

        const subjectUpdate = await this.subjectsEtsRepository
                .createQueryBuilder("subject")
                .leftJoinAndSelect("subject.etablishment","establishment")
                .where("subject.id = :id",{id:id})
                .andWhere("establishment.id = :id_ets ",{id_ets:estab.id})
                .getOne();

        if (subjectUpdate) {

            if(subjectUpdate.name!=subject.name){

                subjectUpdate.name = subject.name;
            
                const result = await this.subjectsEtsRepository.save(subjectUpdate);

                
                let sco = await this.subjectRepository
                        .createQueryBuilder()
                        .update()
                        .set({name:subject.name})
                        .where("subjectId = :id",{id:id})
                        .execute();

                if (result && sco) {
                    return {result,sco};
                } 
                else {
                    throw new InternalErrorException();
                }
                 
            }
            

            subjectUpdate.name = subject.name;
            
            const result = await this.subjectsEtsRepository.save(subjectUpdate);

            if (result) {
                return result;
            } 
            else {
                throw new InternalErrorException();
            }
            
        } 
        else {
            throw new SubjectWithThatIDNotExistsInEstablishmentException(id,id_ets);
        }

    }

    public async deleteSubject(id_ets:number,id:number){

        const estab =  await this.etsRepository
            .createQueryBuilder("etablishment")
            .leftJoinAndSelect("etablishment.year","year")
            .where("etablishment.id = :id ",{id:id_ets})
            .getOne();

        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }        
        
        const subject = await this.subjectsEtsRepository
                .createQueryBuilder("subject")
                .leftJoinAndSelect("subject.etablishment","establishment")
                .where("subject.id = :id",{id:id})
                .andWhere("establishment.id = :id_ets ",{id_ets:id_ets})
                .getOne();

    

        if (subject) {
            const result = await this.subjectsEtsRepository.delete(id);
                return id;
        } 
        else {
            throw new SubjectWithThatIDNotExistsInEstablishmentException(id,id_ets);
        }

    } 
            
}



