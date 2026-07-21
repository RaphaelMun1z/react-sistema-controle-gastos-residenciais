import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { peopleService } from "../services/peopleService";
import type { PaginationParams } from "../../../shared/api/apiTypes";
import type { CreatePersonInput } from "../types/person";

export const peopleQueryKey = ["people"] as const;
export const allPeopleQueryKey = ["people", "all"] as const;
export const personQueryKey = (id: string) => ["people", id] as const;

export const usePeople = (params: PaginationParams) =>
	useQuery({
		queryKey: [...peopleQueryKey, params.page, params.pageSize] as const,
		queryFn: () => peopleService.getPeople(params),
		placeholderData: keepPreviousData,
	});

export const useAllPeople = () =>
	useQuery({
		queryKey: allPeopleQueryKey,
		queryFn: () => peopleService.getAllPeople(),
	});

export const usePerson = (id: string) =>
	useQuery({
		queryKey: personQueryKey(id),
		queryFn: () => peopleService.getPersonById(id),
		enabled: id.length > 0,
	});

export const useCreatePerson = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreatePersonInput) => peopleService.createPerson(input),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: peopleQueryKey });
			void queryClient.invalidateQueries({ queryKey: allPeopleQueryKey });
			void queryClient.invalidateQueries({ queryKey: ["summary"] });
		},
	});
};

export const useDeletePerson = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => peopleService.deletePerson(id),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: peopleQueryKey });
			void queryClient.invalidateQueries({ queryKey: allPeopleQueryKey });
			void queryClient.invalidateQueries({ queryKey: ["transactions"] });
			void queryClient.invalidateQueries({ queryKey: ["summary"] });
		},
	});
};

export const useRemovePerson = useDeletePerson;
