import { IsNumber, IsString } from "class-validator";

class HourlyDto {
    
   @IsString()
   public slices:string;
   @IsString()
   public subject:string;
   @IsNumber()
   public id_subject:number;
      
}

export default HourlyDto;