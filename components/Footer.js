import React from 'react';
import { Segment, Container, Grid, List, Header, Icon } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
    return (
        <div>
            <Segment className="footer" inverted vertical style={{ padding: '5em 0em' }}>
                <Container>
                    <Grid divided inverted stackable>
                        <Grid.Row>
                            <Grid.Column width={3}>
                                <Header inverted as='h4' content='About' />
                                <List link inverted>
                                    <List.Item as='a'>What Is Furiosa</List.Item>
                                    <List.Item as='a'>FAQ</List.Item>
                                    <List.Item as='a'>Contact Us</List.Item>
                                    <List.Item as='a'>Sitemap</List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Header inverted as='h4' content='Contribute' />
                                <List link inverted>
                                    <List.Item as='a'>Campaign</List.Item>
                                    <List.Item as='a'>Donate</List.Item>
                                    <List.Item as='a'>Freelance</List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={7}>
                                <Header as='h4' inverted>
                                    Furiosa
                                </Header>
                                <p id="message-from-us">
                                    We would like to shout out a massive thanks to everyone for the amazing support we've received. Absolutely none of this would have been possible without you <Icon name='heart' />
                                </p>
                                <p>© 2019 FURIOSA</p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container>
            </Segment>
        </div>
    );
};
