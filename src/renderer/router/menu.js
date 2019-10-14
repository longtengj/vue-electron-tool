const menu = [
  {
    icon: 'cube',
    title: '我的参数',
    path: '/goods',
    component: require('@/pages/menu/goods').default,
  },
  {
    icon: 'clipboard',
    title: '我的测试',
    path: '/detailList',
    component: require('@/pages/menu/detaillist').default,
  },
  // {
  //   icon: 'clipboard',
  //   title: '协议调试',
  //   path: '/lockerList',
  //   component: require('@/pages/menu/LockerList').default,
  // },
];
export default menu;
