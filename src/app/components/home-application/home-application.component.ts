import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-application',
  standalone: true,
  imports: [ RouterModule  ],
  templateUrl: './home-application.component.html',
  styleUrl: './home-application.component.css'
})
export class HomeApplicationComponent {

  imageUrl: string = '/tunisiaMap.webp';
  selectedMenu: string = 'home';

  selectMenu(menu: string) {
    this.selectedMenu = menu;
  }

}
