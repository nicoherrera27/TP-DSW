import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelterDetailComponent } from './shelter-detail.component';

describe('ShelterDetailComponent', () => {
  let component: ShelterDetailComponent;
  let fixture: ComponentFixture<ShelterDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShelterDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShelterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
