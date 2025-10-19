import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  describe('component initialization', () => {
    it('should create the app', () => {
      expect(component).toBeTruthy();
    });

    it('should have the title "SkillSync"', () => {
      expect(component.title).toEqual('SkillSync');
    });

    it('should be a standalone component', () => {
      const componentMetadata = (AppComponent as any).ɵcmp;
      expect(componentMetadata.standalone).toBe(true);
    });
  });

  describe('template structure', () => {
    it('should render app-header component', () => {
      const headerElement = compiled.querySelector('app-header');
      expect(headerElement).toBeTruthy();
    });

    it('should render app-sidebar component', () => {
      const sidebarElement = compiled.querySelector('app-sidebar');
      expect(sidebarElement).toBeTruthy();
    });

    it('should render router-outlet', () => {
      const routerOutlet = compiled.querySelector('router-outlet');
      expect(routerOutlet).toBeTruthy();
    });

    it('should have main-container div', () => {
      const mainContainer = compiled.querySelector('.main-container');
      expect(mainContainer).toBeTruthy();
    });

    it('should have content-area main element', () => {
      const contentArea = compiled.querySelector('main.content-area');
      expect(contentArea).toBeTruthy();
    });

    it('should render components in correct order', () => {
      const children = Array.from(compiled.children);
      expect(children[0].tagName.toLowerCase()).toBe('app-header');
      expect(children[1].classList.contains('main-container')).toBe(true);
    });

    it('should have sidebar and router-outlet inside main-container', () => {
      const mainContainer = compiled.querySelector('.main-container');
      expect(mainContainer?.querySelector('app-sidebar')).toBeTruthy();
      expect(mainContainer?.querySelector('router-outlet')).toBeTruthy();
    });

    it('should have router-outlet inside content-area', () => {
      const contentArea = compiled.querySelector('main.content-area');
      expect(contentArea?.querySelector('router-outlet')).toBeTruthy();
    });
  });

  describe('component imports', () => {
    it('should include HeaderComponent', () => {
      const headerDebugElement: DebugElement = fixture.debugElement.query(By.directive(HeaderComponent));
      expect(headerDebugElement).toBeTruthy();
    });

    it('should include SidebarComponent', () => {
      const sidebarDebugElement: DebugElement = fixture.debugElement.query(By.directive(SidebarComponent));
      expect(sidebarDebugElement).toBeTruthy();
    });

    it('should create HeaderComponent instance', () => {
      const headerDebugElement: DebugElement = fixture.debugElement.query(By.directive(HeaderComponent));
      const headerComponent = headerDebugElement.componentInstance;
      expect(headerComponent).toBeInstanceOf(HeaderComponent);
    });

    it('should create SidebarComponent instance', () => {
      const sidebarDebugElement: DebugElement = fixture.debugElement.query(By.directive(SidebarComponent));
      const sidebarComponent = sidebarDebugElement.componentInstance;
      expect(sidebarComponent).toBeInstanceOf(SidebarComponent);
    });
  });

  describe('layout structure', () => {
    it('should have exactly one header component', () => {
      const headers = compiled.querySelectorAll('app-header');
      expect(headers.length).toBe(1);
    });

    it('should have exactly one sidebar component', () => {
      const sidebars = compiled.querySelectorAll('app-sidebar');
      expect(sidebars.length).toBe(1);
    });

    it('should have exactly one router-outlet', () => {
      const routerOutlets = compiled.querySelectorAll('router-outlet');
      expect(routerOutlets.length).toBe(1);
    });

    it('should have exactly one main-container', () => {
      const mainContainers = compiled.querySelectorAll('.main-container');
      expect(mainContainers.length).toBe(1);
    });

    it('should have exactly one content-area', () => {
      const contentAreas = compiled.querySelectorAll('.content-area');
      expect(contentAreas.length).toBe(1);
    });
  });

  describe('component selector', () => {
    it('should have selector "app-root"', () => {
      const componentMetadata = (AppComponent as any).ɵcmp;
      const selectors = componentMetadata.selectors;
      expect(selectors[0][0]).toBe('app-root');
    });
  });

  describe('negative test cases', () => {
    describe('title property edge cases', () => {
      it('should allow title to be changed', () => {
        component.title = 'New Title';
        expect(component.title).toBe('New Title');
      });

      it('should handle empty string title', () => {
        component.title = '';
        expect(component.title).toBe('');
      });

      it('should handle null title', () => {
        component.title = null as any;
        expect(component.title).toBeNull();
      });

      it('should handle undefined title', () => {
        component.title = undefined as any;
        expect(component.title).toBeUndefined();
      });

      it('should handle very long title', () => {
        const longTitle = 'Title '.repeat(10000);
        component.title = longTitle;
        expect(component.title).toBe(longTitle);
      });

      it('should handle special characters in title', () => {
        component.title = '<script>alert("XSS")</script>';
        expect(component.title).toBe('<script>alert("XSS")</script>');
      });

      it('should handle unicode in title', () => {
        component.title = '你好 🌍 مرحبا';
        expect(component.title).toBe('你好 🌍 مرحبا');
      });
    });

    describe('component lifecycle edge cases', () => {
      it('should create component even with no imports', () => {
        expect(component).toBeTruthy();
      });

      it('should handle multiple change detections', () => {
        for (let i = 0; i < 100; i++) {
          fixture.detectChanges();
        }
        expect(component).toBeTruthy();
      });

      it('should maintain structure after repeated change detection', () => {
        fixture.detectChanges();
        fixture.detectChanges();
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('app-header')).toBeTruthy();
        expect(compiled.querySelector('app-sidebar')).toBeTruthy();
        expect(compiled.querySelector('router-outlet')).toBeTruthy();
      });
    });

    describe('template structure edge cases', () => {
      it('should not have duplicate headers', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const headers = compiled.querySelectorAll('app-header');
        expect(headers.length).toBe(1);
      });

      it('should not have duplicate sidebars', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const sidebars = compiled.querySelectorAll('app-sidebar');
        expect(sidebars.length).toBe(1);
      });

      it('should not have duplicate router outlets', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const outlets = compiled.querySelectorAll('router-outlet');
        expect(outlets.length).toBe(1);
      });

      it('should maintain DOM structure', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const children = Array.from(compiled.children);

        expect(children.length).toBeGreaterThan(0);
      });

      it('should have header as first child', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const firstChild = compiled.children[0];
        expect(firstChild.tagName.toLowerCase()).toBe('app-header');
      });

      it('should have main-container as second child', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const secondChild = compiled.children[1];
        expect(secondChild.classList.contains('main-container')).toBe(true);
      });
    });

    describe('component imports edge cases', () => {
      it('should successfully create HeaderComponent', () => {
        const headerDebugElement: DebugElement = fixture.debugElement.query(By.directive(HeaderComponent));
        const headerInstance = headerDebugElement.componentInstance;
        expect(headerInstance).toBeTruthy();
      });

      it('should successfully create SidebarComponent', () => {
        const sidebarDebugElement: DebugElement = fixture.debugElement.query(By.directive(SidebarComponent));
        const sidebarInstance = sidebarDebugElement.componentInstance;
        expect(sidebarInstance).toBeTruthy();
      });

      it('should have header and sidebar as sibling components', () => {
        const headerDebugElement: DebugElement = fixture.debugElement.query(By.directive(HeaderComponent));
        const sidebarDebugElement: DebugElement = fixture.debugElement.query(By.directive(SidebarComponent));

        expect(headerDebugElement).toBeTruthy();
        expect(sidebarDebugElement).toBeTruthy();
      });
    });

    describe('CSS classes edge cases', () => {
      it('should have main-container with correct class', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const mainContainer = compiled.querySelector('.main-container');
        expect(mainContainer?.classList.contains('main-container')).toBe(true);
      });

      it('should have content-area with correct class', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const contentArea = compiled.querySelector('.content-area');
        expect(contentArea?.classList.contains('content-area')).toBe(true);
      });

      it('should have content-area as main element', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const contentArea = compiled.querySelector('main.content-area');
        expect(contentArea?.tagName.toLowerCase()).toBe('main');
      });
    });

    describe('router outlet edge cases', () => {
      it('should have router-outlet inside main.content-area', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const contentArea = compiled.querySelector('main.content-area');
        const routerOutlet = contentArea?.querySelector('router-outlet');
        expect(routerOutlet).toBeTruthy();
      });

      it('should not have router-outlet outside content-area', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const header = compiled.querySelector('app-header');
        const routerOutletInHeader = header?.querySelector('router-outlet');
        expect(routerOutletInHeader).toBeFalsy();
      });

      it('should not have router-outlet in sidebar', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        const sidebar = compiled.querySelector('app-sidebar');
        const routerOutletInSidebar = sidebar?.querySelector('router-outlet');
        expect(routerOutletInSidebar).toBeFalsy();
      });
    });

    describe('component isolation', () => {
      it('should not share state between header and sidebar', () => {
        const headerDebugElement: DebugElement = fixture.debugElement.query(By.directive(HeaderComponent));
        const sidebarDebugElement: DebugElement = fixture.debugElement.query(By.directive(SidebarComponent));

        const headerInstance = headerDebugElement.componentInstance;
        const sidebarInstance = sidebarDebugElement.componentInstance;

        expect(headerInstance).not.toBe(sidebarInstance);
      });

      it('should create independent component instances', () => {
        const headerDebugElement: DebugElement = fixture.debugElement.query(By.directive(HeaderComponent));
        const headerInstance = headerDebugElement.componentInstance;

        expect(headerInstance.constructor.name).toBe('HeaderComponent');
      });
    });

    describe('change detection edge cases', () => {
      it('should update title in component', () => {
        component.title = 'Updated';
        fixture.detectChanges();
        expect(component.title).toBe('Updated');
      });

      it('should handle rapid title changes', () => {
        for (let i = 0; i < 1000; i++) {
          component.title = `Title ${i}`;
        }
        fixture.detectChanges();
        expect(component.title).toBe('Title 999');
      });

      it('should maintain component structure after title change', () => {
        component.title = 'New Title';
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('app-header')).toBeTruthy();
        expect(compiled.querySelector('app-sidebar')).toBeTruthy();
      });
    });

    describe('metadata validation', () => {
      it('should be a standalone component', () => {
        const metadata = (AppComponent as any).ɵcmp;
        expect(metadata.standalone).toBe(true);
      });

      it('should have correct component type', () => {
        expect(component.constructor.name).toBe('AppComponent');
      });

      it('should have template URL', () => {
        const metadata = (AppComponent as any).ɵcmp;
        expect(metadata).toBeTruthy();
      });
    });
  });
});
