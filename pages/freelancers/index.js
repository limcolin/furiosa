import React, { Component } from 'react';
import factory from '../../ethereum/factory';
import { Card, Button, Image, Icon, Container } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import { Link } from '../../routes';
import "../../style.css";
import * as superagent from 'superagent';
import moment from 'moment';

class FreelancerIndex extends Component {
    static async getInitialProps({req}) {
        const freelancers = await factory.methods.getFreelancers().call();

        if (req) {
            const { db } = req;

            const freelancerDetails = await db.collection('Freelancers').find().sort({ _id: 1 }).toArray();

            return { freelancers, freelancerDetails };
        } else {
            // Otherwise, we're rendering on the client and need to use the API
            const freelancerDetails = await superagent.get('/api/freelancers').then(res => res.body);

            return { freelancers, freelancerDetails };
        }
    }

    renderFreelancers() {
        const cards = this.props.freelancers.map((address, freelancerIndex) => {
            let desc = this.props.freelancerDetails[freelancerIndex]['summary'];
            let limit = 120;
            if(desc.length > limit) {
                desc = desc.substring(0,limit)+"..";
            }

            return (
                <Link prefetch key={freelancerIndex} href={`/freelancers/${address}`} route={`/freelancers/${address}`} >
                    <Card link fluid={true} raised={true}>
                        <div className="card-image-div"><Image circular={true} src={'https://gateway.ipfs.io/ipfs/' + this.props.freelancerDetails[freelancerIndex]['image_hash']} /></div>
                        <Card.Content>
                            <Card.Header>{this.props.freelancerDetails[freelancerIndex]['name']} <span className='date'>{this.props.freelancerDetails[freelancerIndex]['title']}</span></Card.Header>
                            <Card.Meta>
                                <span className='date'>{this.props.freelancerDetails[freelancerIndex]['location']}</span>
                            </Card.Meta>
                            <Card.Description>{desc}</Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                            {/*<Progress size='small' indicating percent={(balance/(this.props.campaignDetails[campaignIndex]['target']))*100} progress autoSuccess precision={1} />*/}
                            <span className='rate'>${this.props.freelancerDetails[freelancerIndex]['rate']}/hr</span>
                        </Card.Content>
                    </Card>
                </Link>
            );
        });

        return (
            <>
                {cards}
            </>
        );
    }

    render() {
        return (
            <Layout>
                <div>
                    <div className='intro-section full-width'>
                        <Container>
                            <div className='cards-div'>
                                <h3>Prioritizing People</h3>
                                <p>Our employees are our most important customers, and in order to build comapnies with SOUL, we need to put our people first.</p>
                                <p>All freelancer profiles are vetted for authenticity to ensure that you get exactly what you paid for.</p>
                                <p>Real people with real profiles and work history.</p>
                                <p>They say ideas are cheap and that execution is key - rest assured that your contributions are well spent and only go towards the best people working to execute the idea.</p>
                            </div>
                        </Container>
                    </div>

                    <div className='intro-section divider-section'>
                        <h3>Freelancers</h3>
                    </div>

                    <div className='cards-div freelancers'>
                        <Card.Group stackable itemsPerRow='4'>
                            {this.renderFreelancers()}
                            {this.renderFreelancers()}
                            {this.renderFreelancers()}
                            {this.renderFreelancers()}
                        </Card.Group>
                    </div>
                </div>
            </Layout>
        );
    }
}

export default FreelancerIndex;
