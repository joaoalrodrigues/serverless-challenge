import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";

import { document } from "../utils/dynamodbClient";

interface IRequestBody {
    title: string;
    deadline: string;
}

export const handle: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
    const { userid: user_id } = event.pathParameters;
    const { title, deadline } = JSON.parse(event.body) as IRequestBody;

    console.log(deadline);
    console.log(new Date(deadline));

    await document.put({
        TableName: "users_todos",
        Item: {
            id: uuidv4(),
            user_id,
            title,
            done: false,
            deadline: new Date(deadline).getTime()
        },
        ReturnValues: "ALL_OLD"
    }).promise();

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "Todo created."
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }
}