import MainLayout from "@layouts/seller-layout/main-layout";
import { Route, Routes } from "react-router-dom";
import { paths } from "./path";
import { Home } from "@pages/buyer/home";
import Notifications from "@pages/buyer/notifications/notifications";
import { PostDetail } from "@pages/buyer/post-detail";
import Profile from "@components/icons/profile";
import EditProfile from "@components/icons/edit";
import { Following } from "@pages/buyer/following";
import { Explore } from "@pages/buyer/explore";
import Settings from "@pages/buyer/settings/settings";
import { Message } from "@pages/buyer/message";
import { Bookmarks } from "@pages/buyer/bookmarks";

const SellerRouter = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path={paths.home} element={<Home />} />
                <Route path={paths.notifications} element={<Notifications />} />
                <Route path={paths.postDetail} element={<PostDetail />} />
                <Route path={paths.profile} element={<Profile />} />
                <Route path={paths.profileDetail} element={<EditProfile />} />
                <Route path={paths.following} element={<Following />} />
                <Route path={paths.explore} element={<Explore />} />
                <Route path={paths.settings} element={<Settings />} />
                <Route path={`${paths.messages}/*`} element={<Message />} />
                <Route path={`${paths.bookmarks}/*`} element={<Bookmarks />} />
            </Route>
        </Routes>
    );
};

export default SellerRouter;
