/**
 * 墨墨API错误基类
 */
export class MaimemoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MaimemoError';
    Object.setPrototypeOf(this, MaimemoError.prototype);
  }
}

/**
 * 网络请求错误
 */
export class NetworkError extends MaimemoError {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
    Object.setPrototypeOf(this, NetworkError.prototype);
  }
}

/**
 * API响应错误
 */
export class APIError extends MaimemoError {
  public status: number;
  public data?: any;

  constructor(status: number, message: string, data?: any) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.data = data;
    Object.setPrototypeOf(this, APIError.prototype);
  }
}

/**
 * 认证错误
 */
export class AuthenticationError extends APIError {
  constructor(status: number, message: string, data?: any) {
    super(status, message, data);
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * 参数错误
 */
export class ValidationError extends MaimemoError {
  public field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * 请求超时错误
 */
export class TimeoutError extends NetworkError {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

/**
 * 资源未找到错误
 */
export class NotFoundError extends APIError {
  constructor(resource: string, id?: string) {
    const message = id
      ? `Resource ${resource} with ID ${id} not found`
      : `Resource ${resource} not found`;
    super(404, message, 'resource_not_found');
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}
