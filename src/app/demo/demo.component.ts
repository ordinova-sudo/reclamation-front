import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Person } from '../person';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from '../truncate.pipe';
import { of } from 'rxjs';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule,TruncatePipe],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export class DemoComponent {

  persons : Person[] =[{nom:"yahya",age:15},{ nom:"salah",age:19}] 
  @Input() title!:string;
  @Output() messageEvent = new EventEmitter<string>();
  prix : number =5.8596;
  trunctaedMessage="angular est un framewok puisant sans limite"
  date : Date =new Date();
  data$ = of("Bonjour Angular");

  @Output() eventMessage = new EventEmitter<string>();

  reaction(){
      this.messageEvent.emit('Bonjour du composant enfant !');
  }

  
  flexe(){
this.eventMessage.emit("goodMornng");
  }
}
