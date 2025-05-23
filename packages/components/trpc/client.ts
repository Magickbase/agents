import { createTRPCClient, httpBatchLink, TRPCClient } from '@trpc/client'
import type { TRPCRouter } from '@magickbase/p'
import { dynamicImport } from 'tsimportlib'

let trpcClient: TRPCClient<TRPCRouter>

export async function getTrpcClient(): Promise<TRPCClient<TRPCRouter>> {
    if (!trpcClient) {
        const superjson = await dynamicImport('superjson', module)
        trpcClient = createTRPCClient<TRPCRouter>({
            links: [
                httpBatchLink({
                    url: 'https://web3-api-sta.magickbase.com/api/trpc',
                    // @ts-ignore - ignore type check for superjson since we are using the server's transformer
                    transformer: superjson
                })
            ]
        })
    }
    return trpcClient
}
