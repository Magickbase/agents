import * as Server from './index'
import * as DataSource from './DataSource'

async function main() {
    await DataSource.init()
    await Server.start()
}

main()
