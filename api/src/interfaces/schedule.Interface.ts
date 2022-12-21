import Hourly from "./hourly.interface";

interface ScheduleInteface {
    Monday:Hourly[],
    Tuesday:Hourly[],
    Wednesday:Hourly[],
    Thursday:Hourly[],
    Friday:Hourly[],
    Saturday:Hourly[],
    Sunday:Hourly[],

}

export default ScheduleInteface;