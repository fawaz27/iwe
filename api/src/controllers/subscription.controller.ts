import express from 'express';
import SubscriptionDto from '../dto/subscription.dto';
import authMiddleware from '../middlewares/authMiddleware';
import validationMiddleware from '../middlewares/validationMiddleware';
import { SubscriptionService } from '../services/subscription.service';
import { TeacherService } from '../services/teacher.service';


export class SubscriptionController{

    public path = '/subscription'
    public router =express.Router();
    public subscriptionService:SubscriptionService;
    public teacherService:TeacherService

    constructor(){      
        this.subscriptionService = new SubscriptionService();
        this.teacherService = new TeacherService();
        this.initializeRoutes();
    }


    private initializeRoutes()
    {
        this.router
            .all(`${this.path}`,authMiddleware as unknown as (req:express.Request,res:express.Response,net:express.NextFunction)=>{})
            .post(this.path,validationMiddleware(SubscriptionDto),this.sendRequestSubscription);
        
    }





    public sendRequestSubscription = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        

        try {
            
            const RequestData:SubscriptionDto = request.body;
            const emailAdmin = (await this.teacherService.getAdminByEmail(String(process.env.EMAIL_ADMIN))).email;
            const result = await this.subscriptionService.requestSubscription(RequestData,emailAdmin);
            response.status(200).send(result);
        } catch (error) {
            next(error);            
        }
    }


    

    




}