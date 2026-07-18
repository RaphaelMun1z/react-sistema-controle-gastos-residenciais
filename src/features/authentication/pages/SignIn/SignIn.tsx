import "../../../../components/layout/AuthTemplate/AuthTemplate.scss";

// Componentes do Material UI
import { Button, TextField } from "@mui/material";

// Ícones
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

// React Router
import { Link } from "react-router";
import { ROUTES } from "../../../../app/routes/paths";

const SignIn = () => {
	return (
		<div className="form-container">
			<header className="form-header">
				<h1>Acesse sua conta</h1>
			</header>

			<form className="auth-form">
				<div className="input-container">
					<label htmlFor="email">E-mail</label>

					<TextField
						id="email"
						type="email"
						fullWidth
						size="small"
						placeholder="Digite seu e-mail"
						slotProps={{
							input: {
								startAdornment: (
									<EmailOutlinedIcon className="input-icon" />
								),
							},
						}}
					/>
				</div>

				<div className="input-container">
					<label htmlFor="password">Senha</label>

					<TextField
						id="password"
						type="password"
						fullWidth
						size="small"
						placeholder="Digite sua senha"
						slotProps={{
							input: {
								startAdornment: (
									<LockOutlinedIcon className="input-icon" />
								),
							},
						}}
					/>
				</div>

				<div className="forgot-password">
					<Link to={ROUTES.signIn}>Esqueceu sua senha?</Link>
				</div>

				<Button
					type="submit"
					variant="contained"
					fullWidth
					className="submit-button"
				>
					Entrar
				</Button>
			</form>

			<div className="divider">
				<span>ou continue com</span>
			</div>

			<div className="social-buttons">
				<Button variant="outlined">
					<GoogleIcon className="input-icon" />

					<span className="social-media-login-name">Google</span>
				</Button>

				<Button variant="outlined">
					<GitHubIcon className="input-icon" />

					<span className="social-media-login-name">GitHub</span>
				</Button>
			</div>

			<p className="auth-redirect">
				Ainda não possui uma conta?{" "}
				<Link to={ROUTES.signUp}>Criar conta</Link>
			</p>
		</div>
	);
};

export default SignIn;
