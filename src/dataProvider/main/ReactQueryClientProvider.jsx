"use client";

import { QueryClientProvider, QueryClient } from "react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60000,
            gcTime: 10 * (60 * 1000)
        }
    }
});

export const ReactQueryClientProvider = ({
    children,
}) => (<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>)