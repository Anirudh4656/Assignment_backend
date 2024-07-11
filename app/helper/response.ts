interface IResponse {
    success: boolean;
    message?: string;
    data: object | null | any;
    statusCode?: number
  }
  
  export type ErrorResponse = IResponse & {
    error_code: number;
  };
  
  //genrics
  //revise
  export const createResponse = (
    data: IResponse["data"],
    message?: string,
    statusCode: number = 200
  ): IResponse => {
    return { data, message, success: true,statusCode };
  };
  