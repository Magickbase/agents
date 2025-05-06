import { INodeData, ICommonObject, INodeOutputsValue } from '../../../src/Interface'

import { PrivateNodeBase } from '../PrivateNodeBase'

interface FilterCondition {
    field: string
    condition: string
    value: string
}

const CONDITIONS = [
    'Equals',
    'Not Equals',
    'Contains',
    'Not Contains',
    'Greater Than',
    'Less Than',
    'Greater Than or Equal',
    'Less Than or Equal',
    'Starts With',
    'Ends With',
    'Is Empty',
    'Is Not Empty'
]

class FilterNode extends PrivateNodeBase {
    outputs: INodeOutputsValue[]
    constructor() {
        super()

        this.label = 'Filter'
        this.name = 'filter'
        this.version = 1.0
        this.type = 'Filter'
        this.icon = 'filter.svg'
        this.category = 'Utilities'
        this.description = 'Filter array items based on multiple field conditions'
        this.baseClasses = [this.type, 'Utilities']
        this.inputs = [
            {
                label: 'Input Array',
                name: 'inputArray',
                type: 'json',
                description: 'Array to filter',
                acceptVariable: true
            },
            {
                label: 'Filter Groups',
                name: 'filterGroups',
                type: 'datagrid',
                description: 'Groups of conditions to filter by',
                list: true,
                optional: true,
                additionalParams: true,
                datagrid: [
                    {
                        field: 'field',
                        headerName: 'Field',
                        type: 'string',
                        placeholder: 'e.g. user.name',
                        description: 'Field path to filter on',
                        editable: true,
                        flex: 0.3,
                        minWidth: 150
                    },
                    {
                        field: 'condition',
                        headerName: 'Condition',
                        type: 'singleSelect',
                        valueOptions: CONDITIONS,
                        editable: true,
                        flex: 0.3,
                        minWidth: 150
                    },
                    {
                        field: 'value',
                        headerName: 'Value',
                        type: 'string',
                        editable: true,
                        flex: 0.4,
                        minWidth: 150
                    }
                ]
            }
        ]

        this.outputs = [
            {
                label: 'Output',
                name: 'output',
                baseClasses: ['json']
            },
            {
                label: 'Ending Node',
                name: 'EndingNode',
                baseClasses: this.baseClasses
            }
        ]
    }

    private getNestedValue = (obj: any, path: string): any => path.split('.').reduce((current, key) => current?.[key] ?? null, obj)

    private evaluateCondition = (item: any, condition: FilterCondition): boolean => {
        const fieldValue = this.getNestedValue(item, condition.field)
        const strValue = String(fieldValue ?? '')
        const conditionValue = condition.value

        switch (condition.condition) {
            case 'Equals':
                return fieldValue === conditionValue
            case 'Not Equals':
                return fieldValue !== conditionValue
            case 'Contains':
                return strValue.includes(conditionValue)
            case 'Not Contains':
                return !strValue.includes(conditionValue)
            case 'Greater Than':
                return fieldValue > conditionValue
            case 'Less Than':
                return fieldValue < conditionValue
            case 'Greater Than or Equal':
                return fieldValue >= conditionValue
            case 'Less Than or Equal':
                return fieldValue <= conditionValue
            case 'Starts With':
                return strValue.startsWith(conditionValue)
            case 'Ends With':
                return strValue.endsWith(conditionValue)
            case 'Is Empty':
                return !fieldValue || strValue.trim() === ''
            case 'Is Not Empty':
                return fieldValue && strValue.trim() !== ''
            default:
                return false
        }
    }

    async init(nodeData: INodeData, input: string, options: ICommonObject): Promise<any> {
        const isEndingNode = nodeData?.outputs?.output === 'EndingNode'
        if (isEndingNode && !options.isRun) return // prevent running both init and run twice

        try {
            let inputData = nodeData.inputs?.inputArray

            // Parse input if it's a string
            if (typeof inputData === 'string') {
                try {
                    inputData = JSON.parse(inputData)
                } catch (e) {
                    throw new Error('Input must be a valid JSON array')
                }
            }

            if (!Array.isArray(inputData)) {
                throw new Error('Input must be an array')
            }

            const conditions = (nodeData.inputs?.filterGroups ?? []) as FilterCondition[]

            if (conditions.length === 0) {
                return inputData
            }

            // Apply filter conditions
            const filteredArray = inputData.filter((item) => {
                const results = conditions.map((condition) => this.evaluateCondition(item, condition))
                return results.every(Boolean)
            })

            return filteredArray
        } catch (error) {
            throw new Error(`Error in FilterNode: ${error.message}`)
        }
    }

    async run(nodeData: INodeData, input: string, options: ICommonObject): Promise<any> {
        return await this.init(nodeData, input, { ...options, isRun: true })
    }
}

module.exports = { nodeClass: FilterNode }
