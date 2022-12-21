import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Teacher } from "./teacher.entity";


@Entity()
export class Information{

    @PrimaryGeneratedColumn()
    public id : number;

    @Column()
    public contents : string;

    @Column()
    public access : string;

    @Column()
    public establishment : number;

    @Column("int",{array:true})
    public destinataires : number[];

    @ManyToOne(()=>Teacher, (teacher:Teacher)=>teacher.informations,{onDelete:'CASCADE'})
    public teacher : Teacher;


}