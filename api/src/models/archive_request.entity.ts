import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Teacher } from "./teacher.entity";


@Entity()
export class Archive_request{

    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public contents: string;

    @Column()
    public state : string;

    @Column()
    public type_archivage: string;

    @Column()
    public firstname : string;

    @Column()
    public lastname : string;
    
    @Column()
    public email : string;

    @Column()
    public date_request : string;

    @Column()
    public establishment : number;

    @ManyToOne(()=>Teacher,(teacher:Teacher)=>teacher.archive_requests,{onDelete:'CASCADE'})
    public teacher : Teacher;
}