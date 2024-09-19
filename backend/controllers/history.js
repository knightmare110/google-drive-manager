const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Get paginated history
const listHistory = async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Get page and limit from query params

  const params = {
    TableName: process.env.AWS_DYNAMO_DB_TABLE_NAME,
    Limit: limit,
    ExclusiveStartKey: req.query.LastEvaluatedKey || null, // For pagination
  };

  try {
    const data = await dynamoDb.scan(params).promise();
    
    res.json({
      history: data.Items,
      lastEvaluatedKey: data.LastEvaluatedKey, // For pagination
    });
  } catch (error) {
    res.status(500).send('Error fetching history logs: ' + error.message);
  }
};

module.exports = { listHistory };
