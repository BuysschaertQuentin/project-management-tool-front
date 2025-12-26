import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertComponent } from './alert.component';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('message', 'Test alert message');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display message', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Test alert message');
  });

  it('should display title if provided', () => {
    fixture.componentRef.setInput('title', 'Alert Title');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Alert Title');
  });

  describe('getAlertClasses', () => {
    it('should return error classes', () => {
      fixture.componentRef.setInput('type', 'error');
      fixture.detectChanges();
      expect(component.getAlertClasses()).toContain('bg-red-50');
    });

    it('should return success classes', () => {
      fixture.componentRef.setInput('type', 'success');
      fixture.detectChanges();
      expect(component.getAlertClasses()).toContain('bg-green-50');
    });

    it('should return warning classes', () => {
      fixture.componentRef.setInput('type', 'warning');
      fixture.detectChanges();
      expect(component.getAlertClasses()).toContain('bg-yellow-50');
    });

    it('should return info classes', () => {
      fixture.componentRef.setInput('type', 'info');
      fixture.detectChanges();
      expect(component.getAlertClasses()).toContain('bg-blue-50');
    });
  });

  it('should emit dismissed when dismissible and close button clicked', () => {
    fixture.componentRef.setInput('dismissible', true);
    fixture.detectChanges();

    const dismissedSpy = jest.fn();
    component.dismissed.subscribe(dismissedSpy);

    const closeButton = fixture.nativeElement.querySelector('button');
    closeButton?.click();

    expect(dismissedSpy).toHaveBeenCalled();
  });
});
