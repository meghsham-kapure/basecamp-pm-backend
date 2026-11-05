export class ApiSuccessResponse {
  constructor({
    status = 200,
    message = "Request Successful",
    data,
    pagination,
  }) {
    this.isSuccess = status < 400;
    this.status = status;
    this.message = message;
    if (data) this.data = data;
    if (pagination) this.pagination = pagination;
  }
}
