"use client";

import { useMemo, useState } from "react";
import { combos, getComboScore } from "@/lib/combos";

type ComboStat = {
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

type DuoMatch = {
  matchId: string;
  date: string;
  durationMin: number;
  patch: string;
  win: boolean;
  comboId: string;
  tracked: boolean;
  carry: string;
  support: string;
  kdaCarry: string;
  kdaSupport: string;
  damageCarry: number;
  damageSupport: number;
  visionSupport: number;
};

type AnalysisResponse = {
  summary: {
    searchedMatches: number;
    duoGames: number;
    wins: number;
    winrate: number | null;
    analyzedAt: string;
  };
  comboStats: ComboStat[];
  recentDuoMatches: DuoMatch[];
};

const styles = ["Tous", "Hyper scaling", "Scaling", "All-in", "Poke", "Catch", "Peel", "Teamfight", "Safe lane", "Control"];

export default function Home() {
  const [wantedStyle, setWantedStyle] = useState("Tous");
  const [selectedCarry, setSelectedCarry] = useState("Tous");
  const [selectedSupport, setSelectedSupport] = useState("Tous");
  const [adcName, setAdcName] = useState("PepitoGT");
  const [adcTag, setAdcTag] = useState("");
  const [suppName, setSuppName] = useState("Joks");
  const [suppTag, setSuppTag] = useState("");
  const [count, setCount] = useState("20");
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const statMap = useMemo(() => {
    return new Map((analysis?.comboStats ?? []).map((stat) => [stat.id, stat]));
  }, [analysis]);

  const filteredCombos = useMemo(() => {
    return combos
      .filter((combo) => selectedCarry === "Tous" || combo.carry === selectedCarry)
      .filter((combo) => selectedSupport === "Tous" || combo.support === selectedSupport)
      .filter((combo) => wantedStyle === "Tous" || combo.style === wantedStyle)
      .map((combo) => {
        const stat = statMap.get(combo.id);
        const realBonus = stat?.games
          ? (stat.winrate ?? 0) * 0.6 + Math.min(stat.games * 2, 20)
          : 0;
        const score = stat?.games ? Math.round(realBonus + getComboScore(combo) * 0.35) : getComboScore(combo);
        return { ...combo, stat, score };
      })
      .sort((a, b) => b.score - a.score);
  }, [wantedStyle, selectedCarry, selectedSupport, statMap]);

  const bestCombo = filteredCombos[0] ?? combos[0];
  const bestStat = "stat" in bestCombo ? bestCombo.stat : undefined;

  async function syncRiot() {
    setLoading(true);
    setStatus("Synchronisation Riot en cours...");
    setAnalysis(null);

    try {
      const response = await fetch("/api/riot/duo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adcName, adcTag, suppName, suppTag, count: Number(count) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Erreur inconnue Riot API.");
      }

      setAnalysis(data);
      setStatus(`Analyse terminée : ${data.summary.duoGames} games duo trouvées sur ${data.summary.searchedMatches} matchs.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Erreur inconnue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <aside className="sidebar">
        <div className="logo">Botlane Lab</div>
        <div className="subtitle">
          V4 — Sync Riot réelle : PUUID, historique, duo games et stats par combo.
        </div>

        <nav className="nav">
          <a className="nav-item active" href="#dashboard">Dashboard</a>
          <a className="nav-item" href="#riot">Riot Sync</a>
          <a className="nav-item" href="#draft">Draft Assistant</a>
          <a className="nav-item" href="#combos">Stats Combos</a>
          <a className="nav-item" href="#history">Historique</a>
        </nav>

        <div className="side-box">
          <div className="side-label">Important</div>
          <div>Les scores théoriques restent visibles, mais les vraies stats prennent le dessus dès qu’un combo a été joué.</div>
        </div>
      </aside>

      <main className="main">
        <header className="header" id="dashboard">
          <div>
            <p className="eyebrow">DuoQ Intelligence System</p>
            <h1 className="h1">Botlane Lab V4</h1>
            <p className="lead">
              Analyse vos vraies games Riot, détecte vos combos joués et calcule vos performances duo.
            </p>
          </div>

          <div className="sync-card" id="riot">
            <div className="sync-title">Connexion Riot réelle</div>
            <div className="form-row">
              <input className="input" value={adcName} onChange={(e) => setAdcName(e.target.value)} placeholder="ADC Riot ID" />
              <input className="input" value={adcTag} onChange={(e) => setAdcTag(e.target.value)} placeholder="TAG" />
            </div>
            <div className="form-row">
              <input className="input" value={suppName} onChange={(e) => setSuppName(e.target.value)} placeholder="Support Riot ID" />
              <input className="input" value={suppTag} onChange={(e) => setSuppTag(e.target.value)} placeholder="TAG" />
            </div>
            <select className="full-select" value={count} onChange={(e) => setCount(e.target.value)}>
              <option value="10">10 dernières games</option>
              <option value="20">20 dernières games</option>
              <option value="30">30 dernières games</option>
              <option value="50">50 dernières games</option>
            </select>
            <button className="button" onClick={syncRiot} disabled={loading}>
              {loading ? "Analyse en cours..." : "Synchroniser les games"}
            </button>
            {status && <div className="status">{status}</div>}
          </div>
        </header>

        <section className="grid">
          <div className="card highlight">
            <div className="card-label">Combo recommandé</div>
            <div className="card-value">{bestCombo.carry} + {bestCombo.support}</div>
            <div className="card-note">
              {bestStat?.games ? `${bestStat.winrate}% WR réel · ${bestStat.games} games` : `${bestCombo.style} · score théorique ${getComboScore(bestCombo)}/100`}
            </div>
          </div>

          <div className="card">
            <div className="card-label">Winrate duo</div>
            <div className="card-value">{analysis?.summary.winrate ?? "—"}{analysis?.summary.winrate ? "%" : ""}</div>
            <div className="card-note">{analysis ? `${analysis.summary.wins} wins / ${analysis.summary.duoGames} games duo` : "En attente de sync Riot"}</div>
          </div>

          <div className="card">
            <div className="card-label">Games analysées</div>
            <div className="card-value">{analysis?.summary.duoGames ?? 0}</div>
            <div className="card-note">{analysis ? `${analysis.summary.searchedMatches} matchs scannés` : "Aucune donnée réelle"}</div>
          </div>

          <div className="card">
            <div className="card-label">Fiabilité</div>
            <div className="card-value">{analysis?.summary.duoGames ? "Réelle" : "Base"}</div>
            <div className="card-note">10+ games/combo = recommandation fiable</div>
          </div>
        </section>

        <section className="draft-card" id="draft">
          <div>
            <p className="eyebrow">Draft Assistant</p>
            <h2>Filtrer selon votre plan de jeu</h2>
          </div>

          <div className="filters">
            <label>Carry
              <select value={selectedCarry} onChange={(e) => setSelectedCarry(e.target.value)}>
                <option>Tous</option><option>Twitch</option><option>Jinx</option><option>Zeri</option><option>Senna</option><option>Seraphine</option>
              </select>
            </label>

            <label>Support
              <select value={selectedSupport} onChange={(e) => setSelectedSupport(e.target.value)}>
                <option>Tous</option><option>Yuumi</option><option>Nami</option><option>Leona</option><option>Maokai</option><option>Seraphine</option>
              </select>
            </label>

            <label>Style
              <select value={wantedStyle} onChange={(e) => setWantedStyle(e.target.value)}>
                {styles.map((style) => <option key={style}>{style}</option>)}
              </select>
            </label>
          </div>
        </section>

        <section className="section">
          <div className="card" id="combos">
            <div className="section-title">
              <div>
                <p className="eyebrow">Combo Stats</p>
                <h2>{filteredCombos.length} combos affichés</h2>
              </div>
            </div>

            <div className="combo-list">
              {filteredCombos.map((combo) => {
                const stat = combo.stat;
                return (
                  <article className="combo" key={combo.id}>
                    <div>
                      <div className="combo-name">{combo.carry} + {combo.support}</div>
                      <div className="card-note">{combo.role} · {combo.style} · {combo.difficulty}</div>
                    </div>
                    <div><span className={`badge ${stat?.reliability === "Réelle" ? "good" : ""}`}>{stat?.reliability ?? "Théorique"}</span></div>
                    <div className="mini-stat"><strong>{stat?.games ?? 0}</strong><span>games</span></div>
                    <div className="mini-stat"><strong>{stat?.winrate ?? "—"}</strong><span>WR</span></div>
                    <div className="mini-stat"><strong>{stat?.avgKda ?? "—"}</strong><span>KDA</span></div>
                    <div className="mini-stat"><strong>{combo.score}</strong><span>score</span></div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="card reco">
            <p className="eyebrow">Plan de game</p>
            <h2>{bestCombo.carry} + {bestCombo.support}</h2>
            <p className="plan">{bestCombo.gamePlan}</p>

            <div className="info-block">
              <span>Danger principal</span>
              <p>{bestCombo.danger}</p>
            </div>

            <div className="info-block">
              <span>Meilleur contexte</span>
              <p>{bestCombo.bestInto}</p>
            </div>

            <div className="score-grid">
              <div><strong>{bestCombo.early}</strong><span>early</span></div>
              <div><strong>{bestCombo.scaling}</strong><span>scaling</span></div>
              <div><strong>{bestCombo.engage}</strong><span>engage</span></div>
              <div><strong>{bestCombo.peel}</strong><span>peel</span></div>
              <div><strong>{bestCombo.poke}</strong><span>poke</span></div>
            </div>
          </div>
        </section>

        <section className="card history" id="history">
          <p className="eyebrow">Historique duo récent</p>
          <h2>Dernières games détectées ensemble</h2>
          {!analysis?.recentDuoMatches?.length && <p className="muted">L’historique apparaîtra après synchronisation Riot.</p>}

          <div className="match-list">
            {analysis?.recentDuoMatches?.map((match) => (
              <div className="match" key={match.matchId}>
                <div>
                  <strong>{match.carry} + {match.support}</strong>
                  <span>{new Date(match.date).toLocaleDateString("fr-FR")} · patch {match.patch} · {match.durationMin} min</span>
                </div>
                <div className={match.win ? "win" : "loss"}>{match.win ? "Win" : "Loss"}</div>
                <div>{match.kdaCarry} / {match.kdaSupport}</div>
                <div>{match.tracked ? "Pool suivi" : "Hors pool"}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
