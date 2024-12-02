import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardianTableComponent } from './guardian-table.component';

describe('GuardianTableComponent', () => {
  let component: GuardianTableComponent;
  let fixture: ComponentFixture<GuardianTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuardianTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuardianTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
