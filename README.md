# fabvote
A Hyperledger-Fabric backed Voting System

* Set up machine and download samples


## Prerequisites

Before you start, you must install some prerequisite technology required by the
tutorial. We’ve kept these to a minimum so that you can get going quickly.

You must have the following technologies installed:

[Node](https://nodejs.org/en/about/) version 8.9.0, or higher. Node is a
JavaScript runtime that you can use to run applications and smart contracts.
You are recommended to use the LTS (Long Term Support) version of node. Install
node [here](https://nodejs.org/en/).

[Docker](https://www.docker.com/get-started) version 18.06, or higher. Docker
help developers and administrators create standard environments for building
and running applications and smart contracts. Hyperledger Fabric is provided
as a set of Docker images, and the PaperNet smart contract will run in a Docker
container. Install Docker [here](here).

## Set Up
Clone the repository and in the main directory run 
```
./startFabric.sh
```
This will set up the blockchain network and install the smart contract for voting.

## Running the Application
Next, use the FabVote applications to interact with the deployed FabVote contract.
The FabVote application is available in JavaScript.
Follow the instructions for the programming language of your choice:

### JavaScript:

  Start by changing into the "application/javascript" directory:
```
cd application/javascript
```
  Next, install all required packages:
```
npm install
```
  Then run the following applications to enroll the admin user, and register a new user
  called user1 which will be used by the other applications to interact with the deployed
  FabCar contract:
```
node enrollAdmin
node registerUser
```
  You can run the invoke application as follows. By default, the invoke
  application will cast a vote for Woodrow Wilson, but you can update the
  application to submit other transactions:
```
node invoke
```
  You can run the query application as follows. By default, the query application will
  return all elections, but you can update the application to evaluate other transactions:
```
node query
```

## See Also
Checkout the [Hyperledger-Fabric](https://hyperledger-fabric.readthedocs.io/en/latest/developapps/developing_applications.html)
docs for more ideas on extending fabvote and adding new functionality.