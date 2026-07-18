import "../../../../components/layout/AuthTemplate/AuthTemplate.scss";

// Componentes do Material UI
import { Button, TextField } from "@mui/material";

// Ícones
import PersonIcon from "@mui/icons-material/Person";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";

// React Router
import { Link } from "react-router";

const SignUp = () => {
	return (
		<div className="form-container">
			<header className="form-header">
				<h1>Crie sua conta</h1>
			</header>

			<form className="auth-form">
				<div className="input-container">
					<label htmlFor="name">Nome</label>

					<TextField
						id="name"
						fullWidth
						size="small"
						placeholder="Digite seu nome"
						slotProps={{
							input: {
								startAdornment: (
									<PersonIcon className="input-icon" />
								),
							},
						}}
					/>
				</div>

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
						placeholder="Crie uma senha"
						slotProps={{
							input: {
								startAdornment: (
									<LockOutlinedIcon className="input-icon" />
								),
							},
						}}
					/>

					<span className="input-helper">
						A senha deve possuir pelo menos 8 caracteres.
					</span>
				</div>

				<div className="input-container">
					<label htmlFor="confirm-password">Confirmar senha</label>

					<TextField
						id="confirm-password"
						type="password"
						fullWidth
						size="small"
						placeholder="Confirme sua senha"
						slotProps={{
							input: {
								startAdornment: (
									<LockOutlinedIcon className="input-icon" />
								),
							},
						}}
					/>
				</div>

				<Button
					type="submit"
					variant="contained"
					fullWidth
					className="submit-button"
				>
					Criar conta
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
				Já possui uma conta? <Link to="/entrar">Entrar</Link>
			</p>
		</div>
	);
};

export default SignUp;
