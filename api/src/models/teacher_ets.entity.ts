import {Entity, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm'
import { Establishment } from './establishment.entity';
import { Teacher } from './teacher.entity';


@Entity()
export class Teacher_Ets{
    
    @PrimaryColumn()
    public teacherId: number;


    @PrimaryColumn()
    public establishmentId: number;

    @ManyToOne( ()=> Teacher, (teacher : Teacher) => teacher.teacher_ets,{onDelete:'CASCADE'})
    @JoinColumn({name:"teacherId"})
    public teacher:Teacher;

    @ManyToOne( ()=> Establishment, (establishmentId : Establishment) => establishmentId.teacher_ets,{onDelete:'CASCADE'})
    @JoinColumn({name:"establishmentId"})
    public establishment:Establishment;

    @PrimaryColumn()
    public role: string;

    

}