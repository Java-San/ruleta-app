import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HistoryComponent } from './pages/history/history.component';
import { UsersComponent } from './pages/users/users.component';
import { RouletteComponent } from './pages/roulette/roulette.component';


@NgModule({
  declarations: [
    AppComponent,
    HistoryComponent,
    UsersComponent,
    RouletteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
