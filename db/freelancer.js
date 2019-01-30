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
    location: {
        $type: 'string',
        $required: true
    },
    title: {
        $type: 'string',
        $required: true
    },
    summary: {
        $type: 'string',
        $required: true
    },
    rate: {
        $type: 'number',
        $required: true
    },
    image_hash: {
        $type: 'string',
        $required: true
    }

}).compile('FreelancerType');
