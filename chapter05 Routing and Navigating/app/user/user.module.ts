import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common'
import {userRoutes} from './user.routes'
import {ProfileComponent} from './profile.component'

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(userRoutes)
    ],
    declarations: [
        ProfileComponent
    ],
    providers: [

    ],
    bootstrap: []
})
export class UserModule { }
