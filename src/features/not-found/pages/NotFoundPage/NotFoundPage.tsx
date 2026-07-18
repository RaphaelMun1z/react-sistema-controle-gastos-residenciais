import { Button } from "@mui/material";
import "./NotFoundPage.scss";
import notFoundImage from "../../../../assets/images/notFoundImage.png";
import { useNavigate } from "react-router";

const NotFoundPage = () => {
	const navigate = useNavigate();

	return (
		<main className="main-container">
			<div className="not-found-container">
				<h1>404</h1>
				<p>Página não encontrada.</p>
			</div>
			<img
				className="not-found-image"
				src={notFoundImage}
				alt="Imagem - Página não encontrada"
			/>
			<Button
				className="not-found-button"
				variant="outlined"
				onClick={() => navigate("/resumo")}
			>
				Ir para Resumo
			</Button>
		</main>
	);
};

export default NotFoundPage;
