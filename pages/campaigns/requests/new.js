import React, { Component } from 'react';
import { Form, Button, Message, Input, Dropdown } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link, Router } from '../../../routes';
import Layout from '../../../components/Layout';
import factory from "../../../ethereum/factory";
import * as superagent from 'superagent';
import "../../../style.css";

class RequestNew extends Component {
    state = {
        amount: '',
        description: '',
        loading: false,
        errorMessage: '',
        freelancer: '',
    };

    static async getInitialProps(props) {
        const { address } = props.query;
        const freelancers = await factory.methods.getFreelancers().call();

        if (props.req) {
            const { db } = props.req;

            const freelancerDetails = await db.collection('Freelancers').find().sort({ _id: 1 }).toArray();

            return { address, freelancers, freelancerDetails };
        } else {
            // Otherwise, we're rendering on the client and need to use the API
            const freelancerDetails = await superagent.get('/api/freelancers').then(res => res.body);

            return { address, freelancers, freelancerDetails };
        }
    }

    renderFreelancers() {
        const items = this.props.freelancers.map((address, index) => {
                return <Dropdown.Item
                  key={index}
                  text={this.props.freelancerDetails[index]['name']}
                  value={address}
                  onClick={(event, data) => this.setState({freelancer: data.value})}
                />
        });

        return <Dropdown
            placeholder='Select Service Freelancer'
            fluid
            selection
            options={items}
        />
    }

    logRequest(request) {
        fetch('/api/requests', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "campaign": request.campaign,
                "description": request.description,
                "freelancer": request.freelancer,
                "amount": request.amount
            })
        }).then(function(response) {
            console.log(response);
            //return response.json();
        });
    }

    onSubmit = async (e) => {
        e.preventDefault();

        const campaign = Campaign(this.props.address);

        const { description, amount, freelancer } = this.state;
        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(
                web3.utils.toWei(amount, 'ether'),
                freelancer
            ).send({ from: accounts[0]});

            this.logRequest({ campaign: this.props.address, description: this.state.description, amount: this.state.amount, freelancer: this.state.freelancer });

            Router.pushRoute(`/campaigns/${this.props.address}`);

        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    };

    render() {
        return (
            <Layout>
                <Link route={`/campaigns/${this.props.address}`}>
                    <a>Back</a>
                </Link>
                <h3>Create a Request</h3>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Description</label>
                        <Input
                            value={this.state.description}
                            onChange={event => this.setState({ description: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Value in Ether</label>
                        <Input
                            value={this.state.amount}
                            onChange={event => this.setState({ amount: event.target.value })}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Freelancer</label>
                        <Input
                            value={this.state.recipient}
                            onChange={event => this.setState({ freelancer: event.target.value })}
                        />
                        {this.renderFreelancers()}
                    </Form.Field>

                    <Message error header="Oops!" content={this.state.errorMessage} />
                    <Button primary loading={this.state.loading}>Create</Button>
                </Form>
            </Layout>
        );
    }
}

export default RequestNew;
