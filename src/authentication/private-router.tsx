import { UserTokenData } from "@types/token";
import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
  allowedRoles: number[];
}

const PrivateRouter: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const userToken = localStorage.getItem("accessToken");

  if (!userToken) {
    console.warn("PrivateRoute: No user found, redirecting to login.");
    return <Navigate to="/" />;
  }

  const user = jwtDecode(userToken) as UserTokenData;

  console.log("User Role:", user.roleId, "Allowed Roles:", allowedRoles);
  const roleArray = JSON.parse(user.roleId);
  if (roleArray.some((role: number) => allowedRoles.includes(role))) {
    return <Outlet />;
  }

  console.warn("PrivateRoute: Unauthorized access, redirecting to home.");
  return <Navigate to="/" />;
};

export default PrivateRouter;
