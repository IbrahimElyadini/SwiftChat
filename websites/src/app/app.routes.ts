import { Routes } from '@angular/router';
import { RegisterLogin } from './register-login/register-login';
import { HomePage } from './home-page/home-page';
import { Profile } from './profile/profile';

export const routes: Routes = [
    {path: '', component:  HomePage},
    {path: 'auth', component:  RegisterLogin},
    {path: 'profile', component:  Profile}
];
