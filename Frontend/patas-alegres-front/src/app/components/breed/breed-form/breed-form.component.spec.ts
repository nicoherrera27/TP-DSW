import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreedFormComponent } from './breed-form.component';

describe('BreedFormComponent', () => {
  let component: BreedFormComponent;
  let fixture: ComponentFixture<BreedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreedFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
