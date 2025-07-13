import { Routes } from '@angular/router';
import { App } from './app';
import { RegisterLogin } from './register-login/register-login';
import { HomePage } from './home-page/home-page';

export const routes: Routes = [
    {path: '', component:  HomePage},
    {path: 'auth', component:  RegisterLogin}

];
