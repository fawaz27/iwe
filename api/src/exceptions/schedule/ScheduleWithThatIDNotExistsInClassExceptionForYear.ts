import { HttpException } from "../HttpException";



class ScheduleWithThatIDNotExistsInClassForYearException extends HttpException
{

    constructor(id: number,classname:string,yearAcademic:string)
    {
        super(404, `There is no Schedule with id ${id}  in class ${classname} for yearAcademic ${yearAcademic} `);
    }
}

export default ScheduleWithThatIDNotExistsInClassForYearException;
