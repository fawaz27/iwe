import { AppDataSource } from '../database/AppDataSource';
import CreateEstablishmentDto from '../dto/establishment.dto';
import CreateManagerDto from '../dto/manager.dto';
import EstablishmentWithThatNameAndYearAlreadyExistsException from '../exceptions/establishment/EstablishmentWithThatNameAndYearAlreadyExistsException';
import InternalErrorException from '../exceptions/InternalErrorException';
import FormatYearException from '../exceptions/year/FormatYearException';
import YearWithThatNameNotExistsException from '../exceptions/year/YearWithThatNameNotExistsException';
import { Establishment } from '../models/establishment.entity';
import { Teacher } from '../models/teacher.entity';
import { Teacher_Ets } from '../models/teacher_ets.entity';
import { Year_Academic } from '../models/year_academic.entity';
import validate_year_academic from '../utils/validator-year_academic';
import NoEstablishmentFoundException from '../exceptions/establishment/NoEstablishmentFoundException';
import EstablishmentWithThatIDNotExistsException from '../exceptions/establishment/EstablishmentWithThatIDNotExistsException';
import EstablishmentWithThatIDNotExistsForYearException from '../exceptions/establishment/EstablishmentWithThatIDNotExistsForYearException';
import EstablishmentWithThatIDHaveAlreadyCensor from '../exceptions/establishment/EstablishmentWithThatIDHaveAlreadyCensor';
import EstablishmentWithThatIDHaveAlreadyDirector from '../exceptions/establishment/EstablishmentWithThatIDHaveAlreadyDirector';
import EstablishmentWithThatIDHaveNotManager from '../exceptions/establishment/EstablishmentWithThatIDHaveNotManager';
import DeleteRoleManagerDto from '../dto/roleManager.dto';
import TeacherWithThatEmailNotExistsException from '../exceptions/teacher/TeacherWithThatEmailNotExistsException';
import NoEstablishmentWithNameFoundException from '../exceptions/establishment/NoEstablishmentWithNameFoundException';
import TeacherWithThatIDNotExistsException from '../exceptions/teacher/UserWithThatIDNotExistsException';
import NoEstablishmentFoundForTeacherException from '../exceptions/establishment/NoEstablishmentFoundForTeacherException';
import TeacherWithThatIdIsAlreadyManagerInEstablishmentException from '../exceptions/teacher/TeacherWithThatIdIsAlreadyManagerInEstablishmentException';
import TeacherWithThatIdIsAlreadyDirectorInEstablishmentException from '../exceptions/teacher/TeacherWithThatIdIsAlreadyDirectorInEstablishmentException';


export class EtablishmentService {

    public etsRepository;
    public yearRepository;
    public teacherRepository;
    public teacherEtsRepository;


    constructor(){
        
        this.etsRepository=AppDataSource.getRepository(Establishment);
        this.yearRepository=AppDataSource.getRepository(Year_Academic);
        this.teacherRepository=AppDataSource.getRepository(Teacher);
        this.teacherEtsRepository=AppDataSource.getRepository(Teacher_Ets);
        
    }

    public async getAllEtablishment(){

        const estabs = await this.etsRepository
            .createQueryBuilder("etablishment")
            .leftJoinAndSelect("etablishment.year","year")
            .leftJoinAndSelect("etablishment.teacher_ets","teacher_ets")
            .andWhere("teacher_ets.role = :role",{role:"director"})
            .getMany();
            
        if (estabs && estabs.length!=0) {
            return estabs;
        } 
        else {
           throw new NoEstablishmentFoundException();
        }
   
    }

    public async createEtablishment(eta:CreateEstablishmentDto){

            
        if(!validate_year_academic(eta.yearAcademic)){
            throw  new FormatYearException();
        }              

        const year = await this.yearRepository.findOne({  where:{year:`${eta.yearAcademic}`}});
        const teacher = await this.teacherRepository.findOneBy({id:eta.teacherId});

        if(teacher == null)
            throw new TeacherWithThatIDNotExistsException(eta.teacherId);


        if (year) {
            
            const isAlreadyExist =  await this.etsRepository
                    .createQueryBuilder("etablishment")
                    .leftJoinAndSelect("etablishment.year","year")
                    .leftJoinAndSelect("etablishment.teacher_ets","teacher_ets")
                    .where("etablishment.name = :name ",{name:eta.name})
                    .andWhere("year.id = :id_year",{id_year:year.id})
                    .andWhere("teacher_ets.teacherId = :teacherId",{teacherId:eta.teacherId})
                    .andWhere("teacher_ets.role = :role",{role:"director"})
                    .getOne();

            if (isAlreadyExist) 
                throw new EstablishmentWithThatNameAndYearAlreadyExistsException(eta.name,eta.yearAcademic,eta.teacherId);

            else{

                const newEsta = new Establishment();
                newEsta.name= eta.name;
                newEsta.year=year;

                const created = await this.etsRepository.save(newEsta);

                

                if (created) {

                    const teacher_ets = new Teacher_Ets();

                    teacher_ets.teacherId=teacher.id;
                    teacher_ets.establishmentId=created.id;
                    teacher_ets.role="director";

                    const result = await this.teacherEtsRepository.save(teacher_ets);                    

                    if (result) {
                        return {created,result};
                    }
                    else{
                        throw new InternalErrorException();
                    }       
                    
                } 
                else {
                    throw new InternalErrorException();
                }

            }

        }
        else {
            throw  new YearWithThatNameNotExistsException(eta.yearAcademic);
        }

            
   
    }

    public async getEtablishmentById(id:number){

        const estab = await this.etsRepository
                .createQueryBuilder("etablishment")
                .leftJoinAndSelect("etablishment.teacher_ets","teacher_ets")
                .leftJoinAndSelect("etablishment.year","year")
                .where("etablishment.id = :id ",{id:id})
                .andWhere("teacher_ets.role = :role",{role:"director"})
                .getOne();
        // console.log(estab);
        if (estab) {
            return estab;
        } 
        else {
            throw new  EstablishmentWithThatIDNotExistsException(id);
        }

    }

    // Récupérer toutes les soubscriptions d'un établissement
    public async getAllEtablishmentsByName(name:string){

        const estabs = await this.etsRepository
                .createQueryBuilder("etablishment")
                .leftJoinAndSelect("etablishment.year","year")
                .where("etablishment.name = :name ",{name:name})
                .getMany();
        // console.log(estab);
        if (estabs && estabs.length!=0) {
            return estabs;
        } 
        else {
            throw new  NoEstablishmentWithNameFoundException(name);
        }

    }

    //Seulement le nom de l'établissement qui est modifiable
    public async updateEtablishment(id:number,estab:CreateEstablishmentDto){


        
        if(!validate_year_academic(estab.yearAcademic)){
            throw  new FormatYearException();
        }              

        const year = await this.yearRepository.findOne({  where:{year:`${estab.yearAcademic}`}});

        if (year) {

            const isAlreadyExist =  await this.etsRepository
                    .createQueryBuilder("etablishment")
                    .leftJoinAndSelect("etablishment.year","year")
                    .leftJoinAndSelect("etablishment.teacher_ets","teacher_ets")
                    .where("etablishment.name = :name ",{name:estab.name})
                    .andWhere("year.id = :id_year",{id_year:year.id})
                    .andWhere("teacher_ets.teacherId = :teacherId",{teacherId:estab.teacherId})
                    .andWhere("teacher_ets.role = :role",{role:"director"})
                    .getOne();

            if (isAlreadyExist && isAlreadyExist.id!=id) 
                throw new EstablishmentWithThatNameAndYearAlreadyExistsException(estab.name,estab.yearAcademic,estab.teacherId);

            const estabUpdate =  await this.etsRepository
                    .createQueryBuilder("etablishment")
                    .leftJoinAndSelect("etablishment.year","year")
                    .where("etablishment.id = :id ",{id:id})
                    .andWhere("year.year = :year",{year:estab.yearAcademic})
                    .getOne();

            if (estabUpdate) {
                estabUpdate.name=estab.name;
                const result = await this.etsRepository.save(estabUpdate);

                if (result) {
                    return result;
                } 
                else {
                    throw new InternalErrorException();
                }
                
            }
            else {
                throw new EstablishmentWithThatIDNotExistsForYearException(id,estab.yearAcademic);
            }


        }
       
        
   
    }

    public async deleteEtablishment(id:number){
   
        const estab =  await this.etsRepository
                .createQueryBuilder("etablishment")
                .leftJoinAndSelect("etablishment.year","year")
                .where("etablishment.id = :id ",{id:id})
                .getOne();


        if (estab) {

            const result = await this.etsRepository.delete(id);
            //console.log(result);
            
            return id;
        }
        else {
            throw new EstablishmentWithThatIDNotExistsException(id);
        }
    }

    public async addManagerToEstablishment(id:number,manager:CreateManagerDto){

        const estab =  await this.etsRepository
                .createQueryBuilder("etablishment")
                .leftJoinAndSelect("etablishment.year","year")
                .where("etablishment.id = :id ",{id:id})
                .getOne();
         
        if (estab) {

            const teacher = await this.teacherRepository
                    .createQueryBuilder("teacher")
                    .where("teacher.email = :email",{email:manager.email})
                    .getOne()

            //console.log(teacher);
                        
            if (teacher) {

                const isAlreadyDirector = await this.teacherEtsRepository
                    .createQueryBuilder("teacher_ets")
                    .where("teacher_ets.establishmentId = :establishmentId",{establishmentId:estab.id})
                    .andWhere("teacher_ets.teacherId = :teacherId",{teacherId:teacher.id})
                    .andWhere("teacher_ets.role = :role ",{role:'director'})
                    .getOne();

                if (isAlreadyDirector ) {
                    throw new TeacherWithThatIdIsAlreadyDirectorInEstablishmentException(teacher.id,estab.id);
                }
                const teacher_ets = new Teacher_Ets();

                teacher_ets.teacherId=teacher.id;
                teacher_ets.establishmentId=id;
                teacher_ets.role="censor";

                const result = await this.teacherEtsRepository.save(teacher_ets);

                if (result) {
                    return result
                }
                else{
                    throw new InternalErrorException();
                }
                
            } 
            else {

                throw new TeacherWithThatEmailNotExistsException(manager.email);
            }
            
        } 
        
        else {
            throw new EstablishmentWithThatIDNotExistsException(id);
        }

        
                

    }

    public async deleteManagerToEstablishment(id:number){
        
        const estab =  await this.etsRepository
                .createQueryBuilder("etablishment")
                .leftJoinAndSelect("etablishment.year","year")
                .where("etablishment.id = :id ",{id:id})
                .getOne();
         
        if (estab) {
            const delmanager = await this.teacherEtsRepository
                .createQueryBuilder("teacher_ets")
                .where("teacher_ets.establishmentId = :id",{id:id})
                .andWhere("teacher_ets.role = :role ",{role:"censor"})
                .getOne();
        
        
            if (delmanager) {

                const result = await this.teacherEtsRepository
                        .createQueryBuilder()
                        .delete()
                        .where("establishmentId = :id",{id:id})
                        .andWhere("role = :role ",{role:"censor"})
                        .execute();
                        
                if (result) {
                    console.log(result);
                    
                    return result;
                } 
                else {
                    throw new InternalErrorException()
                }
            } 
            else {
                throw new EstablishmentWithThatIDHaveNotManager(id,"censor")
            }
        } 
        
        else {
            throw new EstablishmentWithThatIDNotExistsException(id);
        }
        

        
    }

    public async getAllEtablishmentTeacher(id_teacher:number){

        const teacher = await this.teacherRepository.findOneBy({id:id_teacher});

        if (teacher) {
            const estabs = await this.teacherEtsRepository
                    .createQueryBuilder("teacher_ets")
                    .leftJoinAndSelect("teacher_ets.establishment","establishment")
                    .leftJoinAndSelect("teacher_ets.teacher","teacher")
                    .where("teacher.id = :id_teacher",{id_teacher:id_teacher})
                    .getMany();

            if (estabs && estabs.length!=0) {
                return estabs;
            } 
            else {
                throw new NoEstablishmentFoundForTeacherException(id_teacher);
            }
        }
        else{
            throw new TeacherWithThatIDNotExistsException(id_teacher);
        }
    }

}