import { MessageIcon } from '@components/icons';
import Bookmark from '@components/icons/bookmark';
import HomeIcon from '@components/icons/home';
import Profile from '@components/icons/profile';

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    title: 'Home',
    update: { status: true, count: 1 },
    Icon: <HomeIcon />,
    path: '/',
  },

  {
    title: 'Messages',
    Icon: <MessageIcon />,
    path: '/messages',
  },
  {
    title: 'Bookmarks',
    Icon: <Bookmark width={24} height={24} />,
    path: '/bookmarks',
  },
  {
    title: 'Profile',
    Icon: <Profile />,
    path: '/users/1',
  },
];

export type NavigationItem = {
  update?: { status: boolean; count: number };
  title: string;
  Icon: JSX.Element;
  path: string;
};
