import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";

import { document } from "../utils/dynamodbClient";

export const handle: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
    const { userid } = event.pathParameters;

    const response = await document.scan({
        TableName: "users_todos",
        FilterExpression: "user_id = :userid",
        ExpressionAttributeValues: {
            ":userid": userid
        }
    }).promise();

    const todos = response.Items;

    console.log(todos[0].deadline);

    return {
        statusCode: 200,
        body: JSON.stringify({
            data: todos
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }
}