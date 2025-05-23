import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import PropTypes from 'prop-types'

const AssetsDetail = ({ assetsQuery }) => {
    const csvData = [
        ['address', 'asset', 'amount', 'value'],
        ...assetsQuery.map((asset) => asset.assets.map((a) => [asset.address, a.assetInfo.symbol, a.assetAmount, a.value])).flat()
    ].join('\n')

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
                <Typography variant='h5'>Assets</Typography>
                <Button onClick={handleDownloadCsv}>Download CSV</Button>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {assetsQuery.map((asset) => (
                    <Box key={asset.address} sx={{ backgroundColor: '#eee', p: 2, borderRadius: 2 }}>
                        <Typography variant='h5' sx={{ whiteSpace: 'wrap', wordBreak: 'break-all' }}>
                            Address: {asset.address}
                        </Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Asset</TableCell>
                                    <TableCell>Amount</TableCell>
                                    <TableCell>Value</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {asset.assets.map((asset) => (
                                    <TableRow key={asset.assetInfo.symbol}>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <img src={asset.assetInfo.icon} alt={asset.assetInfo.symbol} />
                                                <Typography variant='body1'>{asset.assetInfo.symbol}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{asset.assetAmount ?? 'N/A'}</TableCell>
                                        <TableCell>{asset.value ? `$${asset.value}` : 'N/A'}</TableCell>
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

AssetsDetail.propTypes = {
    assetsQuery: PropTypes.array.isRequired
}

export default AssetsDetail
