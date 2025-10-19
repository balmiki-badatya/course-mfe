import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopicsListComponent } from './components/topics-list/topics-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/programs', pathMatch: 'full' },
  { path: 'programs', component: TopicsListComponent },
  { path: 'labs', component: TopicsListComponent }, // Placeholder - will be replaced with actual component
  { path: 'resources', component: TopicsListComponent }, // Placeholder - will be replaced with actual component
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
