import "./TransactionRegisterPage.scss";

// Componentes do Material UI
import {
	Alert,
	Button,
	FormHelperText,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Skeleton,
	TextField,
} from "@mui/material";

// Ícones do Material Icons
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

// Componentes Locais
import PageHeader from "../../../../shared/components/PageHeader/PageHeader";
import { Link, useNavigate } from "react-router";
import { ROUTES } from "../../../../app/routes/paths";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	transactionSchema,
	type TransactionFormData,
} from "../../schemas/transactionSchema";
import { useCreateTransaction } from "../../hooks/useTransactions";
import { usePeople } from "../../../people/hooks/usePeople";
import { useState } from "react";
import ErrorState from "../../../../shared/components/DataState/ErrorState";
import {
	getApiErrorFeedback,
	getApiErrorTitle,
} from "../../../../shared/api/apiError";

const TransactionsRegisterHeaderData = {
	sector: "Transações",
	sectorPath: "/transacoes",
	currentPage: "Registrar",
	title: "Registrar Transação",
};

const TransactionRegisterPage = () => {
	const navigate = useNavigate();
	const createTransaction = useCreateTransaction();
	const {
		data: people = [],
		error: peopleError,
		isError: isPeopleError,
		isLoading: isPeopleLoading,
		refetch: refetchPeople,
	} = usePeople();
	const peopleErrorFeedback = getApiErrorFeedback(peopleError, "peopleOptionsLoad");
	const [submitError, setSubmitError] = useState("");
	const {
		control,
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<TransactionFormData>({
		resolver: zodResolver(transactionSchema),
		defaultValues: {
			personId: 0,
			type: "expense",
			description: "",
			value: 0,
			category: "",
			date: "",
			observation: "",
		},
	});

	const onSubmit = async (data: TransactionFormData) => {
		try {
			setSubmitError("");
			await createTransaction.mutateAsync(data);
			navigate(ROUTES.transactions);
		} catch (error) {
			setSubmitError(getApiErrorTitle(error, "transactionsCreate"));
		}
	};

	return (
		<section className="transaction-register-page">
			<PageHeader data={TransactionsRegisterHeaderData} />

			<div className="transaction-register-page__form-container">
				{isPeopleError && (
					<ErrorState
						title={peopleErrorFeedback.title}
						description={peopleErrorFeedback.description}
						actionLabel={peopleErrorFeedback.actionLabel}
						onRetry={() => void refetchPeople()}
					/>
				)}

				{!isPeopleError && (
				<form className="transaction-form" onSubmit={handleSubmit(onSubmit)}>
					{submitError && <Alert severity="error">{submitError}</Alert>}

					<div className="transaction-form__grid">
						{isPeopleLoading ? (
							<Skeleton
								animation="wave"
								variant="rounded"
								height={56}
								aria-label="Carregando pessoas"
							/>
						) : (
							<FormControl fullWidth error={Boolean(errors.personId)}>
								<InputLabel id="person-label">Pessoa</InputLabel>

								<Controller
									name="personId"
									control={control}
									render={({ field }) => (
										<Select
											{...field}
											labelId="person-label"
											label="Pessoa"
										>
											<MenuItem value={0}>
												<em>Selecione uma pessoa</em>
											</MenuItem>

											{people.map((person) => (
												<MenuItem
													key={person.id}
													value={person.id}
												>
													{person.name}
												</MenuItem>
											))}
										</Select>
									)}
								/>
								<FormHelperText>
									{errors.personId?.message}
								</FormHelperText>
							</FormControl>
						)}

						<FormControl fullWidth error={Boolean(errors.type)}>
							<InputLabel id="type-label">Tipo</InputLabel>

							<Controller
								name="type"
								control={control}
								render={({ field }) => (
									<Select
										{...field}
										labelId="type-label"
										label="Tipo"
									>
										<MenuItem value="income">Entrada</MenuItem>

										<MenuItem value="expense">Saída</MenuItem>
									</Select>
								)}
							/>
							<FormHelperText>{errors.type?.message}</FormHelperText>
						</FormControl>

						<TextField
							label="Descrição"
							placeholder="Ex.: Conta de energia"
							fullWidth
							{...register("description")}
							error={Boolean(errors.description)}
							helperText={errors.description?.message}
						/>

						<TextField
							label="Valor"
							type="number"
							fullWidth
							{...register("value", { valueAsNumber: true })}
							error={Boolean(errors.value)}
							helperText={errors.value?.message}
						/>

						<FormControl fullWidth error={Boolean(errors.category)}>
							<InputLabel id="category-label">
								Categoria
							</InputLabel>

							<Controller
								name="category"
								control={control}
								render={({ field }) => (
									<Select
										{...field}
										labelId="category-label"
										label="Categoria"
									>
										<MenuItem value="">
											<em>Selecione uma categoria</em>
										</MenuItem>
										<MenuItem value="Alimentação">
											Alimentação
										</MenuItem>

										<MenuItem value="Moradia">Moradia</MenuItem>

										<MenuItem value="Transporte">
											Transporte
										</MenuItem>

										<MenuItem value="Saúde">Saúde</MenuItem>

										<MenuItem value="Outros">Outros</MenuItem>
									</Select>
								)}
							/>
							<FormHelperText>
								{errors.category?.message}
							</FormHelperText>
						</FormControl>

						<TextField
							label="Data"
							type="date"
							fullWidth
							{...register("date")}
							error={Boolean(errors.date)}
							helperText={errors.date?.message}
							slotProps={{
								inputLabel: {
									shrink: true,
								},
							}}
						/>
					</div>

					<div className="transaction-form__observation">
						<TextField
							label="Observação"
							multiline
							rows={3}
							fullWidth
							{...register("observation")}
						/>
					</div>

					<div className="transaction-form__actions">
						<Button
							component={Link}
							to={ROUTES.transactions}
							variant="outlined"
							startIcon={<CloseIcon />}
							sx={{
								color: "#6b7280",
								borderColor: "#d1d5db",
								boxShadow: "none",

								"&:hover": {
									borderColor: "#9ca3af",
									backgroundColor: "#f3f4f6",
									boxShadow: "none",
								},
							}}
						>
							Cancelar
						</Button>

						<Button
							type="submit"
							variant="contained"
							startIcon={<SaveIcon />}
							loading={isSubmitting}
							disabled={
								isSubmitting ||
								createTransaction.isPending ||
								isPeopleError ||
								isPeopleLoading
							}
							sx={{
								backgroundColor: "#2e7d32",
								boxShadow: "none",

								"&:hover": {
									backgroundColor: "#256b2a",
									boxShadow: "none",
								},
							}}
						>
							SALVAR
						</Button>
					</div>
				</form>
				)}
			</div>
		</section>
	);
};

export default TransactionRegisterPage;
