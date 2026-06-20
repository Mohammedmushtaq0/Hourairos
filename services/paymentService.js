const dynamodb =
    require('../lib/dynamodb');

const {
    UpdateCommand
} = require('@aws-sdk/lib-dynamodb');


// =====================================
// UPGRADE PLAN
// =====================================

async function upgradePlan({

    userId,

    plan

}) {

    await dynamodb.send(

        new UpdateCommand({

            TableName: 'Users',

            Key: {

                userId
            },

            UpdateExpression:
                'SET #plan = :plan',

            ExpressionAttributeNames: {

                '#plan':
                    'plan'
            },

            ExpressionAttributeValues: {

                ':plan':
                    plan
            }
        })
    );
}

module.exports = {

    upgradePlan
};