import HomeIcon from '@components/icons/home';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    title: 'Home',
    update: { status: true, count: 1 },
    Icon: <HomeIcon />,
    path: '/buyer',
  },
  // {
  //   title: 'Messages',
  //   Icon: <MessageIcon />,
  //   path: '/messages',
  // },
  // {
  //   title: 'Create Post',
  //   Icon: <Add />,
  //   path: '/buyer/create-post',
  // },
];

export type NavigationItem = {
  update?: { status: boolean; count: number };
  title: string;
  Icon: JSX.Element;
  path: string;
};
