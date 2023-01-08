import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { fromXML } from 'from-xml';
import { BoardGame, toBoardGames } from './model/BggModels';

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

  public getBoardgame(objectId: string): Observable<BoardGame[]> {
    return this.httpClient.get(
      this.baseUrl + "/thing" + `?id=${objectId}&stats=1`,
      {
        observe: 'response',
        responseType: 'text'
      }
    )
      .pipe(
        map(xmlResponse => fromXML(xmlResponse.body || "")),
        map(response => toBoardGames(response)),
        tap(response => console.log("Got response: ", response))
      );
  }



}
