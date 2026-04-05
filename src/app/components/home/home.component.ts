import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit,OnDestroy{



  mailBoxSubscription : any;
  ngOnInit(): void {}
  ngOnDestroy(): void {}

}
