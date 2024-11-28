import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreedComponent } from './breed.component';

describe('BreedComponent', () => {
  let component: BreedComponent;
  let fixture: ComponentFixture<BreedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BreedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
