import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { peopleService } from "../services/peopleService";
import type { CreatePersonInput, UpdatePersonInput } from "../types/person";

export const peopleQueryKey = ["people"] as const;
export const personQueryKey = (id: number) => ["people", id] as const;

export const usePeople = () =>
	useQuery({
		queryKey: peopleQueryKey,
		queryFn: peopleService.getPeople,
	});

export const usePerson = (id: number) =>
	useQuery({
		queryKey: personQueryKey(id),
		queryFn: () => peopleService.getPersonById(id),
		enabled: id > 0,
	});

export const useCreatePerson = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreatePersonInput) => peopleService.createPerson(input),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: peopleQueryKey });
		},
	});
};

export const useUpdatePerson = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, input }: { id: number; input: UpdatePersonInput }) =>
			peopleService.updatePerson(id, input),
		onSuccess: (_person, variables) => {
			void queryClient.invalidateQueries({ queryKey: peopleQueryKey });
			void queryClient.invalidateQueries({
				queryKey: personQueryKey(variables.id),
			});
		},
	});
};

export const useDeletePerson = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => peopleService.deletePerson(id),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: peopleQueryKey });
			void queryClient.invalidateQueries({ queryKey: ["transactions"] });
			void queryClient.invalidateQueries({ queryKey: ["summary"] });
		},
	});
};

export const useRemovePerson = useDeletePerson;
