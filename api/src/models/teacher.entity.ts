import {Entity,OneToMany ,ManyToMany, JoinTable,Column} from 'typeorm'
import {User} from './user.entity';
import {Subject} from './subject.entity'
import { Archive_request } from './archive_request.entity';
import { Program } from './program.entity';
import { Information } from './information.entity';
import { Establishment } from './establishment.entity';
import { Teacher_Ets } from './teacher_ets.entity';

@Entity()
export class Teacher extends User {  
    
  
    @OneToMany( ()=> Subject, (subject: Subject) => subject.teacher)
    subjects: Subject[];

    

    @OneToMany(()=>Archive_request,(archive:Archive_request)=>archive.teacher)
    public archive_requests:Archive_request[]

    @OneToMany(()=>Program,(program:Program)=>program.teacher)
    public programs:Program[]

    @OneToMany(()=>Information,(information:Information)=>information.teacher)
    public informations:Information[]
   
    @OneToMany(()=>Teacher_Ets,(teacher_ets:Teacher_Ets)=>teacher_ets.teacher)
    public teacher_ets:Teacher_Ets[]    



}





