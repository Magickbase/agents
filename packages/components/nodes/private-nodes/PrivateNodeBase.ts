import { INode, INodeParams } from '../../src/Interface'

/**
 * Base class for private nodes that ensures proper labeling convention
 * by automatically prefixing node labels with 'private_' when necessary.
 */
export abstract class PrivateNodeBase implements INode {
    label: string = ''

    /** The display name of the node */
    name: string = ''

    /** The version number of the node implementation */
    version: number = 1.0

    /** The node type identifier */
    type: string = ''

    /** Icon path or identifier for UI representation */
    icon: string = ''

    /** Category the node belongs to for organizational purposes */
    category: string = ''

    /** Detailed description of the node's purpose and functionality */
    description: string = ''

    /** Base classes that this node extends or implements */
    baseClasses: string[] = []

    /** Optional credential configuration for authenticated operations */
    credential?: INodeParams

    /** Configuration inputs that this node accepts */
    inputs: INodeParams[] = []
}
