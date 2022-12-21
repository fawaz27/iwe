import { AppDataSource } from '../database/AppDataSource';
import { Teacher } from '../models/teacher.entity'
import CreateTeacherDto from '../dto/teacher.dto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserWithThatEmailAlreadyExistsException from '../exceptions/teacher/TeacherWithThatEmailAlreadyExistsException';
import WrongCredentialsException from '../exceptions/WrongCredentialsException';
import TokenData from '../interfaces/tokenData.interface';
import DataStoredInToken from '../interfaces/dataStoredInToken.interface';
import InternalErrorException from '../exceptions/InternalErrorException';
import logInDto from '../dto/login.dto';

export class AuthentificationService{

    public teacherRepository=AppDataSource.getRepository(Teacher);
    
    constructor(){
        
        this.teacherRepository=AppDataSource.getRepository(Teacher);
        
    }


    public async register (teacher:CreateTeacherDto){
        
        
        const result = await this.teacherRepository.findOne( {where:{email:teacher.email}}  );

        if (result) {
            throw new UserWithThatEmailAlreadyExistsException(teacher.email);

        } 
        else {

            const hashedPassword = await bcrypt.hash(teacher.hashPassword, 10);

            teacher.hashPassword=hashedPassword;
            
            const newTeacher = this.teacherRepository.create(teacher);
            let created = await this.teacherRepository.save(newTeacher); 
            created.hashPassword="";
            //console.log(created);
            return created ;            
           
            // if (created) {
            //     return created;
            // }
            // else{
            //     throw new InternalErrorException();
            // }

            
    
        }
    }

    public async logIn(login:logInDto){
        //console.log(login);
        
        const result = await this.teacherRepository.findOne(({where:{email:`${login.email}`}}));
        //console.log(result);
        if (result) {
            const isPassword = await bcrypt.compare(login.password,result.hashPassword);
            
            if (isPassword) {
                result.hashPassword="";
                const tokenData = this.createToken(result,`${process.env.JWT_KEY}`,3600);
                const cookie = this.createCookie(tokenData);
                
                return {cookie,result};

            } 
            else {
                throw new WrongCredentialsException();
            }

            
        }
        else{
            throw new WrongCredentialsException();
        }


    }

    public logOut(){
        return 'Authorization=;Max-age=0';
    }

    public createToken(user: Teacher,secret :string,expiresIn:number)
    {
        const dataStoredInToken:DataStoredInToken= {
            _id: String(user.id) ,
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken,secret as string,{ expiresIn }),
        };
    }

    public createCookie(tokenData: TokenData )
    {
        return `Authorization = ${tokenData.token}; HttpOnly; Max-Age = ${tokenData.expiresIn}`;
    }

}

