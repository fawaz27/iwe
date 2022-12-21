import { Column ,Entity, PrimaryGeneratedColumn,OneToMany  } from 'typeorm'
import { Establishment } from './establishment.entity';
import { Textbook } from './textbook.entity';
import { Schedule } from './schedule.entity';

@Entity()
export class Year_Academic{
    @PrimaryGeneratedColumn()
    id:number;
    
    @Column()
    year: string;

    @OneToMany( ()=> Textbook, (textbook: Textbook) => textbook.year_academic)
    textbooks: Textbook[];

    @OneToMany( ()=> Schedule, (schedule: Schedule) => schedule.year)
    schedules: Schedule[];

    @OneToMany(()=>Establishment, (ets:Establishment)=> ets.year)
    etablishments:Establishment[];

    
}