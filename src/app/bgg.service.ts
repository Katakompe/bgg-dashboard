import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { fromXML } from 'from-xml';

@Injectable({ providedIn: 'root' })
export class BggService {
  constructor(private httpClient: HttpClient) { }

  private baseUrl: string = "https://boardgamegeek.com/xmlapi2";

  public getCollection(username: string) {
    return this.httpClient.get(
      this.baseUrl + "/collection" + `?username=${username}`,
      {
        observe: 'response',
        responseType: 'text'
      }
    )
      .pipe(
        map(xmlResponse => fromXML(xmlResponse.body || ""))
      );
  }



  public getBoardgame(objectId: string) {
    return this.httpClient.get(
      this.baseUrl + "/thing" + `?id=${objectId}`,
      {
        observe: 'response',
        responseType: 'text'
      }
    )
      .pipe(
        map(xmlResponse => fromXML(xmlResponse.body || ""))
      );
  }



}
