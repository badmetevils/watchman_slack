interface IResponseSuccess {
  status: 'SUCCESS';
  data: any;
  error: false;
}
interface IResponseError {
  status: 'FAILURE';
  error: true;
  errorMessage: string;
}
type IResponse = IResponseSuccess | IResponseError;

interface IArgs {
  data?: any;
  errorMessage?: any;
}

const APIResponse = (args: IArgs): IResponse => {
  if (args.status == 'SUCCESS') {
    return {
      data,
      status,
      error: false
    };
  }
  return {
    error: true,
    status,
    errorMessage
  };
};
export default APIResponse;
