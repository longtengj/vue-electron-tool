const menu = [
  {
    icon: 'cube',
    title: '我的参数',
    path: '/goods',
    component: require('@/pages/menu/goods/index').default,
  },
  {
    icon: 'clipboard',
    title: '我的测试',
    path: '/detailList',
    component: require('@/pages/menu/detaillist/index').default,
  },
];
export default menu;
