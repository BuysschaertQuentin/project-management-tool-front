import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmModalComponent } from './confirm-modal.component';

describe('ConfirmModalComponent', () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;

    // Set required inputs
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.componentRef.setInput('message', 'Test Message');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title and message', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Test Title');
    expect(compiled.textContent).toContain('Test Message');
  });

  it('should emit confirm event when confirm button clicked', () => {
    const confirmSpy = jest.fn();
    component.confirm.subscribe(confirmSpy);

    const confirmButton = fixture.nativeElement.querySelectorAll('button')[1];
    confirmButton.click();

    expect(confirmSpy).toHaveBeenCalled();
  });

  it('should emit cancel event when cancel button clicked', () => {
    const cancelSpy = jest.fn();
    component.cancel.subscribe(cancelSpy);

    const cancelButton = fixture.nativeElement.querySelectorAll('button')[0];
    cancelButton.click();

    expect(cancelSpy).toHaveBeenCalled();
  });

  describe('getIconBgClass', () => {
    it('should return red class for danger type', () => {
      fixture.componentRef.setInput('type', 'danger');
      fixture.detectChanges();
      expect(component.getIconBgClass()).toBe('bg-red-100');
    });

    it('should return yellow class for warning type', () => {
      fixture.componentRef.setInput('type', 'warning');
      fixture.detectChanges();
      expect(component.getIconBgClass()).toBe('bg-yellow-100');
    });

    it('should return blue class for info type', () => {
      fixture.componentRef.setInput('type', 'info');
      fixture.detectChanges();
      expect(component.getIconBgClass()).toBe('bg-blue-100');
    });
  });

  describe('getIconClass', () => {
    it('should return red text for danger type', () => {
      fixture.componentRef.setInput('type', 'danger');
      fixture.detectChanges();
      expect(component.getIconClass()).toBe('text-red-600');
    });

    it('should return yellow text for warning type', () => {
      fixture.componentRef.setInput('type', 'warning');
      fixture.detectChanges();
      expect(component.getIconClass()).toBe('text-yellow-600');
    });
  });

  describe('getConfirmButtonClass', () => {
    it('should return red button for danger type', () => {
      fixture.componentRef.setInput('type', 'danger');
      fixture.detectChanges();
      expect(component.getConfirmButtonClass()).toContain('bg-red-600');
    });

    it('should return yellow button for warning type', () => {
      fixture.componentRef.setInput('type', 'warning');
      fixture.detectChanges();
      expect(component.getConfirmButtonClass()).toContain('bg-yellow-600');
    });

    it('should return blue button for info type', () => {
      fixture.componentRef.setInput('type', 'info');
      fixture.detectChanges();
      expect(component.getConfirmButtonClass()).toContain('bg-blue-600');
    });
  });
});
