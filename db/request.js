const Archetype = require('archetype-js')

module.exports = new Archetype({
    campaign: {
        $type: 'string',
        $required: true
    },
    description: {
        $type: 'string',
        $required: true
    },
    amount: {
        $type: 'number',
        $required: true
    },
    freelancer: {
        $type: 'string',
        $required: true
    },
    approved: {
        $type: 'boolean',
        $required: true,
        $default: false
    }
}).compile('RequestType');
