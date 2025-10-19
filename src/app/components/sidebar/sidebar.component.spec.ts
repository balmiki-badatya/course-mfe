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
      expect(component.menuItems[1].label).toBe('Resources');
      expect(component.menuItems[2].label).toBe('Labs');
    });

    it('should have Programs as active by default', () => {
      expect(component.menuItems[0].active).toBe(true);
      expect(component.menuItems[1].active).toBe(false);
      expect(component.menuItems[2].active).toBe(false);
    });

    it('should have correct routes for menu items', () => {
      expect(component.menuItems[0].route).toBe('/programs');
      expect(component.menuItems[1].route).toBe('/resources');
      expect(component.menuItems[2].route).toBe('/labs');
    });

    it('should have correct icons for menu items', () => {
      expect(component.menuItems[0].icon).toBe('dashboard');
      expect(component.menuItems[1].icon).toBe('resources');
      expect(component.menuItems[2].icon).toBe('labs');
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
});
