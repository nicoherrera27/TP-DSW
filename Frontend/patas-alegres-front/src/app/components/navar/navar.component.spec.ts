import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavarComponent } from './navar.component';

describe('NavarComponent', () => {
  let component: NavarComponent;
  let fixture: ComponentFixture<NavarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
