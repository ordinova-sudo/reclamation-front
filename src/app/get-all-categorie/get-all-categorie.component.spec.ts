import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllCategorieComponent } from './get-all-categorie.component';

describe('GetAllCategorieComponent', () => {
  let component: GetAllCategorieComponent;
  let fixture: ComponentFixture<GetAllCategorieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetAllCategorieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
