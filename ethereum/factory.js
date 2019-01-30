import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0xe5273a799c24461383EC96454C27B32752Ed52fb'
);

export default instance;
