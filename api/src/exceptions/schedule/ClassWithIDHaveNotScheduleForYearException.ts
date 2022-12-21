import { HttpException } from "../HttpException";



class ClassWithIDHaveNotScheduleForYearException extends HttpException
{

    constructor(id: number, year:string )
    {
        super(404, `Class with id ${id} have not  Schedule for year ${year}`);
    }
}

export default ClassWithIDHaveNotScheduleForYearException;
