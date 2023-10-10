export interface HttpRequest<T> {
  body: T;
}

export interface HttpResponse<T> {
  statusCode: number;
  body?: T;
}

export interface UseCase {
  execute(request: any): Promise<any>;
}

export class FetchPointsController {
  private readonly usecase: UseCase;

  constructor(usecase: UseCase) {
    this.usecase = usecase;
  }

  async handle(
    request: any
  ): Promise<HttpResponse<any>> {
    try {
      if (!request.params.lat || !request.params.lng) {
        const missing = !request.params.lat ? 'lat' : 'lng';

        return {
          statusCode: 201,
          body: `${missing} is missing`,
        }
      }

      const response = await this.usecase.execute({ lat: request.params.lat, lng: request.params.lng });

      return {
        statusCode: 201,
        body: response,
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: error,
      };
    }
  }
}
