import { ICommonObject, INode, INodeData, INodeParams } from '../../../../src/Interface'
import { getTrpcClient } from '../../../../trpc/client'

class TxQuery_Agentflow implements INode {
    label: string
    name: string
    version: number
    description: string
    type: string
    icon: string
    category: string
    color: string
    baseClasses: string[]
    documentation?: string
    credential: INodeParams
    inputs: INodeParams[]

    constructor() {
        this.label = 'TxQuery'
        this.name = 'txQueryFlow'
        this.version = 1.0
        this.type = 'TxQuery'
        this.category = 'Agent Flows'
        this.description = 'Query transactions from the blockchain'
        this.baseClasses = [this.type]
        this.color = '#FF7F7F'
        this.inputs = [
            {
                label: 'Address(split by comma)',
                name: 'addressList',
                type: 'string',
                acceptVariable: true,
                acceptNodeOutputAsVariable: true
            }
        ]
    }

    async run(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        try {
            const trpcClient = await getTrpcClient()
            const addressList = nodeData.inputs?.addressList
            const finalAddressList = addressList
                .split(',')
                ?.filter((item: any) => !!item)
                .map((item: any) => ({ address: item.trim() }))

            const res = await Promise.all(
                finalAddressList.map(async (item: any) => {
                    const txs = await trpcClient.address.transactions.query({
                        address: item.address,
                        orderBy: ['time'],
                        pageSize: 10
                    })
                    return [item.address, txs.data]
                })
            )
            const returnOutput = {
                id: nodeData.id,
                name: this.name,
                input: {
                    addressList: finalAddressList
                },
                output: {
                    txQuery: res
                },
                state: options.agentflowRuntime?.state
            }

            return returnOutput
        } catch (error) {
            console.error('error: ', error)
            return []
        }
    }
}

module.exports = { nodeClass: TxQuery_Agentflow }
