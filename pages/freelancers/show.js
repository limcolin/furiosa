import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Freelancer from '../../ethereum/freelancer';
import { Card, Grid, Button, Container, Segment, Tab, Image, Icon, Label } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import { Link } from '../../routes';
import "../../style.css";

class FreelancerShow extends Component {
    static async getInitialProps(props) {
        const freelancer = Freelancer(props.query.address);

        const summary = await freelancer.methods.getSummary().call();

        if (props.req) {
            const { db } = props.req;

            const freelancer_details = await db.collection('Freelancers').findOne({ address: props.query.address });

            return {
                address: props.query.address,
                balance: summary[1],
                manager: summary[2],
                freelancer_details: freelancer_details,
                address: props.query.address
            };

        } else {
            // Otherwise, we're rendering on the client and need to use the API
            const freelancer_details = await superagent.get('/api/freelancers/' + props.query.address).then(res => res.body);

            return {
                address: props.query.address,
                balance: summary[1],
                manager: summary[2],
                freelancer_details: freelancer_details,
                address: props.query.address
            };
        }
    }

    renderTabs() {
        const panes = [
            { menuItem: 'Summary', render: () => <Tab.Pane className='pane' attached={false}>{this.renderSummary()}</Tab.Pane> },
            { menuItem: 'Work History & Feedback', render: () => <Tab.Pane className='pane' attached={false}>{this.renderHistory()}</Tab.Pane> },
            { menuItem: 'Portfolio', render: () => <Tab.Pane className='pane' attached={false}>{this.renderPortfolio()}</Tab.Pane> },
        ]

        return (
            <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
        );
    }

    renderCards() {
        const {
            freelancer_details,
            balance,
            manager,
        } = this.props;

        const items = [
            {
                header: freelancer_details.rate,
                meta: 'Hourly Rate (USD)'
            },
            {
                header: freelancer_details.rate,
                meta: 'Total Earned (USD)'
            },
            {
                header: freelancer_details.rate,
                meta: 'Jobs Completed'
            },
            {
                header: manager,
                meta: 'Address of Manager',
                description: 'The manager created this campaign and can create requests to withdraw money',
                style: { overflowWrap: 'break-word' }
            },
            {
                header: web3.utils.fromWei(balance, 'ether'),
                meta: 'Freelancer Balance (ether)',
                description: 'The balance is how much money this freelancer has left to spend.'
            }
        ];

        return <Card.Group items={items} />
    }

    renderSummary() {
        return (
            <Grid stackable={true}>
                <Grid.Row>
                    <Grid.Column width={10}>
                        <Segment className='borderless'>
                            {this.props.freelancer_details.summary}
                        </Segment>
                        <Segment className='borderless'>
                            <h4>Skills</h4>
                            <Label.Group>
                                <Label as='a'>Javascript</Label>
                                <Label as='a'>PHP</Label>
                                <Label as='a'>HTML</Label>
                                <Label as='a'>CSS</Label>
                                <Label as='a'>Responsive Web Design</Label>
                                <Label as='a'>Shopify</Label>
                                <Label as='a'>WooCommerce</Label>
                                <Label as='a'>E-commerce</Label>
                                <Label as='a'>React</Label>
                                <Label as='a'>Next.js</Label>
                                <Label as='a'>Express.js</Label>
                                <Label as='a'>Magento</Label>
                                <Label as='a'>Magento 2</Label>
                                <Label as='a'>BigCommerce</Label>
                            </Label.Group>
                        </Segment>
                        <Segment className='borderless'>
                            <h4>Certifications</h4>
                        </Segment>
                        <Segment className='borderless'>
                            <h4>Education</h4>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={2}>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        {this.renderCards()}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
    renderHistory() {}
    renderPortfolio() {}

    render() {
        return (
            <Layout>
                <Container className='freelancer-show'>
                    <Segment className='borderless'>
                        <Grid stackable={true}>
                            <Grid.Row>
                                <Grid.Column width={2}>
                                    <Image circular={true} src={'https://gateway.ipfs.io/ipfs/' + this.props.freelancer_details.image_hash} />
                                    {/*<Progress size='small' indicating percent={(web3.utils.fromWei(this.props.balance, 'ether')/(this.props.campaign_details['target']))*100} progress autoSuccess precision={1} />*/}
                                </Grid.Column>
                                <Grid.Column className='freelancer-quick-stats' width={6}>
                                    <h3>{this.props.freelancer_details.name}</h3>
                                    <Icon name='linkedin' />
                                    <Icon name='facebook' />
                                    <Icon name='google' />
                                    <span className='date'>{this.props.freelancer_details.title}</span>
                                    <p className='date'>{this.props.freelancer_details.location}</p>
                                    <p>4.86 <Icon name='star' /></p>
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

export default FreelancerShow;
