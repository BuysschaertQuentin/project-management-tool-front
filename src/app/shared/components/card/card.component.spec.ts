import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card.component';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return correct base classes', () => {
    const classes = component.getCardClasses();
    expect(classes).toContain('bg-white');
    expect(classes).toContain('rounded-xl');
    expect(classes).not.toContain('cursor-pointer');
  });

  it('should include interactive classes when clickable is true', () => {
    fixture.componentRef.setInput('clickable', true);
    fixture.detectChanges();

    const classes = component.getCardClasses();
    expect(classes).toContain('cursor-pointer');
    expect(classes).toContain('hover:shadow-lg');
  });

  it('should include custom classes', () => {
    fixture.componentRef.setInput('customClass', 'test-class');
    fixture.detectChanges();

    const classes = component.getCardClasses();
    expect(classes).toContain('test-class');
  });

  it('should render title when provided', () => {
    fixture.componentRef.setInput('title', 'Test Card');
    fixture.detectChanges();

    const titleEl = fixture.nativeElement.querySelector('h3');
    expect(titleEl).toBeTruthy();
    expect(titleEl.textContent).toContain('Test Card');
  });

  it('should apply padding class when padding input is true', () => {
    // Default is true
    let contentDiv = fixture.nativeElement.querySelector('.card-body');
    expect(contentDiv.classList).toContain('p-6');

    fixture.componentRef.setInput('padding', false);
    fixture.detectChanges();
    contentDiv = fixture.nativeElement.querySelector('.card-body');
    expect(contentDiv.classList).not.toContain('p-6');
  });
});
