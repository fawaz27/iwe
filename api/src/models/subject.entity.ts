import { Column ,Entity ,ManyToOne,OneToMany, JoinColumn, PrimaryColumn} from 'typeorm'
import { Teacher} from './teacher.entity'
import { Session } from './session.entity';
import { Class } from './class.entity';
import { Subject_Ets } from './subject_ets.entity';

@Entity()
export class Subject{
    @PrimaryColumn()
    public subjectId: number;

    @PrimaryColumn()
    public classeId: number;

    @Column()
    public name: string;

    @Column()
    public quota_hours:number;

    @Column()
    public hourly_billing: number;
    
    @OneToMany( ()=> Session, (session: Session) => session.subject)
    sessions: Session[];

    @ManyToOne( ()=> Teacher, (teacher : Teacher) => teacher.subjects)
    public teacher: Teacher;

    @ManyToOne( ()=> Class, (classe : Class) => classe.subjects,{onDelete:'CASCADE'})
    @JoinColumn({name:"classeId"})
    public classe:Class;

    @ManyToOne( ()=> Subject_Ets, (subject_ets : Subject_Ets) => subject_ets.subjects,{onDelete:'CASCADE'})
    @JoinColumn({name:"subjectId"})
    public subject_ets:Subject_Ets;


}