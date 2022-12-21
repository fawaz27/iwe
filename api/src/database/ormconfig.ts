import { DataSourceOptions } from 'typeorm';

import { Year_Academic } from '../models/year_academic.entity'
import { Textbook } from '../models/textbook.entity';
import { Class } from '../models/class.entity';
import { Teacher } from '../models/teacher.entity'
import { Subject } from '../models/subject.entity';
import { Session } from '../models/session.entity';
import { Task } from '../models/task.entity';
import { Schedule } from "../models/schedule.entity";
import { Archive_request } from "../models/archive_request.entity";
import { Information } from "../models/information.entity";
import { Program } from "../models/program.entity";
import { Establishment } from "../models/establishment.entity";
import { Teacher_Ets } from "../models/teacher_ets.entity";
import { Subject_Ets } from '../models/subject_ets.entity';

const config: DataSourceOptions = {
    type: 'postgres',
    host: process.env.HOST,
    port: Number(process.env.PORT_DB),
    username: process.env.USERNAME_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.NAME_DB,
    entities: [
     Teacher,
     Subject,
     Session,
     Class,
     Textbook,
     Task,
     Year_Academic,
     Schedule,
     Archive_request,
     Information,
     Program,
     Establishment,
     Teacher_Ets,
     Subject_Ets
    ],
    synchronize: true,
    
};
 
export default config;