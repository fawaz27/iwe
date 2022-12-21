import 'dotenv/config';
import 'reflect-metadata';
import App from './app';
import { AppDataSource } from './database/AppDataSource';
import { AuthentificationController } from './controllers/authentification.controller';
import {TeacherController} from './controllers/teacher.controller'
import {ClassController} from './controllers/class.controller'
import {SubjectController} from './controllers/subject.controller'
import { TextbookController } from './controllers/textbook.controller';
import { YearController } from './controllers/year.controller';
import { SessionController } from './controllers/session.controller';
import { TaskController } from './controllers/task.controller';
import { EstablishmentController } from './controllers/establishment.controller';
import { ArchiveRequestController } from './controllers/archive_request.controller';
import { ProgramController } from './controllers/program.controller';
import { InformationController } from './controllers/information.controller';
import { SubscriptionController } from './controllers/subscription.controller';
import { UtilsController } from './controllers/utils.controller';
import { SubjectsEtsController } from './controllers/subject_ets.controller';
import { ScheduleController } from './controllers/schedule.controller';


(async () => {


    try {
      await AppDataSource.initialize();
      
      
    } catch (error) {
      console.log('Error while connecting to the database', error);
      return error;
    }
    
    const app = new App([
      new AuthentificationController(),
      new TeacherController(),
      new ClassController(),
      new SubjectController(),
      new TextbookController(),
      new YearController(),
      new SessionController(),
      new TaskController(),
      new ScheduleController(),
      new EstablishmentController(),
      new ArchiveRequestController(),
      new ProgramController(),
      new InformationController(),
      new SubscriptionController(),
      new UtilsController(),
      new SubjectsEtsController()
    ]);
    
    
    app.listen();
    app.get();
    
    
    
})();