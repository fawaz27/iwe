import { Column ,Entity, PrimaryGeneratedColumn ,ManyToOne, OneToMany} from 'typeorm'
import { Establishment } from './establishment.entity';
import { Subject } from './subject.entity';

@Entity()
export class Subject_Ets{
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public name: string;

    @ManyToOne(()=> Establishment, (ets:Establishment)=>ets.subject_ets,{onDelete:'CASCADE'})
    etablishment : Establishment;

    @OneToMany(()=>Subject,(subject:Subject)=>subject.subject_ets)
    subjects:Subject[] 


}