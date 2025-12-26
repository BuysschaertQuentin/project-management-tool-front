import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AnotherPageComponent } from './another-page.component';

describe('AnotherPageComponent', () => {
  let component: AnotherPageComponent;
  let fixture: ComponentFixture<AnotherPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnotherPageComponent],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnotherPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
