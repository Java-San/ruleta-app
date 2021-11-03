import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoryComponent } from './pages/history/history.component';
import { RouletteComponent } from './pages/roulette/roulette.component';
import { UsersComponent } from './pages/users/users.component';

const routes: Routes = [
  { path: '', component: HistoryComponent },
  { path: 'users', component: UsersComponent },
  { path: 'roulette', component: RouletteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
