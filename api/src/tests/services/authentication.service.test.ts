import TokenData from "../../interfaces/tokenData.interface";
import CreateUserDto from "../../dto/user.dto";
import UserWithThatEmailAlreadyExistsException from "../../exceptions/teacher/TeacherWithThatEmailAlreadyExistsException";
import { AuthentificationService } from "../../services/authentification.service";
import logInDto from "../../dto/login.dto";
import WrongCredentialsException from "../../exceptions/WrongCredentialsException";
import bcrypt from 'bcrypt';
import { Teacher } from "../../models/teacher.entity";
import jwt from 'jsonwebtoken';
import DataStoredInToken from "../../interfaces/dataStoredInToken.interface";
describe('The Authentifiction Service' ,()=>{
     
    let authentificationService:AuthentificationService ;

    beforeEach(()=>{
        authentificationService = new AuthentificationService();
        authentificationService.teacherRepository.findOne = jest.fn();
        authentificationService.teacherRepository.create = jest.fn();
        authentificationService.teacherRepository.save = jest.fn();
        bcrypt.compare = jest.fn();
    })
    
    
    
    describe('when registering a user', () => {
        describe('if the email is already taken', () => {
            it('should throw an error', async () => {

                const userData: CreateUserDto = {
                    lastName: 'John ',
                    firstName:'Smith',
                    email: 'john@smith.com',
                    hashPassword: 'strongPassword123',
                    phone:'95661715',
                    role:'user'
                };

                (authentificationService.teacherRepository.findOne as any).mockReturnValue(userData);
                
                await expect(authentificationService.register(userData))
                        .rejects.toMatchObject(new UserWithThatEmailAlreadyExistsException(userData.email));
            });
        });

        describe('if the email is not taken',()=>{
            it('should not throw an error',async()=>{
                const userData: CreateUserDto = {
                    lastName: 'John',
                    firstName:'Smith',
                    email: 'john@smith.com',
                    hashPassword: 'strongPassword123',
                    phone:'95661715',
                    role:'user'
                };
                (authentificationService.teacherRepository.findOne as any).mockReturnValue(undefined); 
                (authentificationService.teacherRepository.create as any).mockReturnValue({...userData});
                (authentificationService.teacherRepository.save as any).mockReturnValue({...userData,id:0});
                
                const result = await authentificationService.register(userData);
                expect(result.email).toEqual({...userData, id: 0}.email);
                expect(result.lastName).toEqual({...userData, id: 0}.lastName);
                expect(result.firstName).toEqual({...userData, id: 0}.firstName);
                expect(result.phone).toEqual({...userData, id: 0}.phone);
                expect(result.role).toEqual({...userData, id: 0}.role);
                expect(result.id).toEqual({...userData, id: 0}.id);
            })

        })

    });
    describe('when create a token ',()=> {
        it('should create a valid token', () => {
            
            const user = new Teacher();
            const secret =  "process.env.JWT_KEY";
            const expiresIn = 3600;
            user.id = 1;
            const tokenData = authentificationService.createToken(user,secret,expiresIn);
            expect(tokenData).toHaveProperty('expiresIn');
            expect(tokenData).toHaveProperty('token');
            expect(typeof tokenData.token).toBe('string');
            expect(typeof tokenData.expiresIn).toBe('number');
            expect(tokenData.expiresIn).toEqual(expiresIn);
        });
        
        it('should store user id in the token', () => {
        
            const user = new Teacher();
            user.id = 1;    
            const secret =  "process.env.JWT_KEY";
            const expiresIn = 3600;
            const tokenData = authentificationService.createToken(user,secret,expiresIn); 
            const decodedToken = jwt.verify(tokenData.token, secret as string) as DataStoredInToken;
            expect(decodedToken).toHaveProperty('_id');
            expect(decodedToken._id).toBe(String(user.id));
        });
    
    });

    describe('when create a cookie ',()=>{
        const tokenData : TokenData ={
            token:'',
            expiresIn:1
        };
        it('should return a string ',()=>{   
            expect(typeof authentificationService.createCookie(tokenData)).toEqual('string');
        })

    });


    describe('when a user login',()=>{
        describe('when the user provided wrong credentials',()=>{
            const loginData:logInDto = {
                    email: 'john@smith.com',
                    password : 'strongPassword123'
            };
            const userData: CreateUserDto = {
                lastName: 'John',
                firstName:'Smith',
                email: 'john@smith.com',
                hashPassword: 'strongPassword123',
                phone:'95661715',
                role:'user'
            };

            describe('when email is wrong',()=>{
                it('should throw an error',async()=>{
                    (authentificationService.teacherRepository.findOne as any).mockReturnValue(undefined);
                    await expect(authentificationService.logIn(loginData))
                            .rejects.toMatchObject(new WrongCredentialsException());
                });

            });
            describe('when email is right and password is wrong',()=>{
                it('should throw an error',async()=>{
                    (authentificationService.teacherRepository.findOne as any).mockReturnValue(userData);
                    (bcrypt.compare as any).mockReturnValue(false);
                    await expect(authentificationService.logIn(loginData))
                            .rejects.toMatchObject(new WrongCredentialsException());
                });
            });
            describe('when email and password is wrong',()=>{
                it('should throw an error',async()=>{
                    (authentificationService.teacherRepository.findOne as any).mockReturnValue(undefined);
                    (bcrypt.compare as any).mockReturnValue(false);
                    await expect(authentificationService.logIn(loginData))
                            .rejects.toMatchObject(new WrongCredentialsException());
                });
            });
        });

        describe('when user provided correct credentials',()=>{
            it('should not throw an error',async()=>{
                const loginData:logInDto = {
                    email: 'john@smith.com',
                    password : 'strongPassword123'
                };
                const userData: CreateUserDto = {
                    lastName: 'John',
                    firstName:'Smith',
                    email: 'john@smith.com',
                    hashPassword: 'strongPassword123',
                    phone:'95661715',
                    role:'user'
                };
                (authentificationService.teacherRepository.findOne as any).mockReturnValue({...userData,id:0});
                (bcrypt.compare as any).mockReturnValue(true);
                
                const result = await authentificationService.logIn(loginData);

                expect(result).toEqual({
                    cookie : expect.any(String),
                    result: {
                        id: expect.any(Number),
                        firstName: 'Smith',
                        lastName: 'John',
                        email: 'john@smith.com',
                        hashPassword: '',
                        phone:'95661715',
                        role:'user'
                    },

                })




            });
        });
    });

    describe('when a user logout',()=>{
        it('should return a string ',()=>{   
            expect(typeof authentificationService.logOut()).toEqual('string');
        })
    });
})