import type { ReactNode } from "react";

// Componentes do Material UI
import {
	IconButton,
	Paper,
	Table as MuiTable,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
} from "@mui/material";

// Interfaces
export interface TableColumn<T> {
	key: keyof T | string;
	label: string;
	align?: "left" | "center" | "right";
	render?: (row: T) => ReactNode;
}

export interface TableAction<T> {
	label: string;
	icon: ReactNode;
	color?:
		| "inherit"
		| "primary"
		| "secondary"
		| "error"
		| "info"
		| "success"
		| "warning";
	onClick: (row: T) => void;
}

interface TableProps<T> {
	columns: TableColumn<T>[];
	rows: T[];
	getRowId: (row: T) => string | number;
	actions?: TableAction<T>[];
	emptyMessage?: string;
}

const Table = <T,>({
	columns,
	rows,
	getRowId,
	actions = [],
	emptyMessage = "Nenhum registro encontrado.",
}: TableProps<T>) => {
	return (
		<TableContainer
			component={Paper}
			elevation={0}
			sx={{
				backgroundColor: "#f5f5f5",
			}}
		>
			<MuiTable>
				<TableHead>
					<TableRow>
						{columns.map((column) => (
							<TableCell
								key={String(column.key)}
								align={column.align ?? "left"}
							>
								{column.label}
							</TableCell>
						))}

						{actions.length > 0 && (
							<TableCell align="center">Ações</TableCell>
						)}
					</TableRow>
				</TableHead>

				<TableBody>
					{rows.length > 0 ? (
						rows.map((row) => (
							<TableRow
								key={getRowId(row)}
								hover
								sx={{
									"&:nth-of-type(odd)": {
										backgroundColor: "#f1f1f1",
									},
									"&:nth-of-type(even)": {
										backgroundColor: "#f5f5f5",
									},
								}}
							>
								{columns.map((column) => (
									<TableCell
										key={String(column.key)}
										align={column.align ?? "left"}
									>
										{column.render
											? column.render(row)
											: String(
													row[
														column.key as keyof T
													] ?? "",
												)}
									</TableCell>
								))}

								{actions.length > 0 && (
									<TableCell align="center">
										{actions.map((action) => (
											<Tooltip
												key={action.label}
												title={action.label}
											>
												<IconButton
													color={action.color}
													onClick={() =>
														action.onClick(row)
													}
												>
													{action.icon}
												</IconButton>
											</Tooltip>
										))}
									</TableCell>
								)}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								colSpan={
									columns.length +
									(actions.length > 0 ? 1 : 0)
								}
								align="center"
							>
								{emptyMessage}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</MuiTable>
		</TableContainer>
	);
};

export default Table;
