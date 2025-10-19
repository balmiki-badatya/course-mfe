import { Routes } from '@angular/router';
import { TopicsListComponent } from './components/topics-list/topics-list.component';
import { LabsComponent } from './components/labs/labs.component';
import { ResourcesComponent } from './components/resources/resources.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/programs',
    pathMatch: 'full'
  },
  {
    path: 'programs',
    component: TopicsListComponent
  },
  {
    path: 'labs',
    component: LabsComponent
  },
  {
    path: 'resources',
    component: ResourcesComponent
  },
  {
    path: '**',
    redirectTo: '/programs'
  }
];
