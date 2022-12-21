import { IsString,IsNotEmpty } from 'class-validator';

class SubscriptionDto
{
    @IsNotEmpty({message: ' please the email is required'})
    @IsString()
    public email: string;

    @IsNotEmpty({message: ' please the establishmentName is required'})
    @IsString()
    public establishmentName : string;


    @IsNotEmpty({message: ' please the years is required'})
    @IsString()
    public years: string;
}


export default SubscriptionDto;