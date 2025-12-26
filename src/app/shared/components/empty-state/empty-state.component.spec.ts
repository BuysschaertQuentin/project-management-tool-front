import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Empty Title');
    fixture.componentRef.setInput('message', 'Empty Message');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title and message', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Empty Title');
    expect(compiled.textContent).toContain('Empty Message');
  });

  it('should emit action when button clicked', () => {
    fixture.componentRef.setInput('showAction', true);
    fixture.componentRef.setInput('actionLabel', 'Do Action');
    fixture.detectChanges();

    const spy = jest.fn();
    component.action.subscribe(spy);

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(spy).toHaveBeenCalled();
  });
});
