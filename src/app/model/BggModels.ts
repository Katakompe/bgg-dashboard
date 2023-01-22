import { isFormArray } from "@angular/forms";

export interface Collection {
  items: Item[];
}

export interface Item {
  objectId: string;
  name: string;
  image: string;
  thumbnail_image: string;
  publicationYear: string;
}

export interface BoardGame {
  id: string;
  name: string;
  minplayers: number;
  maxplayers: number;
  minplaytime: number;
  maxplaytime: number;
  thumbnailImage: string;
  publicationYear: string;
  recommendedPlayers: PlayerPoll;
  recommendedAge: AgePoll;
  languageDependence: LanguagePoll;
  rating: number,
  complexity: number
}

export interface PlayerPoll {
  title: string;
  totalVotes: number;
  option: PlayerPollOption[]
}

export interface AgePoll {
  title: string;
  totalVotes: number;
  option: AgePollOption[]
}

export interface LanguagePoll {
  title: string;
  totalVotes: number;
  option: LanguagePollOption[]
}

export interface LanguagePollOption {
  level: string;
  description: string;
  votes: number;
}

export interface PlayerPollOption {
  playerCount: string;
  votes: PlayerCountOptionResult[];
}

export interface AgePollOption {
  age: string;
  votes: number;
}


export enum PlayerCountOptionResultType {
  BEST = "Best",
  RECOMMENDED = "Recommended",
  NOT_RECOMMENDED = "Not Recommended"
}

export interface PlayerCountOptionResult {
  type: PlayerCountOptionResultType;
  votes: number
}

export function toBoardGames(value: any): BoardGame[] {

  let items = value?.items;
  if (!items) {
    console.warn("No boardgames here!");
    throw "error";
  }
  if (!Array.isArray(items.item)) {
    return [toBoardGame(items.item)]
  }
  return items.item.map((item: any) => toBoardGame(item))

}

function toBoardGame(item: any): BoardGame {
  let itemname = Array.isArray(item.name) ? item.name[0]["@value"] : item.name["@value"];
  return {
    id: item["@id"],
    minplayers: parseInt(item.minplayers["@value"]),
    maxplayers: parseInt(item.maxplayers["@value"]),
    minplaytime: parseInt(item.minplaytime["@value"]),
    maxplaytime: parseInt(item.maxplaytime["@value"]),
    name: itemname,
    thumbnailImage: item.thumbnail,
    publicationYear: item.yearpublished["@value"],
    recommendedPlayers: toPlayerPoll(item.poll.find((v: any) => v["@name"] === PollType.PLAYERCOUNT)),
    recommendedAge: toAgePoll(item.poll.find((v: any) => v["@name"] === PollType.PLAYERAGE)),
    languageDependence: toLanguagePoll(item.poll.find((v: any) => v["@name"] === PollType.LANGUAGEDEPENDENCE)),
    rating: item.statistics.ratings.average["@value"],
    complexity: item.statistics.ratings.averageweight["@value"]
  }
}

export enum PollType {
  PLAYERCOUNT = "suggested_numplayers",
  PLAYERAGE = "suggested_playerage",
  LANGUAGEDEPENDENCE = "language_dependence",
}

function toPlayerPoll(value: any): PlayerPoll {
  if(!Array.isArray(value.results)) {
    return {
      title: value["@title"],
      totalVotes: value["@totalvotes"],
      option: [{
        playerCount: value.results["@numplayers"],
        votes: [
          {
          type: PlayerCountOptionResultType.BEST,
          votes: 0
        }
      ]
    }]
    }
  }
  return {
    title: value["@title"],
    totalVotes: value["@totalvotes"],
    option: value.results.map((opt: any) => {
      return {
        playerCount: opt["@numplayers"],
        votes: opt.result.map((selection: any) => {
          return {
            type: selection["@value"],
            votes: parseInt(selection["@numvotes"])
          };
        })
      };
    })
  };

}

function toAgePoll(value: any): AgePoll {
  return {
    title: value["@title"],
    totalVotes: value["@totalvotes"],
    option: value.results?.result?.map((opt: any) => {
      return {
        age: opt["@value"],
        votes: parseInt(opt["@numvotes"])
      };
    })
  };
}

function toLanguagePoll(value: any): LanguagePoll {
  return {
    title: value["@title"],
    totalVotes: value["@totalvotes"],
    option: value.results?.result?.map((opt: any) => {
      return {
        level: opt["@level"],
        description: opt["@value"],
        votes: parseInt(opt["@numvotes"])
      }
    })
  }
}
