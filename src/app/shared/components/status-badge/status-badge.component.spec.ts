import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBadgeComponent } from './status-badge.component';

describe('StatusBadgeComponent', () => {
  let component: StatusBadgeComponent;
  let fixture: ComponentFixture<StatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBadgeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBadgeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('status', 'TODO');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct label', () => {
    fixture.componentRef.setInput('status', 'TODO');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('À faire');

    fixture.componentRef.setInput('status', 'IN_PROGRESS');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('En cours');

    fixture.componentRef.setInput('status', 'DONE');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Terminé');
  });

  it('should return correct classes', () => {
    fixture.componentRef.setInput('status', 'TODO');
    fixture.detectChanges();
    expect(component.getStatusClass()).toContain('bg-gray-100');

    fixture.componentRef.setInput('status', 'IN_PROGRESS');
    fixture.detectChanges();
    expect(component.getStatusClass()).toContain('bg-yellow-100');

    fixture.componentRef.setInput('status', 'DONE');
    fixture.detectChanges();
    expect(component.getStatusClass()).toContain('bg-green-100');
  });
});
