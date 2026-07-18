import { Navigate, Outlet } from "react-router";
import { ROUTES } from "../../../app/routes/paths";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = () => {
	const { isAuthenticated } = useAuth();

	if (isAuthenticated) {
		return <Navigate to={ROUTES.people} replace />;
	}

	return <Outlet />;
};

export default PublicRoute;
