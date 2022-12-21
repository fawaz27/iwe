import { Repository } from "typeorm";
import { AppDataSource } from "../database/AppDataSource";
import SubscriptionDto from "../dto/subscription.dto";
import TeacherWithThatEmailNotExistsException from "../exceptions/teacher/TeacherWithThatEmailNotExistsException";
import { Teacher } from "../models/teacher.entity";
import EmailService from "./email.service";



export class SubscriptionService{

    private emailService:EmailService;
    private teacherRepository:Repository<Teacher>;
    
    constructor(){
        this.emailService = new EmailService();
        this.teacherRepository=AppDataSource.getRepository(Teacher);
    }

    public async requestSubscription(requestSubscription:SubscriptionDto,emailAdmin:string){

        const teacher =  await this.teacherRepository.findOneBy({email:`${requestSubscription.email}`});

        if (teacher == null) 
            throw new TeacherWithThatEmailNotExistsException(requestSubscription.email);

        const text = `User with name ${teacher.firstName} ${teacher.lastName} and mail ${teacher.email}  submit a subscription request for the establishment "${requestSubscription.establishmentName}" for the academic year(s) "${requestSubscription.years}".`;

        const info = await this.emailService.sendMail({
            from:`"IWE" <${process.env.EMAIL_USER}>`,
            to: emailAdmin,
            subject: "Subscription request",
            text: text
        });

        return info;
    }
}