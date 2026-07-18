import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { peopleService } from "../services/peopleService";
import type { CreatePersonInput } from "../types/person";

export const peopleQueryKey = ["people"] as const;

export const usePeople = () =>
	useQuery({
		queryKey: peopleQueryKey,
		queryFn: peopleService.list,
	});

export const useCreatePerson = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreatePersonInput) => peopleService.create(input),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: peopleQueryKey });
		},
	});
};

export const useRemovePerson = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => peopleService.remove(id),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: peopleQueryKey });
		},
	});
};
