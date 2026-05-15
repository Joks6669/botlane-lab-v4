import { combos, comboId, getComboScore, trackedComboIds } from "@/lib/combos";

type RiotAccount = {
  puuid: string;
  gameName: string;
  tagLine: string;
};

type Participant = {
  puuid: string;
  riotIdGameName?: string;
  riotIdTagline?: string;
  championName: string;
  teamId: number;
  teamPosition: string;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  totalDamageDealtToChampions: number;
  totalDamageTaken: number;
  goldEarned: number;
  visionScore: number;
  wardsPlaced: number;
  wardsKilled: number;
  neutralMinionsKilled?: number;
  totalMinionsKilled?: number;
  item0?: number;
  item1?: number;
  item2?: number;
  item3?: number;
  item4?: number;
  item5?: number;
  item6?: number;
};

type RiotMatch = {
  metadata: { matchId: string };
  info: {
    gameCreation: number;
    gameDuration: number;
    gameMode: string;
    queueId: number;
    gameVersion: string;
    participants: Participant[];
  };
};

const REGION = "europe";
const ACCOUNT_BASE = `https://${REGION}.api.riotgames.com`;
const MATCH_BASE = `https://${REGION}.api.riotgames.com`;

export type DuoAnalysisInput = {
  adcName: string;
  adcTag: string;
  suppName: string;
  suppTag: string;
  count?: number;
};

export type ComboStat = {
  id: string;
  carry: string;
  support: string;
  theoreticalScore: number;
  games: number;
  wins: number;
  winrate: number | null;
  avgKda: number | null;
  avgDamage: number | null;
  avgVision: number | null;
  avgGold: number | null;
  avgCs: number | null;
  reliability: "Réelle" | "Faible data" | "Théorique";
};

export async function analyzeDuo(input: DuoAnalysisInput) {
  const apiKey = process.env.RIOT_API_KEY;

  if (!apiKey) {
    throw new Error("RIOT_API_KEY manquante dans Vercel.");
  }

  const adcAccount = await getAccount(input.adcName, input.adcTag, apiKey);
  const suppAccount = await getAccount(input.suppName, input.suppTag, apiKey);

  const matchIds = await getMatchIds(adcAccount.puuid, input.count ?? 20, apiKey);

  const comboMap = createEmptyComboMap();
  const duoMatches = [];

  for (const matchId of matchIds) {
    const match = await getMatch(matchId, apiKey);
    const participants = match.info.participants;

    const adc = participants.find((p) => p.puuid === adcAccount.puuid);
    const supp = participants.find((p) => p.puuid === suppAccount.puuid);

    if (!adc || !supp) continue;
    if (adc.teamId !== supp.teamId) continue;

    const carryChampion = adc.championName;
    const supportChampion = supp.championName;
    const id = comboId(carryChampion, supportChampion);

    if (!trackedComboIds.has(id)) {
      duoMatches.push(formatMatch(match, adc, supp, id, false));
      continue;
    }

    const stat = comboMap.get(id);
    if (stat) {
      stat.games += 1;
      stat.wins += adc.win ? 1 : 0;
      const combinedKills = adc.kills + supp.kills;
      const combinedDeaths = adc.deaths + supp.deaths;
      const combinedAssists = adc.assists + supp.assists;
      const kda = (combinedKills + combinedAssists) / Math.max(1, combinedDeaths);

      stat._kdaTotal += kda;
      stat._damageTotal += adc.totalDamageDealtToChampions + supp.totalDamageDealtToChampions;
      stat._visionTotal += adc.visionScore + supp.visionScore;
      stat._goldTotal += adc.goldEarned + supp.goldEarned;
      stat._csTotal += (adc.totalMinionsKilled ?? 0) + (adc.neutralMinionsKilled ?? 0);
    }

    duoMatches.push(formatMatch(match, adc, supp, id, true));
  }

  const comboStats: ComboStat[] = Array.from(comboMap.values()).map((stat) => {
    const games = stat.games;
    return {
      id: stat.id,
      carry: stat.carry,
      support: stat.support,
      theoreticalScore: stat.theoreticalScore,
      games,
      wins: stat.wins,
      winrate: games ? Math.round((stat.wins / games) * 100) : null,
      avgKda: games ? round(stat._kdaTotal / games, 2) : null,
      avgDamage: games ? Math.round(stat._damageTotal / games) : null,
      avgVision: games ? Math.round(stat._visionTotal / games) : null,
      avgGold: games ? Math.round(stat._goldTotal / games) : null,
      avgCs: games ? round(stat._csTotal / games, 1) : null,
      reliability: games >= 10 ? "Réelle" : games > 0 ? "Faible data" : "Théorique",
    };
  }).sort((a, b) => {
    if (b.games !== a.games) return b.games - a.games;
    return b.theoreticalScore - a.theoreticalScore;
  });

  const playedGames = comboStats.reduce((sum, combo) => sum + combo.games, 0);
  const wins = comboStats.reduce((sum, combo) => sum + combo.wins, 0);

  return {
    accounts: { adc: adcAccount, support: suppAccount },
    summary: {
      searchedMatches: matchIds.length,
      duoGames: playedGames,
      wins,
      winrate: playedGames ? Math.round((wins / playedGames) * 100) : null,
      analyzedAt: new Date().toISOString(),
    },
    comboStats,
    recentDuoMatches: duoMatches.slice(0, 12),
  };
}

async function getAccount(gameName: string, tagLine: string, apiKey: string): Promise<RiotAccount> {
  const url = `${ACCOUNT_BASE}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`;
  const res = await fetch(url, { headers: { "X-Riot-Token": apiKey }, cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Impossible de récupérer le compte ${gameName}#${tagLine}. Code ${res.status}`);
  }
  return res.json();
}

async function getMatchIds(puuid: string, count: number, apiKey: string): Promise<string[]> {
  const safeCount = Math.min(Math.max(count, 5), 50);
  const url = `${MATCH_BASE}/lol/match/v5/matches/by-puuid/${encodeURIComponent(puuid)}/ids?start=0&count=${safeCount}`;
  const res = await fetch(url, { headers: { "X-Riot-Token": apiKey }, cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Impossible de récupérer les matchs. Code ${res.status}`);
  }
  return res.json();
}

async function getMatch(matchId: string, apiKey: string): Promise<RiotMatch> {
  const url = `${MATCH_BASE}/lol/match/v5/matches/${encodeURIComponent(matchId)}`;
  const res = await fetch(url, { headers: { "X-Riot-Token": apiKey }, cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Impossible de récupérer le match ${matchId}. Code ${res.status}`);
  }
  return res.json();
}

function createEmptyComboMap() {
  return new Map(
    combos.map((combo) => [
      combo.id,
      {
        id: combo.id,
        carry: combo.carry,
        support: combo.support,
        theoreticalScore: getComboScore(combo),
        games: 0,
        wins: 0,
        _kdaTotal: 0,
        _damageTotal: 0,
        _visionTotal: 0,
        _goldTotal: 0,
        _csTotal: 0,
      },
    ])
  );
}

function formatMatch(match: RiotMatch, adc: Participant, supp: Participant, id: string, tracked: boolean) {
  return {
    matchId: match.metadata.matchId,
    date: new Date(match.info.gameCreation).toISOString(),
    durationMin: Math.round(match.info.gameDuration / 60),
    patch: match.info.gameVersion?.split(".").slice(0, 2).join("."),
    win: adc.win,
    comboId: id,
    tracked,
    carry: adc.championName,
    support: supp.championName,
    kdaCarry: `${adc.kills}/${adc.deaths}/${adc.assists}`,
    kdaSupport: `${supp.kills}/${supp.deaths}/${supp.assists}`,
    damageCarry: adc.totalDamageDealtToChampions,
    damageSupport: supp.totalDamageDealtToChampions,
    visionSupport: supp.visionScore,
  };
}

function round(value: number, digits: number) {
  const mult = 10 ** digits;
  return Math.round(value * mult) / mult;
}
