import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdoptAnimalComponent } from './adopt-animal.component';

describe('AdoptAnimalComponent', () => {
  let component: AdoptAnimalComponent;
  let fixture: ComponentFixture<AdoptAnimalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdoptAnimalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdoptAnimalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
