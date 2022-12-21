import { AppDataSource } from '../database/AppDataSource';
import CreateArchiveRequestDto from '../dto/archive_request.dto';
import ArchiveRequestWithThatIDNotExistsException from '../exceptions/archiveRequest/ArchiveRequestWithThatIDInEstablishmentNotExistsException';
import NoArchiveRequestFoundException from '../exceptions/archiveRequest/NoArchiveRequestFoundInEstablishmentException';
import EstablishmentWithThatIDNotExistsException from '../exceptions/establishment/EstablishmentWithThatIDNotExistsException';
import InternalErrorException from '../exceptions/InternalErrorException';
import TeacherWithThatIDNotExistsException from '../exceptions/teacher/TeacherWithThatIDNotExistsException';
import { Archive_request } from '../models/archive_request.entity';
import { Establishment } from '../models/establishment.entity';
import { Teacher } from '../models/teacher.entity';

export class ArchiveRequestService{
    public archiveRequestRepository;
    public teacherRepository;
    public etsRepository;

    constructor(){
        this.archiveRequestRepository=AppDataSource.getRepository(Archive_request);
        this.teacherRepository=AppDataSource.getRepository(Teacher);
        this.etsRepository=AppDataSource.getRepository(Establishment);  
    }

    public async getAllRequests(id_ets:number){

        const estab =  await this.etsRepository
                .createQueryBuilder("etablishment")
                .leftJoinAndSelect("etablishment.year","year")
                .where("etablishment.id = :id ",{id:id_ets})
                .getOne();

        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }
        
        const archives_requests = await this.archiveRequestRepository
                .createQueryBuilder("archive_request")
                .leftJoinAndSelect("archive_request.teacher","teacher")
                .where("archive_request.establishment = :id_ets",{id_ets:estab.id})
                .getMany();

        if (archives_requests && archives_requests.length!=0) {
            return archives_requests;
        
        } 
        else {
            throw new NoArchiveRequestFoundException(id_ets); 
        }
                

       


    }

    public async createRequest(id_ets:number,id_teacher:number,archive_request:CreateArchiveRequestDto){

       
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
            
            const newArchiveRequest =new Archive_request();

            newArchiveRequest.contents=archive_request.contents;
            newArchiveRequest.date_request=archive_request.date_request;
            newArchiveRequest.email=archive_request.email;
            newArchiveRequest.firstname=archive_request.firstname;
            newArchiveRequest.lastname=archive_request.lastname;
            newArchiveRequest.state="Pending";
            newArchiveRequest.type_archivage=archive_request.type_archivage;
            newArchiveRequest.establishment=estab.id;

            newArchiveRequest.teacher=teacher;
            

            const created = await this.archiveRequestRepository.save(newArchiveRequest);

            if (created) {
                return created;
            } 
            else {
                throw new InternalErrorException();
            }
        } 
        else {
            throw new TeacherWithThatIDNotExistsException(id_teacher);  
        }

    
           

    }



    public async getRequestById(id_ets:number,id:number){

        const estab =  await this.etsRepository
                .createQueryBuilder("etablishment")
                .leftJoinAndSelect("etablishment.year","year")
                .where("etablishment.id = :id ",{id:id_ets})
                .getOne();

        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }

        const archive_request = await this.archiveRequestRepository
                .createQueryBuilder("archive_request")
                .leftJoinAndSelect("archive_request.teacher","teacher")
                .where("archive_request.id = :id",{id:id})
                .andWhere("archive_request.establishment = :id_ets",{id_ets:estab.id})
                .getOne();

        if (archive_request) {
            return archive_request;
        } 
        else {
           throw new ArchiveRequestWithThatIDNotExistsException(id,id_ets);
        }
    }


    public async updateRequest(id_ets:number,id:number,archive_request:CreateArchiveRequestDto){

        const estab =  await this.etsRepository
                .createQueryBuilder("etablishment")
                .leftJoinAndSelect("etablishment.year","year")
                .where("etablishment.id = :id ",{id:id_ets})
                .getOne();

        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }
 
        const archiveRequestUpdate = await this.archiveRequestRepository
                .createQueryBuilder("archive_request")
                .leftJoinAndSelect("archive_request.teacher","teacher")
                .where("archive_request.id = :id",{id:id})
                .andWhere("archive_request.establishment = :id_ets",{id_ets:estab.id})
                .getOne();


        if (archiveRequestUpdate) {

            archiveRequestUpdate.contents=archive_request.contents;
            archiveRequestUpdate.date_request=archive_request.date_request;
            archiveRequestUpdate.email=archive_request.email;
            archiveRequestUpdate.firstname=archive_request.firstname;
            archiveRequestUpdate.lastname=archive_request.lastname;
            archiveRequestUpdate.state=archive_request.state;
            archiveRequestUpdate.type_archivage=archive_request.type_archivage;
            archiveRequestUpdate.establishment=estab.id;

            const result = await this.archiveRequestRepository.save(archiveRequestUpdate);

            if (result) {
                return result;
            } 
            else {
                throw new InternalErrorException();
            }

            
        } 
        else {
            throw new ArchiveRequestWithThatIDNotExistsException(id,id_ets);
        }
        

    }

    public async deleteRequest(id_ets:number,id:number){

        const estab =  await this.etsRepository
                .createQueryBuilder("etablishment")
                .leftJoinAndSelect("etablishment.year","year")
                .where("etablishment.id = :id ",{id:id_ets})
                .getOne();

        if (estab == null) {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }

        const archiveRequest = await this.archiveRequestRepository
                    .createQueryBuilder("archive_request")
                    .leftJoinAndSelect("archive_request.teacher","teacher")
                    .where("archive_request.id = :id",{id:id})
                    .andWhere("archive_request.establishment = :id_ets",{id_ets:estab.id})
                    .getOne();

        if (archiveRequest) {
            const result = await this.archiveRequestRepository.delete(id);
                return id;
        } 
        else {
            throw new ArchiveRequestWithThatIDNotExistsException(id,id_ets);
        }

    } 
            

    
   

}



