import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Trang chủ',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    },
    attributes: {
      "policyName": "Permissions.Dashboard.View"
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
        icon: 'nav-icon-bullet',
        attributes: {
          "policyName": "Permissions.PostCategories.View"
        }
      },
      {
        name: 'Bài viết',
        url: '/content/posts',
        icon: 'nav-icon-bullet',
        attributes: {
          "policyName": "Permissions.Posts.View"
        }
      },
      {
        name: 'Loạt bài',
        url: '/content/series',
        icon: 'nav-icon-bullet',
        attributes: {
          "policyName": "Permissions.Series.View"
        }
      },
      {
        name: 'Nhuận bút',
        url: '/content/royalty',
        icon: 'nav-icon-bullet',
        attributes: {
          "policyName": "Permissions.Loyalty.View"
        }
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
        icon: 'nav-icon-bullet',
        attributes: {
          "policyName": "Permissions.Roles.View"
        }
      },
      {
        name: 'Người dùng',
        url: '/system/uers',
        icon: 'nav-icon-bullet',
        attributes: {
          "policyName": "Permissions.Users.View"
        }
      }
    ]
  },
];
