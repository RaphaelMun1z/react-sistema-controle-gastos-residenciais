import { Navigate, Outlet, useLocation } from "react-router";
import { CircularProgress } from "@mui/material";
import { ROUTES } from "../../../app/routes/paths";
import { env } from "../../../shared/config/env";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = () => {
	const { isAuthenticated, isLoading } = useAuth();
	const location = useLocation();

	if (env.bypassAuth) {
		return <Outlet />;
	}

	if (isLoading) {
		return <CircularProgress aria-label="Verificando sessão" />;
	}

	if (!isAuthenticated) {
		return <Navigate to={ROUTES.signIn} replace state={{ from: location }} />;
	}

	return <Outlet />;
};

export default PrivateRoute;
