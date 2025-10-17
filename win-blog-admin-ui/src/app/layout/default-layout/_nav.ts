import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Trang chủ',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'Nội dung',
    url: '/content',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Danh mục',
        url: '/content/post-categories',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Bài viết',
        url: '/content/posts',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Loạt bài',
        url: '/content/series',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Nhuận bút',
        url: '/content/royalty',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Hệ thống',
    url: '/system',
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'Phân Quyền',
        url: '/system/roles',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Người dùng',
        url: '/system/uers',
        icon: 'nav-icon-bullet'
      }
    ]
  },
];
