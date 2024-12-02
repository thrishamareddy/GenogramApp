import { Routes } from '@angular/router';
import { ProfileContainerComponent } from './portal/containers/profile-container/profile-container.component';
import { AddGuardianComponent } from './portal/containers/add-guardian/add-guardian.component';

export const routes: Routes = [
    {
        path:':childId',
        component:ProfileContainerComponent
    },
    {
        path:'',
        component:ProfileContainerComponent
    },
    {
        path:'add',
        component:AddGuardianComponent
    }
];
