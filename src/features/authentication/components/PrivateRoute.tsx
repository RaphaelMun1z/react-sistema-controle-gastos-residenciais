import { Navigate, Outlet, useLocation } from "react-router";
import { ROUTES } from "../../../app/routes/paths";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = () => {
	const { isAuthenticated } = useAuth();
	const location = useLocation();

	if (!isAuthenticated) {
		return <Navigate to={ROUTES.signIn} replace state={{ from: location }} />;
	}

	return <Outlet />;
};

export default PrivateRoute;
