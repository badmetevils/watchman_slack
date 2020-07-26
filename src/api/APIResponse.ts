interface IResponseSuccess {
  status: 'SUCCESS';
  data: any;
  // error: false;
}
interface IResponseError {
  status: 'FAILURE';
  // error: true;
  message: string;
}
type IResponse = IResponseSuccess | IResponseError;

const APIResponse = (args: IResponse): IResponse => {
  if (args.status === 'SUCCESS') {
    return {
      data: args.data,
      status: 'SUCCESS'
    };
  }
  return {
    status: 'FAILURE',
    message: args.message
  };
};
export default APIResponse;
