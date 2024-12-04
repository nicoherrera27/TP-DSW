import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RescueFormComponent } from './rescue-form.component';

describe('RescueFormComponent', () => {
  let component: RescueFormComponent;
  let fixture: ComponentFixture<RescueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RescueFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RescueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
