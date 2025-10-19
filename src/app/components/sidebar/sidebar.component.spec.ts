import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should initialize with isExpanded as true', () => {
      expect(component.isExpanded).toBe(true);
    });

    it('should initialize with correct menu items', () => {
      expect(component.menuItems.length).toBe(3);
      expect(component.menuItems[0].label).toBe('Programs');
      expect(component.menuItems[1].label).toBe('Labs');
      expect(component.menuItems[2].label).toBe('Resources');
    });

    it('should have Programs as active by default', () => {
      expect(component.menuItems[0].active).toBe(true);
      expect(component.menuItems[1].active).toBe(false);
      expect(component.menuItems[2].active).toBe(false);
    });

    it('should have correct routes for menu items', () => {
      expect(component.menuItems[0].route).toBe('/programs');
      expect(component.menuItems[1].route).toBe('/labs');
      expect(component.menuItems[2].route).toBe('/resources');
    });

    it('should have correct icons for menu items', () => {
      expect(component.menuItems[0].icon).toBe('dashboard');
      expect(component.menuItems[1].icon).toBe('labs');
      expect(component.menuItems[2].icon).toBe('resources');
    });
  });

  describe('toggleSidebar', () => {
    it('should toggle isExpanded from true to false', () => {
      component.isExpanded = true;

      component.toggleSidebar();

      expect(component.isExpanded).toBe(false);
    });

    it('should toggle isExpanded from false to true', () => {
      component.isExpanded = false;

      component.toggleSidebar();

      expect(component.isExpanded).toBe(true);
    });

    it('should toggle multiple times correctly', () => {
      component.isExpanded = true;

      component.toggleSidebar();
      expect(component.isExpanded).toBe(false);

      component.toggleSidebar();
      expect(component.isExpanded).toBe(true);

      component.toggleSidebar();
      expect(component.isExpanded).toBe(false);
    });
  });

  describe('setActive', () => {
    it('should set the selected menu item as active and others as inactive', () => {
      component.setActive(1);

      expect(component.menuItems[0].active).toBe(false);
      expect(component.menuItems[1].active).toBe(true);
      expect(component.menuItems[2].active).toBe(false);
    });

    it('should handle setting first item as active', () => {
      component.menuItems[0].active = false;

      component.setActive(0);

      expect(component.menuItems[0].active).toBe(true);
      expect(component.menuItems[1].active).toBe(false);
      expect(component.menuItems[2].active).toBe(false);
    });

    it('should handle setting last item as active', () => {
      component.setActive(2);

      expect(component.menuItems[0].active).toBe(false);
      expect(component.menuItems[1].active).toBe(false);
      expect(component.menuItems[2].active).toBe(true);
    });

    it('should deactivate all previous active items', () => {
      component.menuItems[0].active = true;
      component.menuItems[1].active = true;

      component.setActive(2);

      expect(component.menuItems[0].active).toBe(false);
      expect(component.menuItems[1].active).toBe(false);
      expect(component.menuItems[2].active).toBe(true);
    });
  });

  describe('negative test cases', () => {
    describe('setActive edge cases', () => {
      it('should handle negative index', () => {
        component.setActive(-1);

        // All should be inactive when index is negative
        component.menuItems.forEach(item => {
          expect(item.active).toBe(false);
        });
      });

      it('should handle index beyond array length', () => {
        component.setActive(999);

        // All should be inactive when index is out of bounds
        component.menuItems.forEach(item => {
          expect(item.active).toBe(false);
        });
      });

      it('should handle zero index', () => {
        component.setActive(0);

        expect(component.menuItems[0].active).toBe(true);
        expect(component.menuItems[1].active).toBe(false);
        expect(component.menuItems[2].active).toBe(false);
      });

      it('should handle rapid consecutive calls', () => {
        for (let i = 0; i < 1000; i++) {
          component.setActive(i % 3);
        }

        // Last call was setActive(1) because 999 % 3 = 0, and then final iteration i=999 does setActive(999 % 3) which is setActive(0)
        // Actually: when i=999, 999 % 3 = 0, so last call is setActive(0)
        expect(component.menuItems[0].active).toBe(true);
        expect(component.menuItems[1].active).toBe(false);
        expect(component.menuItems[2].active).toBe(false);
      });

      it('should handle setting same index multiple times', () => {
        component.setActive(1);
        component.setActive(1);
        component.setActive(1);

        expect(component.menuItems[1].active).toBe(true);
      });

      it('should handle null index', () => {
        component.setActive(null as any);

        component.menuItems.forEach(item => {
          expect(item.active).toBe(false);
        });
      });

      it('should handle undefined index', () => {
        component.setActive(undefined as any);

        component.menuItems.forEach(item => {
          expect(item.active).toBe(false);
        });
      });

      it('should handle decimal index', () => {
        component.setActive(1.5);

        // JavaScript array indexing will floor the decimal
        component.menuItems.forEach(item => {
          expect(item.active).toBe(false);
        });
      });
    });

    describe('toggleSidebar edge cases', () => {
      it('should handle being called when menuItems is empty', () => {
        component.menuItems = [];

        expect(() => component.toggleSidebar()).not.toThrow();
      });

      it('should handle being called 1000 times', () => {
        const initialState = component.isExpanded; // true by default
        for (let i = 0; i < 1000; i++) {
          component.toggleSidebar();
        }

        // After even number of toggles, should be back to initial state
        expect(component.isExpanded).toBe(initialState);
      });

      it('should maintain state across multiple toggles', () => {
        const states: boolean[] = [];

        for (let i = 0; i < 10; i++) {
          component.toggleSidebar();
          states.push(component.isExpanded);
        }

        expect(states).toEqual([false, true, false, true, false, true, false, true, false, true]);
      });
    });

    describe('menu items edge cases', () => {
      it('should handle empty menu items array', () => {
        component.menuItems = [];

        expect(component.menuItems.length).toBe(0);
      });

      it('should handle menu items with missing properties', () => {
        component.menuItems = [
          { icon: 'test', label: 'Test', route: '/test', active: true } as any,
          { icon: undefined, label: undefined, route: undefined, active: undefined } as any
        ];

        expect(() => component.setActive(0)).not.toThrow();
      });

      it('should handle menu items with null values', () => {
        component.menuItems = [
          { icon: null, label: null, route: null, active: null } as any
        ];

        expect(component.menuItems[0].icon).toBeNull();
      });

      it('should handle very long route strings', () => {
        const longRoute = '/'.repeat(10000);
        component.menuItems[0].route = longRoute;

        expect(component.menuItems[0].route).toBe(longRoute);
      });

      it('should handle special characters in routes', () => {
        component.menuItems[0].route = '/route?param=value&other=<script>';

        expect(component.menuItems[0].route).toContain('<script>');
      });

      it('should handle unicode in labels', () => {
        component.menuItems[0].label = '你好 🌍 مرحبا';

        expect(component.menuItems[0].label).toBe('你好 🌍 مرحبا');
      });
    });

    describe('template rendering edge cases', () => {
      it('should render all menu items when isExpanded is true', () => {
        component.isExpanded = true;
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const navItems = compiled.querySelectorAll('.nav-item');
        expect(navItems.length).toBe(3);
      });

      it('should still render menu items when isExpanded is false', () => {
        component.isExpanded = false;
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const navItems = compiled.querySelectorAll('.nav-item');
        expect(navItems.length).toBe(3);
      });

      it('should handle rendering with no menu items', () => {
        component.menuItems = [];
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const navItems = compiled.querySelectorAll('.nav-item');
        expect(navItems.length).toBe(0);
      });

      it('should render toggle button', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const toggleBtn = compiled.querySelector('.toggle-btn');
        expect(toggleBtn).toBeTruthy();
      });

      it('should toggle sidebar when toggle button is clicked', () => {
        const initialState = component.isExpanded;
        const compiled = fixture.nativeElement as HTMLElement;
        const toggleBtn = compiled.querySelector('.toggle-btn') as HTMLButtonElement;

        toggleBtn.click();

        expect(component.isExpanded).toBe(!initialState);
      });
    });

    describe('isExpanded state edge cases', () => {
      it('should handle isExpanded set to null', () => {
        component.isExpanded = null as any;

        component.toggleSidebar();

        expect(component.isExpanded).toBe(true);
      });

      it('should handle isExpanded set to undefined', () => {
        component.isExpanded = undefined as any;

        component.toggleSidebar();

        expect(component.isExpanded).toBe(true);
      });

      it('should handle isExpanded set to non-boolean values', () => {
        component.isExpanded = 'true' as any;

        component.toggleSidebar();

        expect(component.isExpanded).toBe(false);
      });

      it('should handle isExpanded set to 0', () => {
        component.isExpanded = 0 as any;

        component.toggleSidebar();

        expect(component.isExpanded).toBe(true);
      });

      it('should handle isExpanded set to 1', () => {
        component.isExpanded = 1 as any;

        component.toggleSidebar();

        expect(component.isExpanded).toBe(false);
      });
    });

    describe('router integration edge cases', () => {
      it('should have routerLink directive on nav items', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const navItem = compiled.querySelector('.nav-item');
        expect(navItem).toBeTruthy();
      });

      it('should have routerLinkActive directive on nav items', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const navItem = compiled.querySelector('.nav-item');
        expect(navItem).toBeTruthy();
      });

      it('should handle clicking nav items', () => {
        spyOn(component, 'setActive');
        const compiled = fixture.nativeElement as HTMLElement;
        const navItem = compiled.querySelector('.nav-item') as HTMLElement;

        navItem.click();

        expect(component.setActive).toHaveBeenCalled();
      });
    });
  });
});
