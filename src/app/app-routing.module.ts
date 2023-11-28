import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TopComponent } from './top/top.component';
import { DashboardComponent } from './mypage/dashboard/dashboard.component';
import { ProfileComponent } from './mypage/profile/profile.component';
import { InvoiceComponent } from './mypage/invoice/invoice.component';
import { PlanComponent } from './mypage/plan/plan.component';
import { InviteComponent } from './mypage/invite/invite.component';
import { AuthGuard } from './app.authguard';
import { InvitationComponent } from './invitation/invitation.component';

const routes: Routes = [
  { path: '', component: TopComponent },
  {
    path: 'mypage',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'view-users'
    }
  },
  {
    path: 'mypage/profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'view-users'
    }
  },
  {
    path: 'mypage/invoice',
    component: InvoiceComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'Admin'
    }
  },
  {
    path: 'mypage/plan',
    component: PlanComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'Admin'
    }
  },
  {
    path: 'mypage/invite',
    component: InviteComponent,
    canActivate: [AuthGuard],
    data: {
      role: 'view-users'
    }
  },
  {
    path: 'invite/accept/:slug',
    component: InvitationComponent
  },
  {
    path: '**',
    component: TopComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
