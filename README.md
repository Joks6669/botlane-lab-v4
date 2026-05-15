# Botlane Lab V4

V4 ajoute la synchronisation Riot réelle.

## Nouveautés

- Endpoint `/api/riot/duo`
- Riot ID + tag pour ADC et support
- Conversion en PUUID
- Récupération des dernières games
- Détection des games jouées ensemble
- Stats par combo : games, WR, KDA moyen, dégâts, vision, gold, CS
- Historique duo récent

## Variable Vercel obligatoire

Dans Vercel > Project > Settings > Environment Variables :

```env
RIOT_API_KEY=ta_clé_riot
```

Puis redeploy.
