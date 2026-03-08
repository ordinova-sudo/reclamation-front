import { Component, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-cycle-de-vie',
  standalone: true,
  imports: [],
  templateUrl: './cycle-de-vie.component.html',
  styleUrl: './cycle-de-vie.component.css'
})
export class CycleDeVieComponent {


  @Input() message: string = '';

  constructor() {
    console.log('Constructor : composant créé, message =', this.message);
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges : changement détecté', changes);
  }

  ngOnInit() {
    console.log('ngOnInit : composant initialisé, message =', this.message);
  }

  ngOnDestroy() {
    console.log('ngOnDestroy : composant va être détruit');
  }
}
