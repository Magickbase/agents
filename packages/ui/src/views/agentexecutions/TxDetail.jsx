import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import moment from 'moment'
import PropTypes from 'prop-types'

const TxDetail = ({ txQuery }) => {
    const csvData = [
        'Address,Time,Hash,Block,From,To,Value',
        ...txQuery.map((addressTx) =>
            addressTx[1].map((tx) => [
                addressTx[0],
                moment(tx.time).format('YYYY-MM-DD HH:mm:ss'),
                tx.txHash,
                tx.blockNumber,
                tx.fromAddresses.join(','),
                tx.toAddresses.join(','),
                tx.changes
                    .map((change) => {
                        const asset = tx.assets.find((a) => a.id === change.assetId)
                        return `${asset.symbol}:${Number(change.value) / 10 ** asset.decimals}`
                    })
                    .join(',')
            ])
        )
    ]
        .flat()
        .join('\n')

    const handleDownloadCsv = () => {
        const blob = new Blob([csvData], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'assets.csv'
        a.click()
        URL.revokeObjectURL(url)
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='h5'>Transactions</Typography>
                <Button onClick={handleDownloadCsv}>Download CSV</Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {txQuery.map((addressTx) => (
                    <Box key={addressTx[0]} sx={{ backgroundColor: '#eee', p: 2, borderRadius: 2 }}>
                        <Typography variant='h5' sx={{ whiteSpace: 'wrap', wordBreak: 'break-all' }}>
                            Address: {addressTx[0]}
                        </Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Hash</TableCell>
                                    <TableCell>Block</TableCell>
                                    <TableCell>From</TableCell>
                                    <TableCell>To</TableCell>
                                    <TableCell>Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {addressTx[1].map((tx) => (
                                    <TableRow key={tx.txHash}>
                                        <TableCell>{moment(tx.time).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                                        <TableCell>
                                            {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}
                                        </TableCell>
                                        <TableCell>{tx.blockNumber}</TableCell>
                                        <TableCell>
                                            <Box>
                                                {tx.fromAddresses.map((address) => (
                                                    <Typography variant='body1' key={address}>
                                                        {address.slice(0, 6)}...{address.slice(-4)}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box>
                                                {tx.toAddresses.map((address) => (
                                                    <Typography variant='body1' key={address}>
                                                        {address.slice(0, 6)}...{address.slice(-4)}
                                                    </Typography>
                                                ))}
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                                {tx.changes.map((change) => {
                                                    const asset = tx.assets.find((a) => a.id === change.assetId)
                                                    return (
                                                        <Typography key={asset.id}>
                                                            {asset.symbol}:{Number(change.value) / 10 ** asset.decimals}
                                                        </Typography>
                                                    )
                                                })}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

TxDetail.propTypes = {
    txQuery: PropTypes.array.isRequired
}

export default TxDetail
