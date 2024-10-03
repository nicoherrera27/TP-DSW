import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelterComponent } from './shelter.component';

describe('ShelterComponent', () => {
  let component: ShelterComponent;
  let fixture: ComponentFixture<ShelterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShelterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShelterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
