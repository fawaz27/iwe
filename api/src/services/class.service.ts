import { AppDataSource } from '../database/AppDataSource';
import { Class } from '../models/class.entity';
import CreateClassDto from '../dto/class.dto';
import InternalErrorException from '../exceptions/InternalErrorException';
import NoClassFoundException from '../exceptions/class/NoClassFoundException';
import ClassWithThatNameInEstablishmentAlreadyExistsException from '../exceptions/class/ClassWithThatNameAndYearAlreadyExistsException';
import { Establishment } from '../models/establishment.entity';
import EstablishmentWithThatIDNotExistsException from '../exceptions/establishment/EstablishmentWithThatIDNotExistsException';
import NoClassFoundInEstablishmentException from '../exceptions/class/NoClassFoundExceptionInEstablishment';
import ClassWithThatIDNotExistsInEstablishmentException from '../exceptions/class/ClassWithThatIDNotExistsInEstablishmentException';

export class ClassService {

    public classRepository;
    public etsRepository;
    

    constructor(){
        
        this.classRepository=AppDataSource.getRepository(Class);
        this.etsRepository=AppDataSource.getRepository(Establishment);
        
    }

    public async getAllClasses(){


        const classes = await this.classRepository
                .createQueryBuilder("class")
                .leftJoinAndSelect("class.etablishment","etablishment")
                .getMany();
        if (classes && classes.length!=0) {
            return classes;
        } 
        else {
            throw new NoClassFoundException();
        }
    }

    public async getAllClassesInEstablishment(id_ets:number){

        const establishment = await this.etsRepository.findOneBy({id:id_ets});

        if (establishment) {

            const classes = await this.classRepository
                    .createQueryBuilder("class")
                    .leftJoinAndSelect("class.etablishment","etablishment")
                    .where("etablishment.id = :id_ets",{id_ets:id_ets})
                    .getMany();
            if (classes && classes.length!=0) {
                return classes;
            } 
            else {
                throw new NoClassFoundInEstablishmentException(establishment.name);
            }
        } 
        else {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }
            
    }

    
    public async createClass(id_ets:number,classe:CreateClassDto){
        
        const establishment = await this.etsRepository.findOneBy({id:id_ets});

        if (establishment) {

            const isAlreadyExist =  await this.classRepository
                .createQueryBuilder("class")
                .leftJoinAndSelect("class.etablishment","etablishment")
                .where("class.name = :name ",{name:classe.name})
                .andWhere("etablishment.id = :id_ets",{id_ets:id_ets})
                .getOne();
   
            if (isAlreadyExist) {
                    throw new ClassWithThatNameInEstablishmentAlreadyExistsException(classe.name,isAlreadyExist.etablishment.name);
                
            } 
            else{
                    
                    const newClass =   new Class() ;
                    newClass.name=classe.name;
                    newClass.etablishment=establishment;
                    const created = await this.classRepository.save(newClass);
                    // console.log(created);
                    if (created) {
                        return created;

                    } else {
                        throw new InternalErrorException();
                        
                    }
            }  

        } 
        else {
            throw new EstablishmentWithThatIDNotExistsException(id_ets);
        }
        
        
    }


    public async getClasseById(id_ets:number,id_class:number){
        const establishment = await this.etsRepository.findOneBy({id:id_ets});
        
        if (establishment) {
            const classe = await this.classRepository
                .createQueryBuilder("class")
                .leftJoinAndSelect("class.etablishment","etablishment")
                .where("class.id = :id_class ",{id_class:id_class})
                .andWhere("etablishment.id = :id_ets",{id_ets:id_ets})
                .getOne();

            if (classe) {
                return classe;
            } 
            else {
                throw  new ClassWithThatIDNotExistsInEstablishmentException(id_class,establishment.name);
            }
        } 
        else {
            throw  new EstablishmentWithThatIDNotExistsException(id_ets);
        }
        
        
    }


    public async updateClasse(id_ets:number,classe:CreateClassDto,id_class:number){
        const establishment = await this.etsRepository.findOneBy({id:id_ets});

        if (establishment) {

            const isAlreadyExist =  await this.classRepository
                .createQueryBuilder("class")
                .leftJoinAndSelect("class.etablishment","etablishment")
                .where("class.name = :name ",{name:classe.name})
                .andWhere("etablishment.id = :id_ets",{id_ets:id_ets})
                .getOne();
   
            if (isAlreadyExist && isAlreadyExist.id!=id_class) {
                    throw new ClassWithThatNameInEstablishmentAlreadyExistsException(classe.name,isAlreadyExist.etablishment.name);
                
            }

            const classeUpdate =  await this.classRepository
                    .createQueryBuilder("class")
                    .leftJoinAndSelect("class.etablishment","etablishment")
                    .where("class.id = :id_class ",{id_class:id_class})
                    .andWhere("etablishment.id = :id_ets",{id_ets:id_ets})
                    .getOne();

            if (classeUpdate) {

                    classeUpdate.name=classe.name;
                    
                    const result = await this.classRepository.save(classeUpdate);
                    if (result) {
                        return result;
                    } 
                    else {
                        throw new InternalErrorException();      
                    } 
            } 
            else {
                throw  new ClassWithThatIDNotExistsInEstablishmentException(id_class,establishment.name);
            }
        } 
        else {
            throw  new EstablishmentWithThatIDNotExistsException(id_ets);
        }
                  
                        
                
            
        


    }


    public async deleteClasse(id_ets:number,id_class:number){

        const establishment = await this.etsRepository.findOneBy({id:id_ets});

        if (establishment) {

            const classe =  await this.classRepository
                    .createQueryBuilder("class")
                    .leftJoinAndSelect("class.etablishment","etablishment")
                    .where("class.id = :id_class ",{id_class:id_class})
                    .andWhere("etablishment.id = :id_ets",{id_ets:id_ets})
                    .getOne();   

            if (classe) {
                const result = await this.classRepository.delete(id_class);
                if (result) {
                    //console.log(result);
                    
                    return id_class;
                    
                } 
                else {
                    throw new InternalErrorException();
                }
            } 
            else {
                throw  new ClassWithThatIDNotExistsInEstablishmentException(id_class,establishment.name);
            }
        }
        else {
            throw  new EstablishmentWithThatIDNotExistsException(id_ets);
        }


    }
}
