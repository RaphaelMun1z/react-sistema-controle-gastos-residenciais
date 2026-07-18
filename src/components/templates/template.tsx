import { useState } from "react";
import "./template.css";
import logo from "../../assets/rm-logo-branco.png"

const Template = () => {
	const [count, setCount] = useState(0);

	return (
		<div className="base-container">
			<div className="template-container">
				<aside className="aside-container">
					<div className="aside-content-container">
						<div className="aside-header-container">
							<img src="" alt="Foto de Perfil do Usuário" />
							<h2>Nome do usuário</h2>
							<p>E-mail do usuário</p>
						</div>
					</div>
				</aside>
				<div className="view-page-container">
					<div className="main-content-container"></div>
				</div>
			</div>
			<div className="author-container">
				<p>Desenvolvido por </p>
				<img src={logo} alt="Logo Raphael Muniz" />
			</div>
		</div>
	);
};

export default Template;
