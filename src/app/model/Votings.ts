import { PlayerPoll, PlayerPollOption, PlayerCountOptionResultType } from "./BggModels";

export class Votings{
  public static getBestPlayerCounts(poll: PlayerPoll): string {
    return poll.option.map((opt: PlayerPollOption) => {
      const players: string = opt.playerCount;
      const votes: number = opt.votes.find(vote => vote.type == PlayerCountOptionResultType.BEST)?.votes || 0;
      return [players, votes];
    }).reduce((a, b) => a[1] > b[1] ? a : b)[0] as string; //TODO: need multiple returns, if two bests are identical
  }

  public static getRecommendedPlayerCounts(poll: PlayerPoll): string[] {
    const total = poll.totalVotes;
    return poll.option.map((opt: PlayerPollOption) => {
      const players: string = opt.playerCount;
      const votes: number = opt.votes.find(vote => vote.type == PlayerCountOptionResultType.RECOMMENDED)?.votes || 0;
      return [players, votes];
    }).filter(v => (v[1] as number) / total > 0.5) //More than 50% of votes recommended this playercount
      .map(v => v[0] as string);
  }
}
