import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgScrollbar } from 'ngx-scrollbar';
import { IconDirective } from '@coreui/icons-angular';
import {
  ContainerComponent,
  ShadowOnScrollDirective,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarNavComponent,
  SidebarToggleDirective,
  SidebarTogglerDirective
} from '@coreui/angular';

import { DefaultFooterComponent, DefaultHeaderComponent } from './';
import { navItems } from './_nav';
import { TokenStorageService } from '../../shared/services/token-storage.service';
import { UrlConstants } from '../../shared/constants/url.constants';
function isOverflown(element: HTMLElement) {
  return (
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth
  );
}
type NavChild = {
  name?: string;
  url?: string;
  class?: string;
  attributes?: { policyName?: string };
};
type NavItem = {
  name?: string;
  url?: string;
  iconComponent?: any;
  children?: NavChild[];
};
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
  imports: [
    SidebarComponent,
    SidebarHeaderComponent,
    SidebarBrandComponent,
    SidebarNavComponent,
    SidebarFooterComponent,
    SidebarToggleDirective,
    SidebarTogglerDirective,
    ContainerComponent,
    DefaultFooterComponent,
    DefaultHeaderComponent,
    IconDirective,
    NgScrollbar,
    RouterOutlet,
    RouterLink,
    ShadowOnScrollDirective
  ]
})
export class DefaultLayoutComponent implements OnInit {
  public navItems = [];

  constructor(
    private tokenService: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
  const user = this.tokenService.getUser();
  if (!user) {
    this.router.navigate([UrlConstants.LOGIN]);
    return;
  }

  // user.permissions có thể là string JSON hoặc object
  const raw = user.permissions;
  const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;

  // Chuẩn hóa về mảng string[]
  const permissions: string[] =
    Array.isArray(parsed) ? parsed
    : Array.isArray(parsed?.Result) ? parsed.Result
    : [];

  // Dùng Set để tra nhanh O(1)
  const permSet = new Set(permissions);

  // Duyệt navItems và ẩn item không có quyền
  for (const item of navItems) {
    const children = item.children ?? [];
    for (const child of children) {
      const policy = child?.attributes?.['policyName'];
      if (policy && !permSet.has(policy)) {
        child.class = 'hidden';
      }
    }
  }
  this.navItems = navItems;
  }
}