import { Entity,Column, PrimaryGeneratedColumn,OneToMany,ManyToOne} from 'typeorm'
import { Class } from './class.entity';
import { Session } from './session.entity';
import { Year_Academic } from './year_academic.entity';

@Entity()
export class Textbook{
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public title: string;

    @ManyToOne( ()=> Class, (classe : Class) => classe.textbooks,{onDelete:'CASCADE'})
    public classe:Class;

    
    @OneToMany( ()=> Session, (session: Session) => session.textbook)
    sessions: Session[];

    @ManyToOne( ()=> Year_Academic, (year : Year_Academic) => year.textbooks,{onDelete:'CASCADE'})
    public year_academic:Year_Academic;


}