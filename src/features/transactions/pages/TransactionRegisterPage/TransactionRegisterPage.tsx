import "./TransactionRegisterPage.scss";

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
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import PageHeader from "../../../../shared/components/PageHeader/PageHeader";
import { Link, useNavigate } from "react-router";
import { ROUTES } from "../../../../app/routes/paths";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import {
	transactionSchema,
	type TransactionFormData,
} from "../../schemas/transactionSchema";
import { useCreateTransaction } from "../../hooks/useTransactions";
import { peopleQueryKey, usePeople } from "../../../people/hooks/usePeople";
import { useMemo, useState } from "react";
import { useEffect } from "react";
import ErrorState from "../../../../shared/components/DataState/ErrorState";
import EmptyState from "../../../../shared/components/DataState/EmptyState";
import {
	getApiErrorFeedback,
	getApiErrorTitle,
} from "../../../../shared/api/apiError";
import { TransactionType } from "../../types/transaction";
import { transactionTypeOptions } from "../../utils/transactionLabels";
import type { Person } from "../../../people/types/person";
import type { PagedResponse } from "../../../../shared/api/apiTypes";

const TransactionsRegisterHeaderData = {
	sector: "Transações",
	sectorPath: "/transacoes",
	currentPage: "Registrar",
	title: "Registrar Transação",
};

const TransactionRegisterPage = () => {
	const navigate = useNavigate();
	const createTransaction = useCreateTransaction();
	const queryClient = useQueryClient();
	const [peoplePage, setPeoplePage] = useState(1);
	const peoplePageSize = 10;
	const {
		data: peopleData,
		error: peopleError,
		isError: isPeopleError,
		isLoading: isPeopleLoading,
		isFetching: isPeopleFetching,
		refetch: refetchPeople,
	} = usePeople({ page: peoplePage, pageSize: peoplePageSize });
	const peopleErrorFeedback = getApiErrorFeedback(
		peopleError,
		"peopleOptionsLoad",
	);
	const [submitError, setSubmitError] = useState("");
	const {
		control,
		register,
		handleSubmit,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<TransactionFormData>({
		resolver: zodResolver(transactionSchema),
		defaultValues: {
			personId: "",
			type: TransactionType.Expense,
			description: "",
			amount: 0,
		},
	});
	const peopleOptions = useMemo(() => {
		const peopleById = new Map<string, Person>();
		const cachedPeoplePages = queryClient.getQueriesData<PagedResponse<Person>>(
			{
				queryKey: peopleQueryKey,
			},
		);

		cachedPeoplePages.forEach(([, page]) => {
			page?.content?.forEach((person) => {
				peopleById.set(person.id, person);
			});
		});
		peopleData?.content.forEach((person) => {
			peopleById.set(person.id, person);
		});

		return Array.from(peopleById.values());
	}, [peopleData, queryClient]);
	const selectedPersonId = useWatch({ control, name: "personId" });
	const selectedType = useWatch({ control, name: "type" });
	const selectedPerson = peopleOptions.find(
		(person) => person.id === selectedPersonId,
	);
	const isSelectedPersonUnderAge = Boolean(
		selectedPerson && selectedPerson.age < 18,
	);
	const isPeopleInitialLoading = isPeopleLoading && peopleOptions.length === 0;
	const isPeopleBlockingError = isPeopleError && peopleOptions.length === 0;
	const hasMorePeople = peoplePage < (peopleData?.totalPages ?? 0);

	useEffect(() => {
		// A API também deve validar, mas o formulário já protege a UX contra receitas para menores.
		if (isSelectedPersonUnderAge && selectedType === TransactionType.Revenue) {
			setValue("type", TransactionType.Expense, {
				shouldDirty: true,
				shouldTouch: true,
				shouldValidate: true,
			});
		}
	}, [isSelectedPersonUnderAge, selectedType, setValue]);

	const onSubmit = async (data: TransactionFormData) => {
		try {
			setSubmitError("");
			const person = peopleOptions.find(
				(person) => person.id === data.personId,
			);

			if (
				person?.age !== undefined &&
				person.age < 18 &&
				data.type === TransactionType.Revenue
			) {
				setSubmitError(
					"Pessoas menores de 18 anos só podem ter despesas cadastradas.",
				);
				return;
			}

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
				{isPeopleBlockingError && (
					<ErrorState
						title={peopleErrorFeedback.title}
						description={peopleErrorFeedback.description}
						actionLabel={peopleErrorFeedback.actionLabel}
						onRetry={() => void refetchPeople()}
					/>
				)}

				{!isPeopleBlockingError && (
					<>
						{!isPeopleInitialLoading && peopleOptions.length === 0 && (
							<EmptyState
								title="Nenhuma pessoa cadastrada ainda."
								description="Cadastre uma pessoa antes de registrar transações."
							/>
						)}

						<form
							className="transaction-form"
							onSubmit={handleSubmit(onSubmit)}
						>
							{submitError && <Alert severity="error">{submitError}</Alert>}
							{isPeopleError && peopleOptions.length > 0 && (
								<Alert severity="warning">
									Nao foi possivel carregar mais pessoas agora.
								</Alert>
							)}

							<div className="transaction-form__grid">
								{isPeopleInitialLoading ? (
									<Skeleton
										animation="wave"
										variant="rounded"
										height={56}
										aria-label="Carregando pessoas"
									/>
								) : (
									<Controller
										name="personId"
										control={control}
										render={({ field, fieldState }) => (
											<TextField
												select
												fullWidth
												label="Pessoa"
												value={field.value ?? ""}
												onChange={(event) => field.onChange(event.target.value)}
												onBlur={field.onBlur}
												inputRef={field.ref}
												error={Boolean(fieldState.error)}
												helperText={fieldState.error?.message}
											>
												<MenuItem value="">
													<em>Selecione uma pessoa</em>
												</MenuItem>

												{peopleOptions.map((person) => (
													<MenuItem key={person.id} value={person.id}>
														{person.name}
													</MenuItem>
												))}
											</TextField>
										)}
									/>
								)}

								<FormControl fullWidth error={Boolean(errors.type)}>
									<InputLabel id="type-label">Tipo</InputLabel>

									<Controller
										name="type"
										control={control}
										render={({ field }) => (
											<Select {...field} labelId="type-label" label="Tipo">
												{transactionTypeOptions.map((option) => (
													<MenuItem
														key={option.value}
														value={option.value}
														disabled={
															option.value === TransactionType.Revenue &&
															isSelectedPersonUnderAge
														}
													>
														{option.label}
													</MenuItem>
												))}
											</Select>
										)}
									/>
									<FormHelperText>
										{isSelectedPersonUnderAge
											? "Pessoas menores de 18 anos só podem ter despesas cadastradas."
											: errors.type?.message}
									</FormHelperText>
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
									{...register("amount", { valueAsNumber: true })}
									error={Boolean(errors.amount)}
									helperText={errors.amount?.message}
								/>
							</div>

							{hasMorePeople && (
								<Button
									type="button"
									variant="text"
									onClick={() =>
										setPeoplePage((currentPage) => currentPage + 1)
									}
									disabled={isPeopleFetching}
								>
									{isPeopleFetching
										? "Carregando pessoas..."
										: "Carregar mais pessoas"}
								</Button>
							)}

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
										isPeopleBlockingError ||
										isPeopleInitialLoading ||
										peopleOptions.length === 0
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
					</>
				)}
			</div>
		</section>
	);
};

export default TransactionRegisterPage;
