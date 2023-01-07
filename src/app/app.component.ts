import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import { BggService } from './bgg.service';
import { concatMap, from, interval, map, mergeMap, zip } from 'rxjs'
import { BoardGame, toBoardGames } from './bgg/Collection';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  title = 'bgg-dashboard';

  private col: any;
  private boardgames: BoardGame[] = [];

  constructor(private bggService: BggService) { };

  ngOnInit() {
    this.bggService.getCollection("Katakompe")
      .pipe(
        map((collection: any) => {
          this.col = collection
          let gameIds = collection.items.item.map((item: any) => {
          return item["@objectid"];
        }) as string[];
        return gameIds.join(",")
      }),
        mergeMap((id: string) => this.bggService.getBoardgame(id))
      )
      .subscribe(v => this.boardgames = toBoardGames(v));
  }


  logBoardgames() {
    console.log(this.boardgames);
  }

}
