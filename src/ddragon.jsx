// Carrega os dados e imagens oficiais pelo Data Dragon da Riot (ícones de campeão, item e feitiço).
// Se a rede falhar, o app continua funcionando com os ícones de reserva (iniciais e símbolos).
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const BASE = "https://ddragon.leagueoflegends.com";
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
const SPELL_ID = {
  flash: "SummonerFlash", ignite: "SummonerDot", heal: "SummonerHeal", barrier: "SummonerBarrier",
  exhaust: "SummonerExhaust", tp: "SummonerTeleport", smite: "SummonerSmite", cleanse: "SummonerBoost", ghost: "SummonerHaste",
};

const DDContext = createContext({ ready: false, version: null, champ: () => null, item: () => null, spell: () => null, runes: () => null });
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
        const [chEn, chPt, itEn, itPt, spPt, rrPt] = await Promise.all([
          get("en_US", "champion"), get("pt_BR", "champion"),
          get("en_US", "item"), get("pt_BR", "item"), get("pt_BR", "summoner"),
          get("pt_BR", "runesReforged").catch(() => null),
        ]);
        if (!dead) setRaw({ v, chEn, chPt, itEn, itPt, spPt, rrPt });
      } catch (e) {
        console.warn("Data Dragon indisponível, usando ícones de reserva.", e);
      }
    })();
    return () => { dead = true; };
  }, []);

  const api = useMemo(() => {
    if (!raw) return { ready: false, version: null, champ: () => null, item: () => null, spell: () => null, runes: () => null };
    const { v, chEn, chPt, itEn, itPt, spPt, rrPt } = raw;

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

    // Resolve a receita de runas do engine (números aleatórios) usando as árvores reais do patch.
    const trees = Array.isArray(rrPt) ? rrPt.filter((t) => t.slots?.length >= 4) : [];
    const strip = (h) => (h || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    const rune = (r) => ({ id: r.id, name: r.name, desc: strip(r.shortDesc), icon: `${BASE}/cdn/img/${r.icon}` });
    const at = (arr, f) => arr[Math.min(arr.length - 1, Math.floor(f * arr.length))];
    const runes = (spec) => {
      if (!spec || !trees.length) return null;
      let tree = null;
      let ks = null;
      if (spec.ks) {
        for (const t of trees) {
          const hit = t.slots[0].runes.find((r) => norm(r.key).includes(spec.ks));
          if (hit) { tree = t; ks = hit; break; }
        }
      }
      if (!tree) { tree = at(trees, spec.t); ks = at(tree.slots[0].runes, spec.r[0]); }
      const others = trees.filter((t) => t.id !== tree.id);
      const sec = at(others, spec.s);
      return {
        tree: { id: tree.id, name: tree.name, icon: `${BASE}/cdn/img/${tree.icon}` },
        keystone: rune(ks),
        minors: [1, 2, 3].map((s) => rune(at(tree.slots[s].runes, spec.r[s]))),
        sec: { id: sec.id, name: sec.name, icon: `${BASE}/cdn/img/${sec.icon}` },
        secMinors: spec.sRows.map((row, k) => rune(at(sec.slots[row].runes, spec.sR[k]))),
      };
    };

    return {
      ready: true,
      version: v,
      champ: (n) => champByName[norm(n)] || null,
      item: (n) => itemByName[norm(n)] || null,
      spell: (k) => spells[k] || null,
      runes,
    };
  }, [raw]);

  return <DDContext.Provider value={api}>{children}</DDContext.Provider>;
}
