import { Routes } from '@angular/router';
import { TopicsListComponent } from './components/topics-list/topics-list.component';

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
    component: TopicsListComponent
  },
  {
    path: 'resources',
    component: TopicsListComponent
  },
  {
    path: '**',
    redirectTo: '/programs'
  }
];
