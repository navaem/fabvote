/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabVote extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const elections = [
            {
                name: 'SGA Election 2020',
                type: 'majority',
                victor: '',
                count: 0,
                options: [
                    'Abraham Lincoln',
                    'James Garfield',
                    'Franklin Deleno Roosevelt',
                    'Woodrow Wilson',
                ],
            },
        ];

        const votes = [
            {
                election: 'EL0',
                choice: 'Abraham Lincoln',
                voter: 'id0',
            },
        ];
        
        let election = elections[0]
        election.docType = 'election'
        await ctx.stub.putState('EL0', Buffer.from(JSON.stringify(election)))

        for (let i = 0; i < votes.length; i++) {
            votes[i].docType = 'vote';
            await ctx.stub.putState('VOTE' + i, Buffer.from(JSON.stringify(votes[i])));
            console.info('Added <--> ', votes[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async queryAllElections(ctx) {
        const startKey = 'EL0';
        const endKey = 'EL999';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
                record = await this.tallyVotesForElection(ctx, key, record);
            } catch (err) {
                throw new Error(`from queryAllElections ${err}`)
                // console.log(err);
                // record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async tallyVotesForElection(ctx, elID, election) {
        const startKey = 'VOTE0';
        const endKey = 'VOTE999';
        var votes = []
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            console.info("using key: " + key)
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
                if (this.validateVoteRecord(record, elID, election.options)) {
                    votes.push(record);
                } 
            } catch (err) {
                throw new Error(`from tallyVotesForElection ${err}`)
                // console.log(err);
                // record = strValue;
            }
            
        }
        election.count = votes.length;
        election.victor = this.findMajority(votes);
        election.votes = votes;
        return election;
    }

    validateVoteRecord(record, elID, options) {
        const isChoice = (option) => option == record.choice;
        if (record.election != elID) return false;
        if (options.findIndex(isChoice) < 0) return false;
        return true;
    }

    findMajority(votes) {
        if (votes.length < 1) return "";

        var candidate = votes[0].choice;
        if (candidate === undefined) {
            return "";
        }
        var score = 0;

        for (var vote of votes) {

             if (vote.choice == candidate) {
                score += 1;
            } else if (score == 0) {
                candidate = vote.choice;
            } else {
                score -= 1;
            }
        }

        var count = 0;
        for (var v of votes) {
            if (v.choice == candidate) {
                count += 1;
            }
        }

        if (count > votes.length / 2) {
            return candidate;
        }

        return "";
    }

    async castVote(ctx, elID, choice) {
        let election = await this.findElection(ctx, elID);
        if (election === undefined) {
            throw new Error(`Election ${elID} does not exist`);
        }

        const voter = ctx.clientIdentity.getID()
        const vote = {
            election: `${elID}`,
            docType: 'vote',
            choice,
            voter,
        };

        if (this.isSecondVote(election, vote)) {
            throw new Error(`You have already voted in this election!`);
        }
        await ctx.stub.putState('VOTE' + election.count, Buffer.from(JSON.stringify(vote)));
    }

    async findElection(ctx, elID) {
        const electionAsBytes = await ctx.stub.getState(elID);
        const strValue = Buffer.from(electionAsBytes).toString('utf8');
        let record;
        try {
            record = JSON.parse(strValue);
            record = await this.tallyVotesForElection(ctx, elID, record);
        } catch (err) {
            console.log(err);
            record = undefined;
        }
        return record;
    }

    isSecondVote(election, vote) {
        const id = vote.voter;
        for (var v of election.votes) {
            if (v.voter == id) {
                return true;
            }
        }
        return false;
    }

}

module.exports = FabVote;
