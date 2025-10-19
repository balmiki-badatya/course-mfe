import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSignOut', () => {
    it('should log message when sign out is clicked', () => {
      const consoleSpy = spyOn(console, 'log');

      component.onSignOut();

      expect(consoleSpy).toHaveBeenCalledWith('Sign out clicked - functionality to be implemented');
    });
  });

  it('should render the component', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled).toBeTruthy();
  });

  describe('negative test cases', () => {
    it('should handle multiple rapid sign out clicks', () => {
      const consoleSpy = spyOn(console, 'log');

      for (let i = 0; i < 100; i++) {
        component.onSignOut();
      }

      expect(consoleSpy).toHaveBeenCalledTimes(100);
    });

    it('should throw when onSignOut is called without console.log', () => {
      const originalConsole = console.log;
      (console as any).log = undefined;

      expect(() => component.onSignOut()).toThrow();

      console.log = originalConsole;
    });

    it('should render header element', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const header = compiled.querySelector('header');
      expect(header).toBeTruthy();
    });

    it('should render brand name', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const brandName = compiled.querySelector('.brand-name');
      expect(brandName).toBeTruthy();
      expect(brandName?.textContent).toContain('SkillSync');
    });

    it('should render sign out button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const signOutBtn = compiled.querySelector('.sign-out-btn');
      expect(signOutBtn).toBeTruthy();
    });

    it('should call onSignOut when sign out button is clicked', () => {
      spyOn(component, 'onSignOut');
      const compiled = fixture.nativeElement as HTMLElement;
      const signOutBtn = compiled.querySelector('.sign-out-btn') as HTMLButtonElement;

      signOutBtn.click();

      expect(component.onSignOut).toHaveBeenCalled();
    });

    it('should have correct button text', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const signOutBtn = compiled.querySelector('.sign-out-btn');
      expect(signOutBtn?.textContent).toContain('Sign Out');
    });

    it('should render SVG icon in button', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const svg = compiled.querySelector('.sign-out-btn svg');
      expect(svg).toBeTruthy();
    });
  });
});
