import { ErrorCode, HttpException } from "./root";

export class NotFound extends HttpException {
    constructor(message: string, errorCode: ErrorCode, errors: any) {
        super(message, errorCode, 404, errors);
    }
}