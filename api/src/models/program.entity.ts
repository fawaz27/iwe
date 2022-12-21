import { timingSafeEqual } from "crypto";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Teacher } from "./teacher.entity";


@Entity()
export class Program{
    
    @PrimaryGeneratedColumn()
    public id : number;

    @Column()
    public subject : string;

    @Column()
    public date : string;

    @Column()
    public classe : string;

    @Column()
    public access : string;

    @Column()
    public establishment : number;

    @Column("int",{array:true})
    public destinataires : number[];

    @ManyToOne(()=>Teacher,(teacher:Teacher)=>teacher.programs,{onDelete:'CASCADE'})
    public teacher: Teacher;

}