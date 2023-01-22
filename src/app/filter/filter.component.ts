import { Component, EventEmitter, Input, Output } from '@angular/core';
import { filter } from 'rxjs';
import { BoardGame } from '../model/BggModels';
import { Votings } from '../model/Votings';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {

  @Input()
  public boardgames: BoardGame[] = [];

  @Output()
  public boardgameChange: EventEmitter<(b: BoardGame[]) => BoardGame[]> = new EventEmitter<(b: BoardGame[]) => BoardGame[]>();

  public searchWord: string | undefined
  public bestPlayerCount: number | undefined;
  public anyPlayerCount: number | undefined;
  public maxComplexity: number | undefined;
  public minRating: number | undefined;

  constructor() { }

  filterBoardgames(){
    let searchWord = this.searchWord;
    let bestPlayerCount = this.bestPlayerCount;
    let anyPlayerCount = this.anyPlayerCount;
    let maxComplexity = this.maxComplexity;
    let minRating = this.minRating;

    let searchwordPredicate = this.searchwordPredicate;
    let bestPlayerCountPredicate = this.bestPlayerCountPredicate;
    let anyPlayerCountPredicate = this.anyPlayerCountPredicate;
    let maxComplexityPredicate = this.maxComplexityPredicate;
    let minRatingPredicate = this.minRatingPredicate;



    let filterFn = function(boardGames: BoardGame[]): BoardGame[] {
    return boardGames
    .filter(b => !searchWord ||  searchwordPredicate(b, searchWord))
    .filter(b => !bestPlayerCount || bestPlayerCountPredicate(b, bestPlayerCount))
    .filter(b => !anyPlayerCount || anyPlayerCountPredicate(b, anyPlayerCount))
    .filter(b => !maxComplexity || maxComplexityPredicate(b,maxComplexity))
    .filter(b => !minRating || minRatingPredicate(b, minRating))

    }
    this.boardgameChange.emit(filterFn);
  }

  updateSearchWord($event: string) {
    this.searchWord = $event;
    this.filterBoardgames();
  }

  searchwordPredicate(boardGame: BoardGame, searchWord: string) {
    return boardGame.name.toLowerCase().includes(searchWord.toLowerCase())
  }

  updateBestPlayerCount($event: number) {
    this.bestPlayerCount = $event;
    this.filterBoardgames();
  }

  bestPlayerCountPredicate(boardGame: BoardGame, bestPlayerCount: number) {
    const best = Votings.getBestPlayerCounts(boardGame.recommendedPlayers);
    if (best.endsWith("+")) {
      return parseInt(best) <= bestPlayerCount;
    } else {
      return parseInt(best) === bestPlayerCount;
    }
  }

  updateAnyPlayerCount($event: number) {
    this.anyPlayerCount = $event;
    this.filterBoardgames();

  }

  anyPlayerCountPredicate(boardGame: BoardGame, anyPlayerCount: number) {
    const all: number[] = Votings.getOverallPlayerCounts(boardGame);
    return all.includes(anyPlayerCount);
  }

  updateMinRating($event: number) {
    this.minRating = $event;
    this.filterBoardgames();

  }

  minRatingPredicate(boardGame: BoardGame, rating: number) {

    return rating <= boardGame.rating
  }

  updateMaxComplexity($event: number) {
    this.maxComplexity = $event;
    this.filterBoardgames();

  }

  maxComplexityPredicate(boardGame: BoardGame, maxComplexity: number) {
    return maxComplexity >= boardGame.complexity;
  }


}
