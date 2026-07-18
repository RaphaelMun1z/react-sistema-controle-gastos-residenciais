import { Navigate, Outlet, useLocation } from "react-router";
import { CircularProgress } from "@mui/material";
import { ROUTES } from "../../../app/routes/paths";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = () => {
	const { isAuthenticated, isAuthUnavailable, isLoading } = useAuth();
	const location = useLocation();

	if (isLoading) {
		return <CircularProgress aria-label="Verificando sessão" />;
	}

	if (isAuthUnavailable) {
		return <Outlet />;
	}

	if (!isAuthenticated) {
		return <Navigate to={ROUTES.signIn} replace state={{ from: location }} />;
	}

	return <Outlet />;
};

export default PrivateRoute;
