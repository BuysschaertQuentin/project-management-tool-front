import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Test Modal');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit close when backdrop clicked', () => {
    const spy = jest.fn();
    component.close.subscribe(spy);

    const backdrop = fixture.nativeElement.querySelector('.fixed');
    backdrop.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should emit close when close button clicked', () => {
    const spy = jest.fn();
    component.close.subscribe(spy);

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(spy).toHaveBeenCalled();
  });

  it('should NOT emit close when content clicked', () => {
    const spy = jest.fn();
    component.close.subscribe(spy);

    const content = fixture.nativeElement.querySelector('.bg-white');
    content.click();

    expect(spy).not.toHaveBeenCalled();
  });

  describe('getSizeClass', () => {
    it('should return correct classes', () => {
      fixture.componentRef.setInput('size', 'sm');
      fixture.detectChanges();
      expect(component.getSizeClass()).toBe('max-w-sm');

      fixture.componentRef.setInput('size', 'lg');
      fixture.detectChanges();
      expect(component.getSizeClass()).toBe('max-w-lg');
    });
  });
});
