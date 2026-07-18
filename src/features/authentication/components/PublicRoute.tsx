import { Navigate, Outlet } from "react-router";
import { CircularProgress } from "@mui/material";
import { ROUTES } from "../../../app/routes/paths";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = () => {
	const { isAuthenticated, isLoading } = useAuth();

	if (isLoading) {
		return <CircularProgress aria-label="Verificando sessão" />;
	}

	if (isAuthenticated) {
		return <Navigate to={ROUTES.people} replace />;
	}

	return <Outlet />;
};

export default PublicRoute;
