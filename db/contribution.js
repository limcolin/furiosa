const Archetype = require('archetype-js')

module.exports = new Archetype({
    campaign: {
        $type: 'string',
        $required: true
    },
    contributor: {
        $type: 'string',
        $required: true
    },
    transaction: {
        $type: 'string',
        $required: true
    },
    amount: {
        $type: 'number',
        $required: true
    }

}).compile('ContributionType');
