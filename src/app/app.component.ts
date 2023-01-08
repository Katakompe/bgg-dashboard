import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map, mergeMap } from 'rxjs';
import { BggService } from './bgg.service';
import { BoardGame } from './model/BggModels';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'bgg-dashboard';
  private col: any;


  username = "Katakompe";
  boardgames: BoardGame[] = [];
  displayedColumns: string[] = ['thumbnailImage', 'id', 'name', 'players', 'playtime', 'publicationYear', "rating", "complexity"];
  dataSource = new MatTableDataSource<BoardGame>([])

  @ViewChild(MatPaginator) paginator: any;


  constructor(private bggService: BggService) { };

  ngOnInit() {
    this.bggService.getCollection(this.username)
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
      .subscribe(v => {
        this.boardgames = v;
        this.dataSource.data= [...this.boardgames]

      } );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  updateBoardGameView($event: BoardGame[]) {
    this.dataSource.data= [...$event]
  }

}
