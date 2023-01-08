
import { Pipe, PipeTransform } from '@angular/core';
import { PlayerCountOptionResultType, PlayerPoll, PlayerPollOption } from '../model/BggModels';
import { Votings } from '../model/Votings';

@Pipe({ name: 'recommendedPlayer' })
export class RecommendedPlayerPipe implements PipeTransform {
  transform(value: PlayerPoll): string {

    const best: string = Votings.getBestPlayerCounts(value);
    const recommended: string[] = Votings.getRecommendedPlayerCounts(value);

    if (!recommended.includes(best)) {
      recommended.push(best);
    }
    recommended.sort()

    let recommendedWithBest = recommended.join(",")

    const playerspan = this.toNumber(recommended[recommended.length - 1] as string) - this.toNumber(recommended[0] as string);


    if (playerspan > 0 && recommended.length - 1 === playerspan) {
      recommendedWithBest = `${recommended[0]}-${recommended[recommended.length - 1]}`
    }


    const recommendedStr = recommendedWithBest.length > 0 ? `Recommended: ${recommendedWithBest}` : "";
    const bestStr = best !== "" ? `Best: ${best} ` : ""
    return `${recommendedStr} ${bestStr}`
  }

  private toNumber(num: string): number {
    if (num.endsWith("+")) {
      return parseInt(num) + 1
    }
    return parseInt(num);
  }
}

