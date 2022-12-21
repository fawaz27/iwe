import { AppDataSource } from '../database/AppDataSource';
import { Year_Academic } from '../models/year_academic.entity';
import CreateYearDto from '../dto/year_academic.dto';
import InternalErrorException from '../exceptions/InternalErrorException';
import NoYearFoundException from '../exceptions/year/NoYearFoundException';
import YearWithThatIDNotExistsException from '../exceptions/year/YearWithThatIDNotExistsException';
import YearWithThatNameAlreadyExistsException from '../exceptions/year/YearWithThatNameAlreadyExistsException';
import YearWithThatNameNotExistsException from '../exceptions/year/YearWithThatNameNotExistsException';
import validate_year_academic from '../utils/validator-year_academic';
import FormatYearException from '../exceptions/year/FormatYearException';



export class YearService {

    public yearRepository;


    constructor(){
        
        this.yearRepository=AppDataSource.getRepository(Year_Academic);
        
    }

    public async getAllYears(){


        const years = await this.yearRepository.find();
        if (years && years.length!=0) {
            return years;
        } else {
            throw new NoYearFoundException();
        }
    }


    public async createYear(year:CreateYearDto){

        if (!validate_year_academic(year.year)) {
            throw new FormatYearException();
        }  
        else{

            const isAlreadyExist =  await this.yearRepository
                .createQueryBuilder("year")
                .where("year.year = :name ",{name:year.year})
                .getOne()
   
            if (isAlreadyExist) {
                    throw new YearWithThatNameAlreadyExistsException(year.year);
                
            } 
            else{



                    const newYear =   new Year_Academic() ;
                    newYear.year=year.year.trim();
                    const created = await this.yearRepository.save(newYear);
                    // console.log(created);
                    if (created) {
                        return created;

                    } 
                    else {
                        throw new InternalErrorException();
                        
                    } 
                        
                        
                    
                
            }  
        }
   
    }


    public async getYearById(id:number){
        const year = await this.yearRepository.findOne({  where:{id:id}});

        if (year) {
            return year;
        } 
        else {
            throw  new YearWithThatIDNotExistsException(id);
        }
        
    }

    public async getYearByName(name:string){
        const year = await this.yearRepository.findOne({  where:{year:`${name}`}});

        if (year) {
            return year;
        } 
        else {
            throw  new YearWithThatNameNotExistsException(name);
        }
        
    }


    public async updateYear(year:CreateYearDto,id:number){

        if (!validate_year_academic(year.year)) {
            throw new FormatYearException();
        } 
        else{

            const yearUpdate = await this.yearRepository.findOne({where:{id:id}});

            if (yearUpdate) {

                const isAlreadyExist =  await this.yearRepository
                    .createQueryBuilder("year")
                    .where("year.year = :name ",{name:year.year})
                    .getOne()
    
                if (isAlreadyExist && yearUpdate.year!=year.year) {
                        throw new YearWithThatNameAlreadyExistsException(year.year);
                    
                } 
                else{
                        yearUpdate.year=year.year
                    
                        const result = await this.yearRepository.save(yearUpdate);
                        if (result) {
                            return result;
                        } 
                        else {
                            throw new InternalErrorException();      
                        }   
                }       
                        
                
            } 
            else {
                throw  new YearWithThatIDNotExistsException(id);
            }
        }

        
        


    }


    public async deleteYear(id:number){
        const year = await this.yearRepository.findOneBy({id:id});
        if (year) {
            const result = await this.yearRepository.delete(id);
            if (result) {
                return id;
            } else {
                throw new InternalErrorException();
            }
        } else {
            throw new YearWithThatIDNotExistsException(id);
        }
    }
}