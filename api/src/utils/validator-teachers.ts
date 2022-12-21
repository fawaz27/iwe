import { AppDataSource } from '../database/AppDataSource';
import { Teacher } from '../models/teacher.entity';
import { Teacher_Ets } from '../models/teacher_ets.entity';

export default async function  validator_teachers(value:number[],id_ets:number){
    let id = 0;

   for ( const it of value) {
        const teacher = await AppDataSource.getRepository(Teacher).findOneBy({id:it});
        
        const teacher_ets = await  AppDataSource.getRepository(Teacher_Ets)
            .createQueryBuilder("teacher_ets")
            .leftJoinAndSelect("teacher_ets.teacher","teacher")
            .where("teacher_ets.establishmentId = :establishmentId",{establishmentId:id_ets})
            .andWhere("teacher_ets.teacherId = :teacherId",{teacherId:teacher?.id})
            .getOne();
            
        if (teacher == null || teacher_ets==null) {
            id=it;
            break;
        }
   }
   return id;
}