testing pull request10
# furiosa
Codename: Furiosa

## Update New repos are up at https://github.com/codename-furiosa

## Update 02/19 Alot was learnt from this rapid prototype that took 1 month.

## Furiosa has moved onward to the next phase - a not-so-rapid prototype - where the components will be separated into individual modules for better separation of concerns which will allow for better quality of code and development process. Sit tight for updates!!

### Furiosa App
Front-end client that acts as central interface to access the Blockchain, IPFS, FuriosaAPI and Furiosa Bot services.

- React
- NextJS
- Solidity
- Metamask
- IPFS

### FuriosaAPI
Caching server that maintains an up-to-date copy of all contract and IPFS data on the blockchain, plus storage of trivial (non-payments related) data for easy access.

- Node
- ExpressJS
- MongoDB

### Furiosa Bot
Github app bot that integrates Furiosa campaigns/freelancers with Github accounts/organizations allowing for direct creation/tracking/approval of contracts through Github milestones/issues.

- GitHub API
- Probot
- ExpressJS

1) git clone
2) npm install
3) cd ethereum
4) node compile.js
5) npm run dev
