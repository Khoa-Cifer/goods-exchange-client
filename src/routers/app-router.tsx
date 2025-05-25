import ErrorPage from '@pages/error/error-page';
import Login from '@pages/auth/login';
import { paths } from '@routers/path';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import PrivateRouter from '@authentication/private-router';
import BuyerRouter from './buyer-router';
import SellerRouter from './seller-router';

// ----------------------------------------------------------------------
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<ErrorPage />}>
      <Route path={paths.login} element={<Login />} />

      <Route element={<PrivateRouter allowedRoles={[4]} />}>
        <Route
          path="/buyer/*"
          element={<BuyerRouter />}
        />
      </Route>

      <Route element={<PrivateRouter allowedRoles={[3, 4]} />}>
        <Route
          path="/seller/*"
          element={<SellerRouter />}
        />
      </Route>
    </Route>,
  ),
);

const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
