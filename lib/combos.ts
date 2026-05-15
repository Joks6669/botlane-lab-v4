export type ComboRole = "ADC + Support" | "APC + Support";

export type Combo = {
  id: string;
  carry: string;
  support: string;
  role: ComboRole;
  style: string;
  difficulty: "Facile" | "Moyen" | "Difficile";
  early: number;
  scaling: number;
  engage: number;
  peel: number;
  poke: number;
  gamePlan: string;
  danger: string;
  bestInto: string;
};

export const combos: Combo[] = [
  { id:"twitch-yuumi", carry:"Twitch", support:"Yuumi", role:"ADC + Support", style:"Hyper scaling", difficulty:"Moyen", early:35, scaling:98, engage:35, peel:80, poke:35, gamePlan:"Survivre early, jouer les resets propres, puis prendre les fights avec invisibilité + Yuumi attachée.", danger:"Lanes engage/poke qui punissent avant le niveau 6.", bestInto:"Compos faibles en hard engage ou incapables de tuer Twitch rapidement." },
  { id:"twitch-nami", carry:"Twitch", support:"Nami", role:"ADC + Support", style:"Poke", difficulty:"Moyen", early:58, scaling:86, engage:45, peel:68, poke:78, gamePlan:"Trades courts avec E de Nami, pression poison, puis roam Twitch après push.", danger:"All-in brutal si Nami rate bubble ou si la wave est mal placée.", bestInto:"Lanes lentes ou supports enchanteurs plus faibles en trade court." },
  { id:"twitch-leona", carry:"Twitch", support:"Leona", role:"ADC + Support", style:"All-in", difficulty:"Difficile", early:65, scaling:78, engage:92, peel:42, poke:25, gamePlan:"Chercher kill lane niveau 2/3, puis snowball via fog of war et engages Leona.", danger:"Si l’all-in échoue, la lane peut devenir très dure.", bestInto:"Lanes immobiles sans cleanse ni peel fort." },
  { id:"twitch-maokai", carry:"Twitch", support:"Maokai", role:"ADC + Support", style:"Catch", difficulty:"Moyen", early:55, scaling:84, engage:82, peel:65, poke:50, gamePlan:"Contrôler les buissons avec saplings, setup root pour Twitch, jouer catch autour des objectifs.", danger:"Manque de sustain contre poke lourd.", bestInto:"Botlanes courtes portées et compos sensibles au contrôle de zone." },
  { id:"twitch-seraphine", carry:"Twitch", support:"Seraphine", role:"ADC + Support", style:"Teamfight", difficulty:"Moyen", early:48, scaling:90, engage:65, peel:82, poke:66, gamePlan:"Lane safe, waveclear, puis teamfights groupés avec ulti Seraphine + DPS Twitch.", danger:"Duo vulnérable si engage adverse très rapide.", bestInto:"Compos qui doivent rentrer en ligne droite." },

  { id:"jinx-yuumi", carry:"Jinx", support:"Yuumi", role:"ADC + Support", style:"Scaling", difficulty:"Moyen", early:40, scaling:92, engage:32, peel:84, poke:42, gamePlan:"Farm propre, limiter les morts early, jouer front-to-back et resets Jinx.", danger:"Manque de pression lane et vulnérabilité aux dives.", bestInto:"Compos peu menaçantes early ou avec frontline alliée." },
  { id:"jinx-nami", carry:"Jinx", support:"Nami", role:"ADC + Support", style:"Peel", difficulty:"Moyen", early:56, scaling:88, engage:54, peel:78, poke:72, gamePlan:"Trades avec rocket + Nami E, sécuriser lane, jouer peel et resets.", danger:"Engage adverse si Jinx n’a pas flash.", bestInto:"Lanes qui ne peuvent pas hard engage en boucle." },
  { id:"jinx-leona", carry:"Jinx", support:"Leona", role:"ADC + Support", style:"All-in", difficulty:"Facile", early:78, scaling:84, engage:96, peel:48, poke:35, gamePlan:"Prendre le niveau 2, forcer all-in, enchaîner CC avec pièges Jinx.", danger:"Si vous perdez la prio, Leona peut se retrouver inutile sous tour.", bestInto:"Botlanes fragiles ou sans mobilité." },
  { id:"jinx-maokai", carry:"Jinx", support:"Maokai", role:"ADC + Support", style:"Control", difficulty:"Facile", early:62, scaling:86, engage:82, peel:74, poke:52, gamePlan:"Contrôle de zone, setup root + traps, teamfight autour des objectifs.", danger:"Peut manquer de pression contre poke très long range.", bestInto:"Compos engage ou objectifs serrés." },
  { id:"jinx-seraphine", carry:"Jinx", support:"Seraphine", role:"ADC + Support", style:"Teamfight", difficulty:"Facile", early:55, scaling:94, engage:68, peel:88, poke:70, gamePlan:"Waveclear, sustain, attendre items Jinx, puis teamfight front-to-back.", danger:"Peut subir les hard engage avant 2 items.", bestInto:"Compos lentes et fights groupés." },

  { id:"zeri-yuumi", carry:"Zeri", support:"Yuumi", role:"ADC + Support", style:"Hyper scaling", difficulty:"Difficile", early:34, scaling:99, engage:35, peel:90, poke:35, gamePlan:"Ne pas mourir early, jouer tempo, puis prendre les fights prolongés.", danger:"Très punissable avant items.", bestInto:"Compos peu capables de lock Zeri." },
  { id:"zeri-nami", carry:"Zeri", support:"Nami", role:"ADC + Support", style:"Scaling", difficulty:"Difficile", early:50, scaling:90, engage:48, peel:78, poke:68, gamePlan:"Trades courts, sustain lane, garder Zeri en vie jusqu’aux fights longs.", danger:"Manque de hard CC fiable.", bestInto:"Duo bot sans gros lockdown." },
  { id:"zeri-leona", carry:"Zeri", support:"Leona", role:"ADC + Support", style:"All-in", difficulty:"Difficile", early:68, scaling:82, engage:94, peel:45, poke:25, gamePlan:"Punir les erreurs de placement, créer l’espace pour que Zeri chase.", danger:"Synergie moins naturelle si Zeri ne peut pas follow l’engage.", bestInto:"Lanes fragiles sans disengage." },
  { id:"zeri-maokai", carry:"Zeri", support:"Maokai", role:"ADC + Support", style:"Catch", difficulty:"Moyen", early:58, scaling:88, engage:82, peel:72, poke:52, gamePlan:"Contrôle vision, catch, puis fight long où Zeri peut kite.", danger:"Peut manquer de dégâts early.", bestInto:"Compos mêlée ou sensibles au contrôle de zone." },
  { id:"zeri-seraphine", carry:"Zeri", support:"Seraphine", role:"ADC + Support", style:"Teamfight", difficulty:"Moyen", early:46, scaling:96, engage:68, peel:90, poke:68, gamePlan:"Jouer très propre en lane, puis group 5v5 avec énorme scaling.", danger:"Très faible si la game explose avant 15 minutes.", bestInto:"Compos peu agressives early." },

  { id:"senna-yuumi", carry:"Senna", support:"Yuumi", role:"ADC + Support", style:"Scaling", difficulty:"Difficile", early:38, scaling:82, engage:25, peel:72, poke:70, gamePlan:"Jouer poke et sustain, scale avec âmes, éviter les hard engage.", danger:"Très fragile aux dives et all-ins.", bestInto:"Lanes passives ou très faibles en engage." },
  { id:"senna-nami", carry:"Senna", support:"Nami", role:"ADC + Support", style:"Poke", difficulty:"Moyen", early:64, scaling:80, engage:48, peel:74, poke:90, gamePlan:"Dominer par poke/sustain, prendre les trades courts, stack âmes.", danger:"All-in adverse si vous avancez sans vision.", bestInto:"Lanes low sustain ou courte portée." },
  { id:"senna-leona", carry:"Senna", support:"Leona", role:"ADC + Support", style:"Catch", difficulty:"Moyen", early:72, scaling:76, engage:96, peel:52, poke:58, gamePlan:"Leona lock, Senna follow avec root + poke. Très fort sur pick isolé.", danger:"Senna peut manquer de DPS front-to-back.", bestInto:"Botlanes squishy et immobiles." },
  { id:"senna-maokai", carry:"Senna", support:"Maokai", role:"ADC + Support", style:"Catch", difficulty:"Facile", early:68, scaling:84, engage:86, peel:78, poke:78, gamePlan:"Contrôle buissons, poke, root chain, très bon autour des objectifs.", danger:"Peut manquer de burst immédiat.", bestInto:"Lanes qui ne peuvent pas contester la vision." },
  { id:"senna-seraphine", carry:"Senna", support:"Seraphine", role:"ADC + Support", style:"Safe lane", difficulty:"Facile", early:60, scaling:92, engage:64, peel:92, poke:86, gamePlan:"Double poke, sustain, waveclear, puis teamfight très fort.", danger:"Vulnérable aux hard engages coordonnés.", bestInto:"Compos lentes et lanes sans engage instantané." },

  { id:"seraphine-yuumi", carry:"Seraphine", support:"Yuumi", role:"APC + Support", style:"Safe lane", difficulty:"Moyen", early:46, scaling:90, engage:54, peel:92, poke:72, gamePlan:"Farm safe, sustain, teamfight énorme avec shields/heals et ulti Sera.", danger:"Manque de pression kill lane.", bestInto:"Compos incapables de punir une lane passive." },
  { id:"seraphine-nami", carry:"Seraphine", support:"Nami", role:"APC + Support", style:"Poke", difficulty:"Facile", early:62, scaling:88, engage:62, peel:84, poke:88, gamePlan:"Poke, sustain, waveclear et fight groupé avec double contrôle.", danger:"Peut manquer de dégâts physiques dans la compo.", bestInto:"Lanes fragiles et compos faibles au poke." },
  { id:"seraphine-leona", carry:"Seraphine", support:"Leona", role:"APC + Support", style:"All-in", difficulty:"Moyen", early:76, scaling:84, engage:98, peel:68, poke:58, gamePlan:"Leona engage, Seraphine follow avec E/ulti. Très fort en CC chain.", danger:"Si Leona rate ses engages, lane moins oppressante.", bestInto:"Duo fragile, sans cleanse ni dash." },
  { id:"seraphine-maokai", carry:"Seraphine", support:"Maokai", role:"APC + Support", style:"Control", difficulty:"Facile", early:70, scaling:92, engage:90, peel:92, poke:78, gamePlan:"Contrôle total des zones, waveclear, CC chain et teamfight monstrueux.", danger:"Peut manquer de DPS si la team n’a pas de dégâts continus.", bestInto:"Compos mêlée et objectifs serrés." }
];

export function comboId(carry: string, support: string) {
  return `${carry}-${support}`.toLowerCase().replaceAll(" ", "-").replaceAll("'", "");
}

export function getComboScore(combo: Combo) {
  return Math.round((combo.early + combo.scaling + combo.engage + combo.peel + combo.poke) / 5);
}

export const trackedComboIds = new Set(combos.map((combo) => combo.id));
