import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";

@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./main/pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'trainers', loadChildren: () => import('./main/pages/trainers/trainers.module').then(m => m.TrainersModule) },
                    { path: 'equipments', loadChildren: () => import('./main/pages/equipment/equipment.module').then(m => m.EquipmentsModule) },
                    { path: 'affections', loadChildren: () => import('./main/pages/affections/affection.module').then(m => m.AffectionsModule) },
                    { path: 'exercisetypes', loadChildren: () => import('./main/pages/exercise-types/exercise-types.module').then(m => m.ExerciseTypesModule) },
                    { path: 'trainingtypes', loadChildren: () => import('./main/pages/training-types/training-types.module').then(m => m.TrainingTypesModule) },
                    { path: 'goals', loadChildren: () => import('./main/pages/goals/goals.module').then(m => m.GoalsModule) },
                    { path: 'muscles', loadChildren: () => import('./main/pages/muscles/muscles.module').then(m => m.MusclesModule) },


                    { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
                    { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
                    { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
                    { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
                    { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) }
                ]
            },
            { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
            { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
