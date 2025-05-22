import { ICommonObject, INode, INodeData, INodeParams } from '../../../../src/Interface'
import axios, { AxiosRequestConfig, Method, ResponseType } from 'axios'
import FormData from 'form-data'
import * as querystring from 'querystring'
import { getCredentialData, getCredentialParam } from '../../../../src/utils'

class AssetsQuery_Agentflow implements INode {
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
        this.label = 'AssetsQuery'
        this.name = 'assetsQueryFlow'
        this.version = 1.0
        this.type = 'AssetsQuery'
        this.category = 'Agent Flows'
        this.description = 'Query assets from the blockchain'
        this.baseClasses = [this.type]
        this.color = '#FF7F7F'
        this.inputs = [
            {
                label: 'Address',
                name: 'address',
                type: 'string'
            },
            {
                label: 'Address',
                name: 'address',
                type: 'array',
                // show: {
                //     bodyType: ['xWwwFormUrlencoded', 'formData']
                // },
                array: [
                    {
                        label: 'Address',
                        name: 'address',
                        type: 'string'
                    }
                ],
                optional: true
            }
        ]
    }

    async run(nodeData: INodeData, _: string, options: ICommonObject): Promise<any> {
        const method = nodeData.inputs?.address
        console.log('method: ', method)
    }
}

module.exports = { nodeClass: AssetsQuery_Agentflow }
