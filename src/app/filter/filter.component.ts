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
  public boardgameChange: EventEmitter<BoardGame[]> = new EventEmitter<BoardGame[]>();

  public searchWord: string = ""
  public bestPlayerCount: number | undefined;

  constructor(){}

  updateSearchWord($event: string) {
    const filtered = this.boardgames.filter(b => b.name.toLowerCase().includes($event.toLowerCase()));
    this.boardgameChange.emit(filtered)
  }

  updateBestPlayerCount($event: number) {
    if(!$event) {
      this.boardgameChange.emit([...this.boardgames])
    }
    else {
      const filtered = this.boardgames.filter(b => {
        const best = Votings.getBestPlayerCounts(b.recommendedPlayers);
        if(best.endsWith("+")){
          return parseInt(best) <= $event;
        } else {
          return parseInt(best) === $event;
        }
      });
      this.boardgameChange.emit(filtered)
    }

  }



}
