import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { LoginComponent } from './login/login.component';

export const ROUTES: Routes = [
  { path: '', component: LoginComponent },
  { path: 'chat', component: ChatComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(ROUTES, { useHash: true })]
  ,
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }
