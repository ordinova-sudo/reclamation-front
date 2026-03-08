import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, limite: number =20 ): string {
    
    if (limite> value.length) return value;
    return value.slice(0,limite)+"...";
    
  }

}
