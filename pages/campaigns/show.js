import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import { Card, Grid, Button, Form, Table, Tab, Image, Progress, Container, Segment } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';
import factory from '../../ethereum/factory';
import * as superagent from 'superagent';
import "../../style.css";
import RequestRow from '../../components/RequestRow';
import ContributionRow from '../../components/ContributionRow';
import moment from 'moment';

class CampaignShow extends Component {
    state = {
      buffer:'',
      ethAddress:'',
      blockNumber:'',
      transactionHash:'',
      gasUsed:'',
      txReceipt: ''
    };

    static async getInitialProps(props) {
        const campaign = Campaign(props.query.address);

        const summary = await campaign.methods.getSummary().call();

        const requests = await Promise.all(
            Array(parseInt(summary[2])).fill().map((element, index) => {
                return campaign.methods.requests(index).call();
            })
        );

        if (props.req) {
            const { db } = props.req;

            const campaign_details = await db.collection('Campaigns').findOne({ address: props.query.address });
            const contributions = await db.collection('Contributions').find({ campaign: props.query.address }).sort({ _id: 1 }).toArray();
            const requests_details = await db.collection('Requests').find({ campaign: props.query.address }).sort({ _id: 1 }).toArray();

            return {
                contributions: contributions,
                requests: requests,
                requests_details: requests_details,
                campaign_details: campaign_details,
                address: props.query.address,
                campaignName: campaign_details.name,
                minimumContribution: summary[0],
                balance: summary[1],
                requestsCount: summary[2],
                approversCount: summary[3],
                manager: summary[4]
            };

        } else {
            // Otherwise, we're rendering on the client and need to use the API
            const campaign_details = await superagent.get('/api/campaigns/' + props.query.address).then(res => res.body);
            const contributions = await superagent.get('/api/contributions/' + props.query.address).then(res => res.body);
            const requests_details = await superagent.get('/api/requests/' + props.query.address).then(res => res.body);

            return {
                contributions: contributions,
                requests: requests,
                requests_details: requests_details,
                campaign_details: campaign_details,
                address: props.query.address,
                campaignName: campaign_details.name,
                minimumContribution: summary[0],
                balance: summary[1],
                requestsCount: summary[2],
                approversCount: summary[3],
                manager: summary[4]
            };
        }
    }

    renderTabs() {
        const panes = [
            { menuItem: 'Info', render: () => <Tab.Pane className='pane' attached={false}>{this.renderInfo()}</Tab.Pane> },
            { menuItem: 'Requests', render: () => <Tab.Pane className='pane' attached={false}>{this.renderRequests()}</Tab.Pane> },
            { menuItem: 'Contributions', render: () => <Tab.Pane className='pane' attached={false}>{this.renderContributions()}</Tab.Pane> },
        ]

        return (
            <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
        );
    }

    renderRequests() {
        const { Header, Row, HeaderCell, Body } = Table;
        return (
            <>
                <Link route={`/campaigns/${this.props.address}/requests/new`}>
                    <a>
                        <Button primary floated="left" style={{ marginBottom: 10 }}>Add Request</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>{this.renderRows()}</Body>
                </Table>
                <div>Found {this.props.requestsCount} requests.</div>
            </>
        );
    }

    renderContributions() {
        const { Header, Row, HeaderCell, Body } = Table;
        return (
            <>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>Transaction ID</HeaderCell>
                            <HeaderCell>Contributor</HeaderCell>
                            <HeaderCell>Date</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                        </Row>
                    </Header>
                    <Body>{this.renderContributionsRows()}</Body>
                </Table>
            </>
        );
    }

    renderContributionsRows() {
        return this.props.contributions.map((contribution, index) => {
            return <ContributionRow
                key={index}
                id={index}
                contribution={contribution}
            />;
        });
    }

    renderRows() {
        return this.props.requests.map((request, index) => {
            return <RequestRow
                key={index}
                id={index}
                request={request}
                request_details={this.props.requests_details[index]}
                address={this.props.address}
                approversCount={this.props.approversCount}
            />;
        });
    }

    renderInfo() {

        const {
            campaign_details,
            balance,
            manager,
            minimumContribution,
            requestsCount,
            approversCount
        } = this.props;

        const items = [
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager created this campaign and can create requests to withdraw money',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: minimumContribution,
                meta: 'Minimum Contribution (wei)',
                description: 'You must contribute at least this much wei to become an approver',
                fluid: true,
                raised: true
            },
            {
                header: requestsCount,
                meta: 'Number of Requests',
                description: 'A request tries to withdraw money from the contract. Requests must be approved by approvers.'
            },
            {
                header: approversCount,
                meta: 'Number of Approvers',
                description: 'Number of people who have already donated to this campaign.'
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Campaign Balance (ether)',
                description: 'The balance is how much money this campaign has left to spend.'
            }
        ];

        return (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={12}>
                        <Segment className='borderless'>
                            <Image src={'https://gateway.ipfs.io/ipfs/' + campaign_details.image_hash} />
                        </Segment>
                        <Segment>
                            {campaign_details.description}
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Card.Group itemsPerRow={1} items={items} />
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }

    logContribution(contribution) {
        fetch('/api/contributions', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "campaign": this.props.address,
                "contributor": contribution.contributor,
                "transaction": contribution.transaction_hash,
                "amount": contribution.amount
            })
        }).then(function(response) {
            console.log(response);
            //return response.json();
        });
    }

    render() {
        let date = new Date( parseInt( this.props.campaign_details['_id'].toString().substring(0,8), 16 ) * 1000 );
        return (
            <Layout>
                <Container className='campaign-show'>
                    <Segment className='borderless'>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={7}>
                                    <h3>{this.props.campaignName}</h3>
                                    <span className='date'>{moment(date).format('ll')}</span>
                                    {/*<Progress size='small' indicating percent={(web3.utils.fromWei(this.props.balance, 'ether')/(this.props.campaign_details['target']))*100} progress autoSuccess precision={1} />*/}
                                    <Progress label={'$'+Math.floor(Math.random() * 100) + 20} size='small' color="green" percent={Math.floor(Math.random() * 100) + 1} progress precision={1} />
                                </Grid.Column>
                                <Grid.Column width={3}>
                                </Grid.Column>
                                <Grid.Column width={6}>
                                    <ContributeForm logContribution={this.logContribution.bind(this)} address={this.props.address} />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Segment>
                    {this.renderTabs()}
                </Container>
            </Layout>
        );
    }
}

export default CampaignShow;
