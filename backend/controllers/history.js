const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// List History from DynamoDB with Pagination
const listHistory = async (req, res) => {
  const { lastKey } = req.query; // Get lastKey (pagination token) from query params

  const params = {
    TableName: process.env.AWS_DYNAMO_DB_TABLE_NAME,
    Limit: 10, // Number of items per page
    ExclusiveStartKey: lastKey ? JSON.parse(lastKey) : undefined, // Use lastKey for pagination if present
  };

  try {
    const data = await dynamoDb.scan(params).promise();

    // Respond with items and the next pagination key (if available)
    res.json({
      items: data.Items,
      lastKey: data.LastEvaluatedKey
        ? JSON.stringify(data.LastEvaluatedKey)
        : null, // Send next key for pagination
    });
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).send("Error fetching history: " + error.message);
  }
};

module.exports = {
  listHistory,
};
