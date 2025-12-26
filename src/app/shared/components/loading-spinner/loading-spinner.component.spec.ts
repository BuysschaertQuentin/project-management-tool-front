import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoadingSpinnerComponent } from './loading-spinner.component';

describe('LoadingSpinnerComponent', () => {
  let component: LoadingSpinnerComponent;
  let fixture: ComponentFixture<LoadingSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSpinnerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default message', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Chargement...');
  });

  it('should display custom message', () => {
    fixture.componentRef.setInput('message', 'Loading data...');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Loading data...');
  });

  it('should have spinner animation', () => {
    const spinner = fixture.nativeElement.querySelector('.animate-spin');
    expect(spinner).toBeTruthy();
  });
});
