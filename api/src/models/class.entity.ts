import { Column ,Entity, PrimaryGeneratedColumn, OneToMany, OneToOne, ManyToOne} from 'typeorm'
import { Textbook } from './textbook.entity';
import { Subject } from './subject.entity';
import { Schedule } from './schedule.entity';
import { Establishment } from './establishment.entity';
@Entity()
export class Class{
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @OneToMany( ()=> Textbook, (textbook: Textbook) => textbook.classe)
    textbooks: Textbook[];

    @OneToMany( ()=> Subject, (subject: Subject) => subject.classe)
    subjects: Subject[];

    @ManyToOne(()=> Establishment, (ets:Establishment)=>ets.classes,{onDelete:'CASCADE'})
    etablishment : Establishment;
    

    @OneToOne(()=>Schedule, (schedule)=>schedule.classe)
    schedule:Schedule;


}