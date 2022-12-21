

 export default function validate_date(value:string){
    return isDate(value);
}

function isDate(value:string){

    let isValidDate = Date.parse(value);
    if (isNaN(isValidDate))
        return false;    
    else
        return true;
}