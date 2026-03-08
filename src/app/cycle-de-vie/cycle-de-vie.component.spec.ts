import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleDeVieComponent } from './cycle-de-vie.component';

describe('CycleDeVieComponent', () => {
  let component: CycleDeVieComponent;
  let fixture: ComponentFixture<CycleDeVieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CycleDeVieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CycleDeVieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
