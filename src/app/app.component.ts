import { compileDeclareClassMetadata } from '@angular/compiler';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormControlName, FormGroup, FormsModule } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { map, mergeMap } from 'rxjs';
import { BggService } from './bgg.service';
import { BoardGame } from './model/BggModels';
import { Votings } from './model/Votings';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'bgg-dashboard';
  private col: any;


  username = "Katakompe";
  usernameFormControlGroup = new FormGroup({
    usernameFormControl: new FormControl('Katakompe')
  });

  filterFn: (b: BoardGame[]) => BoardGame[] = (b: BoardGame[]) => b;
  sortingFn: (a: BoardGame,b: BoardGame) => number = (a,b) => 0;

  boardgames: BoardGame[] = [];
  displayedColumns: string[] = ['thumbnailImage', 'id', 'name', 'players', 'playtime', 'publicationYear', "rating", "complexity"];
  dataSource: MatTableDataSource<BoardGame> = new MatTableDataSource<BoardGame>([])
  isLoading = true
  @ViewChild(MatPaginator) paginator: any;


  constructor(private bggService: BggService) { };

  ngOnInit() {
    this.updateCollection()
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  updateBoardGameView($event: (b: BoardGame[]) => BoardGame[]) {
    this.filterFn = $event
    this.applyFilterSortPipeline();
  }

  //TODO Make sure sorting and filtering works together and does not reset each other, also make sure that sorting is resettable
  updateCollection() {
    this.username = this.usernameFormControlGroup.value!.usernameFormControl!;
    this.dataSource.data = [];
    this.isLoading = true;
    this.bggService.getCollection(this.username)
      .pipe(
        map((collection: any) => {
          this.col = collection
          let gameIds = collection.items.item.map((item: any) => {
            return item["@objectid"];
          }) as string[];

          const gamesset = new Set(gameIds);
          return Array.from(gamesset).join(",")
        }),
        mergeMap((id: string) => this.bggService.getBoardgame(id))
      )
      .subscribe(v => {
        this.boardgames = v;
        this.applyFilterSortPipeline()
        this.isLoading = false
      });
  }

  sortGames(sortState: Sort) {
    if (!sortState.active || sortState.direction === '') {
      this.sortingFn = (a,b) => 0;
      return;
    }
    this.sortingFn = (a: BoardGame, b: BoardGame) => {
      const asc = sortState.direction === "asc";
      switch (sortState.active) {
        case "name":
          return this.compare(a.name, b.name, asc);
        case "players":
          return asc ? this.compare(a.minplayers, b.minplayers, asc) : this.compare(a.maxplayers, b.maxplayers, asc);
        case "playtime":
          return this.compare(a.maxplaytime, b.maxplaytime, asc);
        case "publicationYear":
          return this.compare(a.publicationYear, b.publicationYear, asc);
        case "rating":
          return this.compare(a.rating, b.rating, asc);
        case "name":
          return this.compare(a.complexity, b.complexity, asc);
        default: return 0;
      }
    };
    this.applyFilterSortPipeline()
  }

  private compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  private applyFilterSortPipeline() {
    const filtered = this.filterFn(this.boardgames)
    this.dataSource.data = filtered;
    this.dataSource.data = this.dataSource.data.sort(this.sortingFn);
  }

  log(element: any) {
    const counts = Votings.getOverallPlayerCounts(element);
    console.log(counts)
  }
}
