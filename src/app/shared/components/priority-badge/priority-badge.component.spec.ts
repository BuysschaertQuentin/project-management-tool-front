import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriorityBadgeComponent } from './priority-badge.component';

describe('PriorityBadgeComponent', () => {
  let component: PriorityBadgeComponent;
  let fixture: ComponentFixture<PriorityBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriorityBadgeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PriorityBadgeComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('priority', 'LOW');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct label', () => {
    fixture.componentRef.setInput('priority', 'LOW');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Basse');

    fixture.componentRef.setInput('priority', 'MEDIUM');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Moyenne');

    fixture.componentRef.setInput('priority', 'HIGH');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Haute');
  });

  it('should return correct classes', () => {
    fixture.componentRef.setInput('priority', 'LOW');
    fixture.detectChanges();
    expect(component.getPriorityClass()).toContain('bg-gray-100');

    fixture.componentRef.setInput('priority', 'MEDIUM');
    fixture.detectChanges();
    expect(component.getPriorityClass()).toContain('bg-yellow-100');

    fixture.componentRef.setInput('priority', 'HIGH');
    fixture.detectChanges();
    expect(component.getPriorityClass()).toContain('bg-red-100');
  });
});
