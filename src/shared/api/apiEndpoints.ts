export const API_ENDPOINTS = {
	auth: {
		signIn: "/auth/signin",
		signUp: "/auth/signup",
		signOut: "/auth/signout",
		currentUser: "/auth/me",
	},
	people: "/people",
	personById: (id: number) => `/people/${id}`,
	transactions: "/transactions",
	transactionById: (id: number) => `/transactions/${id}`,
	summary: "/summary",
} as const;
