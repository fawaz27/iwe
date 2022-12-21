import request from 'supertest';
import App from '../../app';
import { AuthentificationController } from '../../controllers/authentification.controller';
import logInDto from '../../dto/login.dto';
import CreateUserDto from '../../dto/user.dto';
import bcrypt from 'bcrypt';
import TokenData from '../../interfaces/tokenData.interface';

describe('The AuthenticationController', () => {
	let app:App;
	let authenticationController:AuthentificationController;
	
	beforeEach(async () => {

		authenticationController = new AuthentificationController();
		app = new App([authenticationController]);
		
		authenticationController.authService.teacherRepository.findOne = jest.fn();
        authenticationController.authService.teacherRepository.create = jest.fn();
        authenticationController.authService.teacherRepository.save = jest.fn();
		authenticationController.authService.createCookie = jest.fn();
		bcrypt.compare = jest.fn();

	});
	
	describe('POST /auth/register', () => {
		describe('if the email is not taken', () => {
			it('should return a 201 status and the created teacher', async() => {
				const userData: CreateUserDto = {
					lastName: 'John ',
					firstName:'Smith',
					email: 'john@smith.com',
					hashPassword: 'strongPassword123',
					phone:'95661715',
					role:'user'
				};

				(authenticationController.authService.teacherRepository.findOne as any).mockReturnValue(undefined);
				(authenticationController.authService.teacherRepository.create as any).mockReturnValue({...userData});
				(authenticationController.authService.teacherRepository.save as any).mockReturnValue({...userData,id:0});

				const response = await request(app.getServer())
					.post(`${authenticationController.path}/register`)
					.send(userData);
				let result = {...userData,id:0};
				result.hashPassword="";
				expect(response.status).toBe(201);
				expect(response.body).toEqual(result);
			});		
		});

		describe('if the email is taken', () => {
			it('should return a 400 status and an error message', async() => {
				const userData: CreateUserDto = {
					lastName: 'John ',
					firstName:'Smith',
					email: 'john@smith.com',
					hashPassword: 'strongPassword123',
					phone:'95661715',
					role:'user'
				};

				const foundData : CreateUserDto = {
					lastName: 'CHABI BOUKARI',
					firstName:'Fawaz',
					email: 'john@smith.com',
					hashPassword: 'Password123',
					phone:'53896065',
					role:'user'
				};

				(authenticationController.authService.teacherRepository.findOne as any).mockReturnValue({...foundData,id:0});
				const response = await request(app.getServer())
					.post(`${authenticationController.path}/register`)
					.send(userData);

				expect(response.status).toBe(400);
				expect(response.body.message).toEqual(`Teacher with email ${userData.email} already exists`);

			})
		});
		
		describe('if the request is invalid', () => {
			it('should return a 400 status and an error message', async() => {
				const userData = {
					lastName: 'John ',
					email: 'john@smith.com',
					hashPassword: 'strongPassword123',
					phone:'95661715',
					role:'user'	
				};

				const response = await request(app.getServer())
					.post(`${authenticationController.path}/register`)
					.send(userData);

				expect(response.status).toBe(400);
				expect(response.body.message).toEqual("firstName must be a string");
			});	
		});
	});

	describe('POST /auth/login', () => {
		describe('if right credentials are provided ', () => {
			it('should return a 200 status, validate headers and the result of the login', async()=>{
				const login :logInDto = {
					email: 'john@smith.com',
					password: 'strongPassword123'
				};
				const userData: CreateUserDto = {
					lastName: 'John ',
					firstName:'Smith',
					email: 'john@smith.com',
					hashPassword: 'strongPassword123',
					phone:'95661715',
					role:'user'
				};
				(authenticationController.authService.teacherRepository.findOne as any).mockReturnValue({...userData,id:0}); 
				(bcrypt.compare as any).mockReturnValue(true);
				const tokenData:TokenData = {
					token :"codetoken",
					expiresIn:3600
				};
				const cookie:string = `Authorization = ${tokenData.token}; HttpOnly; Max-Age = ${tokenData.expiresIn}`;
				(authenticationController.authService.createCookie as any).mockImplementation(()=>cookie);
				
				const response = await request(app.getServer())
						.post(`${authenticationController.path}/login`)
						.send(login);
				
				let result = {...userData,id:0};
				result.hashPassword = "";
	
				expect(response.status).toBe(200);
				expect(response.body).toEqual(result);
				expect(response.headers).toHaveProperty('set-cookie');
				expect(response.headers['set-cookie']).toEqual([`Authorization = ${tokenData.token}; HttpOnly; Max-Age = 3600`]);
			})
		});
		describe('if wrong credentials are provided ', () => {

			const loginData:logInDto = {
				email: 'fa@smith.com',
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
				it('should return a 401 status',async()=>{
					(authenticationController.authService.teacherRepository.findOne as any).mockReturnValue(undefined);
					
					const response = await request(app.getServer())
						.post(`${authenticationController.path}/login`)
						.send(loginData);

					expect(response.status).toBe(401);
					expect(response.body.message).toEqual("Wrong credentials provided.");
				})
			});

			describe('when email is right and password is wrong ',()=>{
				it('should return a 401 status',async()=>{
					(authenticationController.authService.teacherRepository.findOne as any).mockReturnValue({...userData,id:0});
					(bcrypt.compare as any).mockReturnValue(false);

					const response = await request(app.getServer())
						.post(`${authenticationController.path}/login`)
						.send(loginData);

					expect(response.status).toBe(401);
					expect(response.body.message).toEqual("Wrong credentials provided.");
				})
			});
			
		})

		describe('if the request is invalid', () => {
			it('should return a 400 status and an error message', async() => {
				const loginData = {
					email: 'john@smith.com',	
				};
				const userData: CreateUserDto = {
					lastName: 'John ',
					firstName:'Smith',
					email: 'john@smith.com',
					hashPassword: 'strongPassword123',
					phone:'95661715',
					role:'user'
				};

				(authenticationController.authService.teacherRepository.findOne as any).mockReturnValue({...userData,id:0}); 
				(bcrypt.compare as any).mockReturnValue(true);

				const response = await request(app.getServer())
					.post(`${authenticationController.path}/login`)
					.send(loginData);

				expect(response.status).toBe(400);
				expect(response.body.message).toEqual("password must be a string, please the email is required");
			});	
		});
	});

	describe('POST /auth/logout', () => {
		it('should return a 200 status and log out an authenticated user', async () => {

			const response = await request(app.getServer())
					.post(`${authenticationController.path}/logout`)
					.send();

			expect(response.status).toBe(200);
			expect(response.headers).toHaveProperty('set-cookie');
			expect(response.headers['set-cookie']).toEqual(['Authorization=;Max-age=0']);
		});
	});
});