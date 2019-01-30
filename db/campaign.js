const Archetype = require('archetype-js')

module.exports = new Archetype({
    address: {
        $type: 'string',
        $required: true
    },
    name: {
        $type: 'string',
        $required: true
    },
    description: {
        $type: 'string',
        $required: true
    },
    target: {
        $type: 'number',
        $required: true
    },
    image_hash: {
        $type: 'string',
        $required: true
    },
    transaction_details: {
        blockHash: {$type: 'string'},
        blockNumber: {$type: 'string'},
        contractAddress: {$type: 'string'},
        cumulativeGasUsed: {$type: 'string'},
        from: {$type: 'string'},
        gasUsed: {$type: 'string'},
        logsBloom: {$type: 'string'},
        status: {$type: 'string'},
        to: {$type: 'string'},
        transactionHash: {$type: 'string'},
        transactionIndex: {$type: 'string'},
        $required: true
    }

}).compile('CampaignType');
