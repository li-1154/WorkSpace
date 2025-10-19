import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name : 'truncate'})
export class TrunCatePipe implements PipeTransform{
    transform(value: string,limit:number):string{
        return value.substring(0,limit)+"....";
    }
}