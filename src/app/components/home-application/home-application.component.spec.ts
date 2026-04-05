import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeApplicationComponent } from './home-application.component';

describe('HomeApplicationComponent', () => {
  let component: HomeApplicationComponent;
  let fixture: ComponentFixture<HomeApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeApplicationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
