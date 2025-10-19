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
      const componentMetadata = (AppComponent as unknown as { ɵcmp: { standalone: boolean } }).ɵcmp;
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
      const componentMetadata = (AppComponent as unknown as { ɵcmp: { selectors: string[][] } }).ɵcmp;
      const selectors = componentMetadata.selectors;
      expect(selectors[0][0]).toBe('app-root');
    });
  });
});
