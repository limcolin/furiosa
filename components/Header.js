import React from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {
    return (
        <Menu className='main-menu' pointing secondary>
            <Menu.Menu>
                <Menu.Item>
                    <Link route="/">
                        <a className="item">Campaigns</a>
                    </Link>
                </Menu.Item>
                <Menu.Item>
                    <Link route={`/freelancers`}>
                        <a className="item">Freelancers</a>
                    </Link>
                </Menu.Item>
            </Menu.Menu>
            <Menu.Header>
                <h3>CODENAME: FURIOSA</h3>
            </Menu.Header>
        </Menu>
    );
};
