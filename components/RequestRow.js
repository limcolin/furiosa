import React, { Component } from 'react';
import { Table, Button, Message } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import {Router} from "../routes";
import * as superagent from 'superagent';

class RequestRow extends Component {
    state = {
        loading: false,
        errorMessage: ''
    };

    onApprove = async () => {
        const campaign = Campaign(this.props.address);

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            campaign.once('SendRequest', async (error, event) => {
                await superagent.post('/api/requests/' + this.props.request_details._id)
                .send({ 'status': 'approved' })
                .then(res => {
                    console.log(res.body);
                });
            });
            await campaign.methods.approveRequest(this.props.id)
                .send({from: accounts[0]});
        } catch (err) {
            this.setState({ errorMessage: err.message });
            console.log(this.state.errorMessage);
        }

        this.setState({ loading: false });
        Router.replaceRoute(`/campaigns/${this.props.address}`);
    };

    onFinalize = async () => {
        const campaign = Campaign(this.props.address);

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.finalizeRequest(this.props.id)
                .send({from: accounts[0]});

            Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
        } catch (err) {
            this.setState({ errorMessage: err.message });
            console.log(this.state.errorMessage);
        }

        this.setState({ loading: false });
    };

    onCommence = async () => {
        const campaign = Campaign(this.props.address);

        this.setState({ loading: true, errorMessage: '' });

        try {
            const accounts = await web3.eth.getAccounts();

            await campaign.methods.commenceRequest(this.props.id)
                .send({from: accounts[0]});
        } catch (err) {
            this.setState({ errorMessage: err.message });
            console.log(this.state.errorMessage);
        }

        this.setState({ loading: false });
        Router.replaceRoute(`/campaigns/${this.props.address}`);
    }

    render () {
        const { id, request, request_details, approversCount } = this.props;
        const readyToFinalize = request.approvalCount > approversCount / 2;

        return (
            <Table.Row disabled={(request.status == 2)}>
                <Table.Cell>{id}</Table.Cell>
                <Table.Cell>{request_details.description}</Table.Cell>
                <Table.Cell>{web3.utils.fromWei(request.value)}</Table.Cell>
                <Table.Cell>{request.freelancer}</Table.Cell>
                <Table.Cell>{request.approvalCount}/{approversCount}</Table.Cell>
                <Table.Cell>
                    {(request.status != 0 || request_details.status != 'open') ? null : (
                        <Button loading={this.state.loading} color="green" basic onClick={this.onApprove}>
                            Approve
                        </Button>
                    )}
                </Table.Cell>
                <Table.Cell>
                    {(request.status != 0 || request_details.status != 'accepted') ? null : (
                        <Button loading={this.state.loading} color="green" basic onClick={this.onCommence}>
                            Commence
                        </Button>
                    )}
                </Table.Cell>
                <Table.Cell>
                    {(request.status != 1) ? null : (
                    <Button loading={this.state.loading} color="teal" basic onClick={this.onFinalize}>
                        Finalize
                    </Button>
                    )}
                </Table.Cell>
            </Table.Row>
        );
    }
}

export default RequestRow;
