import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnCardComponent } from './alumn-card.component';

describe('AlumnCardComponent', () => {
  let component: AlumnCardComponent;
  let fixture: ComponentFixture<AlumnCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlumnCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlumnCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
