import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Subject, takeUntil } from 'rxjs';
import { AdminApiRoleApiClient, RoleDto, RoleDtoPagedResult } from '../../../api/admin-api.service.generated';
import { DialogService, DynamicDialogComponent } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { AlertService } from '../../../shared/services/alert.service';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { PaginatorModule } from 'primeng/paginator';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common'; // hoặc import riêng NgIf/NgFor nếu muốn
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  imports: [ContainerComponent, RowComponent, ColComponent, InputGroupComponent, InputGroupTextDirective, IconDirective, FormControlDirective, ButtonDirective, TableModule,
    CommonModule,
    FormsModule,
    PanelModule,
    PaginatorModule,
    BlockUIModule,
    ProgressSpinnerModule,
    CheckboxModule,
    ButtonModule]
})
export class RoleComponent implements OnInit, OnDestroy {
  //System variables
  private ngUnsubscribe = new Subject<void>();
  public blockedPanel: boolean = false;

  //Paging variables
  public pageIndex: number = 1;
  public pageSize: number = 10;
  public totalCount: number;

  //Business variables
  public items: RoleDto[];
  public selectedItems: RoleDto[] = [];
  public keyword: string = '';

  constructor(
    private roleService: AdminApiRoleApiClient,
    public dialogService: DialogService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService
  ) {}
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.toggleBlockUI(true);

    this.roleService
      .getRolesAllPaging(this.keyword, this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: RoleDtoPagedResult) => {
          this.items = response.results;
          this.totalCount = response.rowCount;

          this.toggleBlockUI(false);
        },
        error: (e) => {
          this.toggleBlockUI(false);
        },
      });
  }

  pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.pageSize = event.rows;
    this.loadData();
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled == true) {
      this.blockedPanel = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
      }, 1000);
    }
  }
  showPermissionModal(id: string, name: string) {}
  showEditModal() {}
  showAddModal() {}
  deleteItems(){}
}