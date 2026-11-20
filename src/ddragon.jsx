// Carrega os dados e imagens oficiais pelo Data Dragon da Riot (ícones de campeão, item e feitiço).
// Se a rede falhar, o app continua funcionando com os ícones de reserva (iniciais e símbolos).
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const BASE = "https://ddragon.leagueoflegends.com";
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const SPELL_ID = {
  flash: "SummonerFlash", ignite: "SummonerDot", heal: "SummonerHeal", barrier: "SummonerBarrier",
  exhaust: "SummonerExhaust", tp: "SummonerTeleport", smite: "SummonerSmite", cleanse: "SummonerBoost", ghost: "SummonerHaste",
};

const DDContext = createContext({ ready: false, version: null, champ: () => null, item: () => null, spell: () => null });
export const useDD = () => useContext(DDContext);

export function DataDragonProvider({ children }) {
  const [raw, setRaw] = useState(null);

  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const versions = await (await fetch(`${BASE}/api/versions.json`)).json();
        const v = versions[0];
        const get = (loc, f) => fetch(`${BASE}/cdn/${v}/data/${loc}/${f}.json`).then((r) => r.json());
        const [chEn, chPt, itEn, itPt, spPt] = await Promise.all([
          get("en_US", "champion"), get("pt_BR", "champion"),
          get("en_US", "item"), get("pt_BR", "item"), get("pt_BR", "summoner"),
        ]);
        if (!dead) setRaw({ v, chEn, chPt, itEn, itPt, spPt });
      } catch (e) {
        console.warn("Data Dragon indisponível, usando ícones de reserva.", e);
      }
    })();
    return () => { dead = true; };
  }, []);

  const api = useMemo(() => {
    if (!raw) return { ready: false, version: null, champ: () => null, item: () => null, spell: () => null };
    const { v, chEn, chPt, itEn, itPt, spPt } = raw;

    const champByName = {};
    Object.values(chEn.data).forEach((c) => {
      champByName[norm(c.name)] = {
        id: c.id,
        name: chPt.data[c.id]?.name || c.name,
        title: chPt.data[c.id]?.title || c.title,
        icon: `${BASE}/cdn/${v}/img/champion/${c.id}.png`,
        splash: `${BASE}/cdn/img/champion/splash/${c.id}_0.jpg`,
        tile: `${BASE}/cdn/img/champion/tiles/${c.id}_0.jpg`,
      };
    });

    const itemByName = {};
    Object.entries(itEn.data).forEach(([id, it]) => {
      const k = norm(it.name);
      const ok = it.maps?.["11"] && it.gold?.purchasable;
      if (!itemByName[k] || (ok && !itemByName[k].ok)) {
        const pt = itPt.data[id];
        itemByName[k] = {
          ok, id,
          name: pt?.name || it.name,
          plain: pt?.plaintext || "",
          gold: it.gold?.total,
          icon: `${BASE}/cdn/${v}/img/item/${id}.png`,
        };
      }
    });

    const spells = {};
    Object.entries(SPELL_ID).forEach(([k, id]) => {
      const s = spPt.data[id];
      if (s) spells[k] = { name: s.name, desc: s.description, cooldown: s.cooldownBurn, icon: `${BASE}/cdn/${v}/img/spell/${s.image.full}` };
    });

    return {
      ready: true,
      version: v,
      champ: (n) => champByName[norm(n)] || null,
      item: (n) => itemByName[norm(n)] || null,
      spell: (k) => spells[k] || null,
    };
  }, [raw]);

  return <DDContext.Provider value={api}>{children}</DDContext.Provider>;
}
