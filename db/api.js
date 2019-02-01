const Archetype = require('archetype-js');
const CampaignType = require('./campaign');
const ContributionType = require('./contribution');
const FreelancerType = require('./freelancer');
const RequestType = require('./request');
const { ObjectId } = require('mongodb');
const express = require('express');

module.exports = db => {
    const router = express.Router()

    // Wrap an async function so we catch any errors that might occur
    const wrapAsync = handler => (req, res) => handler(req)
    .then(result => res.json(result))
    .catch(error => res.status(500).json({ error: error.message }))

    // Get all $$$$$$$$$$$$$$$$$WIP
    router.get('/', wrapAsync(async function(req) {
        return db.collection('Campaigns').find().sort({ _id: 1 }).toArray()
    }));

    // Get all campaigns
    router.get('/campaigns', wrapAsync(async function(req) {
        return db.collection('Campaigns').find().sort({ _id: 1 }).toArray()
    }));

    // Get single campaign
    router.get('/campaigns/:address', wrapAsync(async function(req) {
        return db.collection('Campaigns').findOne({ address: req.params.address })
    }));

    // Add a new Campaign
    router.post('/', wrapAsync(async function(req) {
        try {
            const campaign = new CampaignType(req.body);
            await db.collection('Campaigns').insertOne(campaign);
            return { campaign };
        } catch(error) {
            console.log(error);
        }
    }));

    // Get campaign Contributions
    router.get('/contributions/:campaign', wrapAsync(async function(req) {
        return db.collection('Contributions').find({ campaign: req.params.campaign }).sort({ _id: 1 }).toArray()
    }));

    // Add new Contribution
    router.post('/contributions', wrapAsync(async function(req) {
        try {
            const contribution = new ContributionType(req.body);
            await db.collection('Contributions').insertOne(contribution);
            return { contribution };
        } catch(error) {
            console.log(error);
        }
    }));

    //======================================================//
    //                      Requests                        //
    //======================================================//
    // Get Freelancer Requests
    router.get('/requests', wrapAsync(async function(req, res) {
        return db.collection('Requests').find({ freelancer: req.query.freelancer }).sort({ _id: 1 }).toArray()
    }));

    // Get campaign Requests
    router.get('/requests/:campaign', wrapAsync(async function(req) {
        return db.collection('Requests').find({ campaign: req.params.campaign }).sort({ _id: 1 }).toArray()
    }));

    // Add new Request
    router.post('/requests', wrapAsync(async function(req) {
        try {
            const request = new RequestType(req.body);
            await db.collection('Requests').insertOne(request);
            return { request };
        } catch(error) {
            console.log(error);
        }
    }));

    // Update Request
    router.post('/requests/:id', wrapAsync(async function(req) {
        let query = { _id: Archetype.to(req.params.id, ObjectId) };
        try {
            const { result } = await db.collection('Requests').findOneAndUpdate(
                query,
                { $set: req.body }
            );
            return { result };
        } catch (err) {
            console.log(err);
        }
    }));

    // Get all Freelancers
    router.get('/freelancers', wrapAsync(async function(req) {
        return db.collection('Freelancers').find().sort({ _id: 1 }).toArray()
    }));

    router.get('/freelancers/:address', wrapAsync(async function(req) {
        return db.collection('Freelancers').findOne({ address: req.params.address })
    }));

    // Add a new Freelancer
    router.post('/freelancers', wrapAsync(async function(req) {
        try {
            const freelancer = new FreelancerType(req.body);
            await db.collection('Freelancers').insertOne(freelancer);
            return { freelancer };
        } catch(error) {
            console.log(error);
        }
    }));

    // Delete an existing Book
    router.delete('/:id', wrapAsync(async function(req) {
    const { result } = await db.collection('Book').deleteOne({
      _id: Archetype.to(req.params.id, ObjectId)
    })
    return { result }
    }))

    return router
}
