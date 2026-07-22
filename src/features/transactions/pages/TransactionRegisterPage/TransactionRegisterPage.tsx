import "./TransactionRegisterPage.scss";

import {
	Alert,
	Autocomplete,
	Button,
	FormControl,
	FormHelperText,
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
import {
	transactionSchema,
	type TransactionFormData,
} from "../../schemas/transactionSchema";
import { useCreateTransaction } from "../../hooks/useTransactions";
import { usePeopleSearch } from "../../../people/hooks/usePeople";
import { useEffect, useMemo, useState } from "react";
import ErrorState from "../../../../shared/components/DataState/ErrorState";
import EmptyState from "../../../../shared/components/DataState/EmptyState";
import {
	getApiErrorFeedback,
	getApiErrorTitle,
	getValidationFieldErrors,
} from "../../../../shared/api/apiError";
import { TransactionType } from "../../types/transaction";
import { transactionTypeOptions } from "../../utils/transactionLabels";
import type { Person } from "../../../people/types/person";
import { getTodayDateOnly } from "../../../../shared/utils/dateOnly";

const TransactionsRegisterHeaderData = {
	sector: "Transações",
	sectorPath: "/transacoes",
	currentPage: "Registrar",
	title: "Registrar Transação",
};

const peoplePageSize = 10;

const TransactionRegisterPage = () => {
	const navigate = useNavigate();
	const createTransaction = useCreateTransaction();
	const [personSearch, setPersonSearch] = useState("");
	const [debouncedPersonSearch, setDebouncedPersonSearch] = useState("");
	const {
		data: peopleData,
		error: peopleError,
		isError: isPeopleError,
		isLoading: isPeopleLoading,
		isFetching: isPeopleFetching,
		refetch: refetchPeople,
	} = usePeopleSearch({
		page: 1,
		pageSize: peoplePageSize,
		search: debouncedPersonSearch,
	});
	const peopleErrorFeedback = getApiErrorFeedback(
		peopleError,
		"peopleOptionsLoad",
	);
	const [submitError, setSubmitError] = useState("");
	const {
		control,
		register,
		handleSubmit,
		setError,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<TransactionFormData>({
		resolver: zodResolver(transactionSchema),
		defaultValues: {
			personId: "",
			type: TransactionType.Expense,
			description: "",
			amount: 0,
			transactionDate: getTodayDateOnly(),
		},
	});
	const peopleOptions = useMemo(() => peopleData?.content ?? [], [peopleData]);
	const selectedPersonId = useWatch({ control, name: "personId" });
	const selectedType = useWatch({ control, name: "type" });
	const selectedPerson = useMemo(
		() => peopleOptions.find((person) => person.id === selectedPersonId) ?? null,
		[peopleOptions, selectedPersonId],
	);
	const isSelectedPersonUnderAge = Boolean(
		selectedPerson && selectedPerson.age < 18,
	);
	const isPeopleInitialLoading = isPeopleLoading && peopleOptions.length === 0;
	const isPeopleBlockingError = isPeopleError && peopleOptions.length === 0;

	useEffect(() => {
		const timeout = globalThis.setTimeout(() => {
			setDebouncedPersonSearch(personSearch.trim());
		}, 350);

		return () => globalThis.clearTimeout(timeout);
	}, [personSearch]);

	useEffect(() => {
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

			if (
				selectedPerson?.age !== undefined &&
				selectedPerson.age < 18 &&
				data.type === TransactionType.Revenue
			) {
				setSubmitError(
					"Pessoas menores de 18 anos podem registrar apenas despesas.",
				);
				return;
			}

			await createTransaction.mutateAsync(data);
			navigate(ROUTES.transactions);
		} catch (error) {
			const fieldErrors = getValidationFieldErrors(error);
			Object.entries(fieldErrors).forEach(([field, message]) => {
				if (
					field === "personId" ||
					field === "type" ||
					field === "description" ||
					field === "amount" ||
					field === "transactionDate"
				) {
					setError(field, { message });
				}
			});
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
								title="Nenhuma pessoa encontrada."
								description="Cadastre uma pessoa ou ajuste a busca antes de registrar transações."
							/>
						)}

						<form
							className="transaction-form"
							onSubmit={handleSubmit(onSubmit)}
						>
							{submitError && <Alert severity="error">{submitError}</Alert>}
							{isPeopleError && peopleOptions.length > 0 && (
								<Alert severity="warning">
									Não foi possível carregar pessoas agora.
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
											<Autocomplete<Person>
												options={peopleOptions}
												value={selectedPerson}
												inputValue={personSearch}
												loading={isPeopleFetching}
												getOptionLabel={(person) => person.name}
												isOptionEqualToValue={(option, value) =>
													option.id === value.id
												}
												onInputChange={(_event, value) =>
													setPersonSearch(value)
												}
												onChange={(_event, person) => {
													field.onChange(person?.id ?? "");
												}}
												renderInput={(params) => (
													<TextField
														{...params}
														label="Pessoa"
														inputRef={field.ref}
														onBlur={field.onBlur}
														error={Boolean(fieldState.error)}
														helperText={fieldState.error?.message}
													/>
												)}
											/>
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
											? "Pessoas menores de 18 anos podem registrar apenas despesas."
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

								<TextField
									label="Data da transação"
									type="date"
									fullWidth
									{...register("transactionDate")}
									error={Boolean(errors.transactionDate)}
									helperText={errors.transactionDate?.message}
									slotProps={{
										htmlInput: {
											max: getTodayDateOnly(),
										},
										inputLabel: {
											shrink: true,
										},
									}}
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
										isPeopleBlockingError ||
										isPeopleInitialLoading
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
