import { Routes } from '@angular/router';
import { ProfileContainerComponent } from './portal/containers/profile-container/profile-container.component';
import { AddGuardianComponent } from './portal/containers/add-guardian/add-guardian.component';
import { HomePageComponent } from './portal/containers/home-page/home-page.component';


export const routes: Routes = [
    {
        path:':childId',
        component:ProfileContainerComponent
    },
    {
        path:'',
        component:HomePageComponent
    },
    {
        path:'add',
        component:AddGuardianComponent
    }
];
