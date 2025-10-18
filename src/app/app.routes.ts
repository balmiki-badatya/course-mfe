import { Routes } from '@angular/router';
import { TopicsListComponent } from './components/topics-list/topics-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
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
    redirectTo: '/dashboard'
  }
];
