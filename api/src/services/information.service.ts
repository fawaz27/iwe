import { AppDataSource } from '../database/AppDataSource';
import CreateInformationDto from '../dto/information.dto';
import EstablishmentWithThatIDNotExistsException from '../exceptions/establishment/EstablishmentWithThatIDNotExistsException';
import DestinatairesCanNotBeEmptyException from '../exceptions/information/DestinatairesCanNotBeEmptyException';
import InformationWithThatIDNotExistsException from '../exceptions/information/InformationWithThatIDInEstablishmentNotExistsException';
import NoInformationFoundException from '../exceptions/information/NoInformationFoundInEstablishmentException';
import NoInformationFoundInEstablishmentForTeacherWithIDException from '../exceptions/information/NoInformationFoundInEstablishmentForTeacherWithIDException';
import InternalErrorException from '../exceptions/InternalErrorException';
import TeacherWithThatIDNotExistsInEstablishmentException from '../exceptions/teacher/TeacherWithThatIDNotExistsInEstablishmentException';
import TeacherWithThatIDNotExistsException from '../exceptions/teacher/UserWithThatIDNotExistsException';
import { Establishment } from '../models/establishment.entity';
import { Information } from '../models/information.entity';
import { Teacher } from '../models/teacher.entity';
import validator_teachers from '../utils/validator-teachers';


export class InformationService{

    public informationRepository;
    public etsRepository;
    public teacherRepository;


    constructor(){
        this.informationRepository=AppDataSource.getRepository(Information);
        this.teacherRepository=AppDataSource.getRepository(Teacher);
        this.etsRepository=AppDataSource.getRepository(Establishment);
    }

    public async getAllInformations(id_ets:number,id_teacher:number){
    
        const estab =  await this.etsRepository
        .createQueryBuilder("etablishment")
        .leftJoinAndSelect("etablishment.year","year")
        .where("etablishment.id = :id ",{id:id_ets})
        .getOne();

        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }

        let informations = await this.informationRepository
                .createQueryBuilder("information")
                .leftJoinAndSelect("information.teacher","teacher")
                .where("information.establishment = :id_ets",{id_ets:estab.id})
                .getMany();

        if (informations && informations.length!=0) {

            if (id_teacher) {
                informations = informations.filter(it=>it.access=="ALL-TEACHERS" || it.destinataires.includes(id_teacher));
                
                if (informations && informations.length!=0) 
                    throw new NoInformationFoundInEstablishmentForTeacherWithIDException(id_ets,id_teacher);
                    
                return informations;
            } 
            else {
                return informations;
            }
     
        } 
        else {
            throw new NoInformationFoundException(id_ets);
        }

    }

    public async createInformation(id_ets:number,id_teacher:number,information:CreateInformationDto){

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

            const result = await validator_teachers(information.destinataires,id_ets);

            if (result) {
                throw new TeacherWithThatIDNotExistsInEstablishmentException(result,id_ets);
            } 
            else {
                const newInformation = new Information();

                newInformation.access=information.access;
                newInformation.contents=information.contents;
                newInformation.destinataires=information.destinataires;
                newInformation.establishment=estab.id;

                if (newInformation.access=="ALL-TEACHERS") {
                    newInformation.destinataires=[];
                } 
                else if (newInformation.access=="GROUP-TEACHERS") {
                    if (newInformation.destinataires.length==0) {
                       throw new DestinatairesCanNotBeEmptyException();
                    }
                }

                newInformation.teacher=teacher;
                

                const created = await this.informationRepository.save(newInformation);

                if (created) {
                    return created;
                } 
                else {
                    throw new InternalErrorException();
                }
            }
            
            
            
        } 
        else {
            throw new TeacherWithThatIDNotExistsException(id_teacher);  
        }
    }

    public async getInformationById(id_ets:number,id:number){

        const estab =  await this.etsRepository
            .createQueryBuilder("etablishment")
            .leftJoinAndSelect("etablishment.year","year")
            .where("etablishment.id = :id ",{id:id_ets})
            .getOne();

        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }        
        
        const information = await this.informationRepository
                .createQueryBuilder("information")
                .leftJoinAndSelect("information.teacher","teacher")
                .where("information.id = :id",{id:id})
                .andWhere("information.establishment = :id_ets",{id_ets:estab.id})
                .getOne();

        if (information) {
            return information;
        } 
        else {
            throw new InformationWithThatIDNotExistsException(id,id_ets);
        }
        
    }

    public async updateInformation(id_ets:number,id:number,information:CreateInformationDto){
 
        const estab =  await this.etsRepository
            .createQueryBuilder("etablishment")
            .leftJoinAndSelect("etablishment.year","year")
            .where("etablishment.id = :id ",{id:id_ets})
            .getOne();

        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }        
        
        const informationUpdate = await this.informationRepository
                .createQueryBuilder("information")
                .leftJoinAndSelect("information.teacher","teacher")
                .where("information.id = :id",{id:id})
                .andWhere("information.establishment = :id_ets",{id_ets:estab.id})
                .getOne();

        if (informationUpdate) {

            informationUpdate.access=information.access;
            informationUpdate.contents=information.contents;
            informationUpdate.destinataires=information.destinataires;
            informationUpdate.establishment=estab.id;

            if (informationUpdate.access=="ALL-TEACHERS") {
                informationUpdate.destinataires=[];
            } 
            else if (informationUpdate.access=="GROUP-TEACHERS") {
                if (informationUpdate.destinataires.length==0) {
                   throw new DestinatairesCanNotBeEmptyException();
                }
            }
            
            const result = await this.informationRepository.save(informationUpdate);

            if (result) {
                return result;
            } 
            else {
                throw new InternalErrorException();
            }
            
        } 
        else {
            throw new InformationWithThatIDNotExistsException(id,id_ets);
        }

    }

    public async deleteInformation(id_ets:number,id:number){

        const estab =  await this.etsRepository
            .createQueryBuilder("etablishment")
            .leftJoinAndSelect("etablishment.year","year")
            .where("etablishment.id = :id ",{id:id_ets})
            .getOne();

        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }        
        
        const information = await this.informationRepository
                .createQueryBuilder("information")
                .leftJoinAndSelect("information.teacher","teacher")
                .where("information.id = :id",{id:id})
                .andWhere("information.establishment = :id_ets",{id_ets:estab.id})
                .getOne();

    

        if (information) {
            const result = await this.informationRepository.delete(id);
                return id;
        } 
        else {
            throw new InformationWithThatIDNotExistsException(id,id_ets);
        }

    }

   
}