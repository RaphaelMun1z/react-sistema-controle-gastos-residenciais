import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	TextField,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import type { Person } from "../../people/types/person";
import type { SummaryFilters as SummaryFiltersValue } from "../types/summary";

interface SummaryFiltersProps {
	filters: SummaryFiltersValue;
	people: Person[];
	onChange: (filters: SummaryFiltersValue) => void;
	onClear: () => void;
}

const SummaryFilters = ({
	filters,
	people,
	onChange,
	onClear,
}: SummaryFiltersProps) => {
	return (
		<div className="summary-filters">
			<div className="filters-header">
				<FilterAltIcon />

				<div>
					<strong>Filtros</strong>
				</div>
			</div>

			<div className="filters-fields">
				<FormControl size="small">
					<InputLabel id="person-filter-label">Pessoa</InputLabel>

					<Select
						labelId="person-filter-label"
						label="Pessoa"
						value={filters.personId}
						onChange={(event) =>
							onChange({ ...filters, personId: event.target.value })
						}
					>
						<MenuItem value="all">Todas as pessoas</MenuItem>

						{people.map((person) => (
							<MenuItem key={person.id} value={String(person.id)}>
								{person.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<TextField
					label="Data inicial"
					type="date"
					size="small"
					value={filters.startDate}
					disabled
					helperText="Filtro indisponível no contrato atual"
					onChange={(event) =>
						onChange({ ...filters, startDate: event.target.value })
					}
					slotProps={{
						inputLabel: {
							shrink: true,
						},
					}}
				/>

				<TextField
					label="Data final"
					type="date"
					size="small"
					value={filters.endDate}
					disabled
					helperText="Filtro indisponível no contrato atual"
					onChange={(event) =>
						onChange({ ...filters, endDate: event.target.value })
					}
					slotProps={{
						inputLabel: {
							shrink: true,
						},
					}}
				/>

				<Button
					variant="text"
					startIcon={<RestartAltIcon />}
					onClick={onClear}
					sx={{
						color: "#6b7280",
						textTransform: "none",
					}}
				>
					Limpar
				</Button>
			</div>
		</div>
	);
};

export default SummaryFilters;
