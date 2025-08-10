import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmingAdvisor } from './farming-advisor';

describe('FarmingAdvisor', () => {
  let component: FarmingAdvisor;
  let fixture: ComponentFixture<FarmingAdvisor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FarmingAdvisor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmingAdvisor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
