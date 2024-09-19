const AWS = require("aws-sdk");
const { v4: uuidv4 } = require('uuid'); // Import uuid library
require("dotenv").config();

const dynamoDb = new AWS.DynamoDB.DocumentClient();

AWS.config.update({
	region: process.env.AWS_REGION
})

const saveHistory = async (fileDetails) => {
  const params = {
    TableName: process.env.AWS_DYNAMO_DB_TABLE_NAME,
    Item: {
      gdm_file_upload_id: uuidv4(),
			...fileDetails
		}
  };

  try {
    await dynamoDb.put(params).promise();
    console.log("File upload history saved successfully!");
  } catch (error) {
    console.error("Error saving file upload history", error);
  }
};

module.exports = { saveHistory }