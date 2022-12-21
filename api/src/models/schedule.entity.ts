import { Column ,Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany,OneToOne,JoinColumn} from 'typeorm'
import { Year_Academic } from './year_academic.entity';
import { Class } from './class.entity';
import ScheduleIntefaceDto from '../dto/scheduleInterface.dto';
@Entity()
export class Schedule{
    @PrimaryGeneratedColumn()
    public id: number;

    @Column({type:'jsonb'})
    public schedule: ScheduleIntefaceDto;

    @OneToOne(()=>Class,(classe)=>classe.schedule)
    @JoinColumn()
    classe:Class

    @ManyToOne( ()=> Year_Academic, (Year_Academic : Year_Academic) => Year_Academic.schedules,{onDelete:'CASCADE'})
    year:Year_Academic


}