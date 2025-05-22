import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { TRPCRouter } from '@magickbase/p'
import superjson from 'superjson'

export const trpcClient = createTRPCClient<TRPCRouter>({
    links: [
        httpBatchLink({
            url: 'https://web3-api-sta.magickbase.com/api/trpc',
            // @ts-ignore - ignore type check for superjson since we are using the server's transformer
            transformer: superjson
        })
    ]
})
