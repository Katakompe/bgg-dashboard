import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { map, Observable, retry, timer } from 'rxjs';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {

  constructor() {}

  shouldRetry(error: HttpErrorResponse) {
    console.warn("error: " + error.status)
    if (error.status >= 300) {
      throw error;
    }
    return timer(3000);
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((response: HttpEvent<unknown>) => {
        console.log("Status: " + (response as HttpResponse<unknown>).status)
        if ((response as HttpResponse<unknown>).status === 202) {
          throw 202;
        }
        return response;
      }),
      retry({ count: 3, delay: this.shouldRetry })
    );
  }
}
