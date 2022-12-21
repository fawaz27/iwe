import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Class } from "./class.entity";
import { Subject_Ets } from "./subject_ets.entity";
import { Teacher_Ets } from "./teacher_ets.entity";
import { Year_Academic } from "./year_academic.entity";


@Entity()
export class Establishment{
    @PrimaryGeneratedColumn()
    public id : number;

    @Column()
    public name : string;

    @OneToMany(()=>Class, (classe:Class)=>classe.etablishment)
    classes: Class[];

    @OneToMany(()=>Subject_Ets, (subject_ets:Subject_Ets)=>subject_ets.etablishment)
    subject_ets: Subject_Ets[];


    @ManyToOne( ()=> Year_Academic, (year : Year_Academic) => year.etablishments,{onDelete:'CASCADE'})
    public year:Year_Academic;

    @OneToMany(()=>Teacher_Ets,(teacher_ets:Teacher_Ets)=>teacher_ets.establishment)
    public teacher_ets:Teacher_Ets[] 
}