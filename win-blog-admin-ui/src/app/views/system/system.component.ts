import { Component } from '@angular/core';
import { IconDirective } from '@coreui/icons-angular';
import {
  ButtonDirective,
  ColComponent,
  ContainerComponent,
  FormControlDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  RowComponent
} from '@coreui/angular';
import { UserComponent } from './users/user.component';
import { RoleComponent } from './roles/role.component';

@Component({
  imports: [ContainerComponent, RowComponent, ColComponent, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, UserComponent, RoleComponent],
})
export class SystemComponent {}
