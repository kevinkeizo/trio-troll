import { useEffect, useRef, useState } from "react";
import {
  S, ROLEKEYS, ROLE, SP, CHALLENGES, LEVELS, SHARDS, CHBY,
  gen, genSpells, genRunes, regenBuild, shuffle, pick,
} from "./engine.js";
import { DataDragonProvider, useDD } from "./ddragon.jsx";
import PlayerCard from "./PlayerCard.jsx";
import { sfx, isMuted, setMuted } from "./sfx.js";
import { PLAYERS } from "./pools.js";

const SOURCES = [
  ["Sportskeeda", "https://www.sportskeeda.com/esports/top-5-off-meta-picks-builds-exploit-league-legends-season-11", "Ivern, Udyr, Viego, Yasuo, Poppy"],
  ["High Ground Gaming", "https://www.highgroundgaming.com/best-off-meta-supports-in-lol/", "Suportes, ADCs e selva"],
  ["Dot Esports", "https://dotesports.com/?p=842572", "Mordekaiser no Bronze"],
  ["Dignitas", "https://dignitas.gg/articles/try-these-champion-picks-to-make-your-league-game-more-interesting", "Sett mid, Lucian top"],
  ["Red Bull", "https://redbull.com/ca-en/off-meta-builds-picks-league-of-legends", "Taric top"],
  ["NerfPlz", "https://www.nerfplz.com/2026/09/weird-pick-168-bot-lane-brand.html", "Brand bot"],
  ["MobaFire", "https://www.mobafire.com/league-of-legends/build/troll-builds-just-4-fun-mostly-viable-229063", "Shyvana Lich Bane"],
];

const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k) || "null"); return v ?? d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ok */ } },
};

// Pool de campeões de cada vaga (null = todos). Nomes desconhecidos são avisados no console.
const POOLS = PLAYERS.map((pl) => {
  if (!Array.isArray(pl.champs) || !pl.champs.length) return null;
  const bad = pl.champs.filter((n) => !CHBY[n]);
  if (bad.length) console.warn(`Campeões não reconhecidos no pool de ${pl.name}:`, bad);
  return new Set(pl.champs.filter((n) => CHBY[n]));
});

const loadNames = () => {
  const base = PLAYERS.map((pl) => pl.name);
  const s = store.get("trio-names-v2", null);
  if (Array.isArray(s)) return base.map((n, i) => (typeof s[i] === "string" && s[i].trim() ? s[i].slice(0, 20) : n));
  return base;
};

function Seg({ value, onChange, options }) {
  return (
    <div className="seg">
      {options.map(([v, label]) => (
        <button key={v} className={String(value) === String(v) ? "on" : ""} onClick={() => onChange(v)}>{label}</button>
      ))}
    </div>
  );
}

function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      {Array.from({ length: 14 }).map((_, i) => (
        <svg key={i} className="float" viewBox="0 0 64 64" style={{ "--x": `${(i * 37) % 100}%`, "--s": `${24 + (i * 13) % 50}px`, "--t": `${14 + (i * 5) % 16}s`, "--dl": `${-(i * 3)}s` }}>
          <path d="M32 3 56 17v30L32 61 8 47V17z" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      ))}
    </div>
  );
}

function SoundIcon({ off }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor" stroke="none" />
      {off ? <path d="m17 9 5 5m0-5-5 5" /> : <path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />}
    </svg>
  );
}

function Main() {
  const dd = useDD();
  const [cfg, setCfg] = useState(() => {
    const s = store.get("trio-cfg", {});
    const level = Number.isInteger(s.level) && s.level >= 0 && s.level <= 3 ? s.level : 2;
    return { level, distinct: s.distinct !== false, loose: !!s.loose };
  });
  const [players, setPlayers] = useState(() =>
    loadNames().map((name) => ({ name, roleSel: "auto", locked: false, res: null })));
  const [challenge, setChallenge] = useState("");
  const [toast, setToast] = useState("");
  const [copyText, setCopyText] = useState("");
  const [muted, setMute] = useState(isMuted());
  const rollSeq = useRef(1);
  const toastT = useRef(null);
  const rollRef = useRef(null);
  const L = cfg.level;

  const say = (m) => { setToast(m); clearTimeout(toastT.current); toastT.current = setTimeout(() => setToast(""), 1800); };
  useEffect(() => { store.set("trio-names-v2", players.map((p) => p.name)); }, [players]);
  useEffect(() => { store.set("trio-cfg", cfg); }, [cfg]);

  // O engine lê as regras do objeto S.
  const sync = () => Object.assign(S, { level: L, mode: L === 0 ? "off" : "troll", distinct: cfg.distinct, loose: cfg.loose });
  const patch = (i, fn) => setPlayers((ps) => ps.map((p, j) => (j === i ? fn(p) : p)));
  const newRoll = (r) => ({ ...r, rollId: rollSeq.current++ });

  const nextChallenge = () => {
    const pool = CHALLENGES.filter((c) => c.lvl <= L).map((c) => c.t);
    let n; do { n = pick(pool); } while (n === challenge && pool.length > 1);
    setChallenge(n);
  };

  const rollAll = () => {
    sync();
    sfx.roll();
    const taken = new Set();
    const roles = players.map((p) => {
      if (p.locked && p.res) { if (cfg.distinct) taken.add(p.res.role); return p.res.role; }
      if (p.roleSel !== "auto") { if (cfg.distinct) taken.add(p.roleSel); return p.roleSel; }
      return null;
    });
    const free = shuffle(ROLEKEYS.filter((r) => !cfg.distinct || !taken.has(r)));
    const finalRoles = roles.map((r) => r || (cfg.distinct ? free.pop() : pick(ROLEKEYS)));
    const used = new Set(players.filter((p) => p.locked && p.res).map((p) => p.res.champ));
    setPlayers(players.map((p, i) => {
      if (p.locked && p.res) return p;
      const res = newRoll(gen(finalRoles[i], used, POOLS[i]));
      used.add(res.champ);
      return { ...p, res };
    }));
    nextChallenge();
  };
  rollRef.current = rollAll;

  // Espaço sorteia o trio (fora de campos de texto e botões).
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Space" || e.repeat) return;
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "BUTTON" || t.isContentEditable)) return;
      e.preventDefault();
      rollRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const reroll = (i, part) => {
    sync();
    const p = players[i];
    if (part === "all" || !p.res || L === 0) {
      sfx.roll();
      const others = players.filter((q, j) => j !== i && q.res).map((q) => q.res);
      const used = new Set(others.map((r) => r.champ));
      let role = p.roleSel;
      if (role === "auto") {
        const taken = new Set(cfg.distinct ? others.map((r) => r.role) : []);
        const free = ROLEKEYS.filter((r) => !taken.has(r));
        role = pick(free.length ? free : ROLEKEYS);
      }
      patch(i, (q) => ({ ...q, res: newRoll(gen(role, used, POOLS[i])) }));
      return;
    }
    sfx.swap();
    if (part === "build") {
      const res = { ...p.res }; regenBuild(res); patch(i, (q) => ({ ...q, res }));
    } else if (part === "runes") {
      patch(i, (q) => ({ ...q, res: { ...q.res, runes: genRunes(CHBY[q.res.champ], q.res.role, L) } }));
    } else {
      patch(i, (q) => ({ ...q, res: { ...q.res, spells: genSpells(q.res.role) } }));
    }
  };

  const setLevel = (v) => {
    v = +v;
    if (v === L) return;
    sfx.level(v);
    if ((v === 0) !== (L === 0)) setPlayers((ps) => ps.map((p) => (p.locked ? p : { ...p, res: null })));
    setCfg((c) => ({ ...c, level: v }));
  };

  const toggleMute = () => {
    const m = !muted;
    setMuted(m); setMute(m);
    if (!m) sfx.click();
  };

  const runeText = (spec) => {
    const R = dd.runes(spec);
    if (!R) return "";
    const shards = spec.shards.map((s, k) => SHARDS[k][s]).join(", ");
    return `${R.keystone.name} (${R.tree.name}: ${R.minors.map((x) => x.name).join(", ")} / ${R.sec.name}: ${R.secMinors.map((x) => x.name).join(", ")} / ${shards})`;
  };

  const summary = () => {
    const lines = [`TRIO TROLL - nível ${L} (${LEVELS[L].n})`];
    players.forEach((p) => {
      if (!p.res) return;
      const r = p.res;
      const champ = dd.champ(r.champ)?.name || r.champ;
      const items = r.items.map((n) => dd.item(n)?.name || n).join(", ");
      const spells = r.spells.map((k) => dd.spell(k)?.name || SP[k].pt).join(" + ");
      lines.push("");
      lines.push(`${p.name}: ${champ} (${ROLE[r.role].short})`);
      lines.push(`  Feitiços: ${spells}`);
      if (r.runes) { const t = runeText(r.runes); if (t) lines.push(`  Runas: ${t}`); }
      lines.push(`  ${r.theme.n}: ${items}`);
      if (r.skill) lines.push(`  Maxar: ${r.skill}`);
    });
    if (challenge) { lines.push(""); lines.push(`Desafio: ${challenge}`); }
    return lines.join("\n");
  };

  const copy = async () => {
    if (!players.some((p) => p.res)) { sfx.error(); return say("Sorteie o trio primeiro"); }
    const txt = summary();
    try { await navigator.clipboard.writeText(txt); setCopyText(""); sfx.copy(); say("Resultado copiado"); }
    catch (e) { setCopyText(txt); say("Selecione e copie o texto abaixo"); }
  };

  return (
    <div className="wrap">
      <header className="top">
        <button className="iconbtn mute" onClick={toggleMute} aria-label={muted ? "Ligar som" : "Desligar som"} title={muted ? "Ligar som" : "Desligar som"}>
          <SoundIcon off={muted} />
        </button>
        <svg className="mark" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
          <path d="M32 3 56 17v30L32 61 8 47V17z" /><path d="M32 13 47 22v20L32 51 17 42V22z" opacity=".6" />
          <path d="M32 24v16M24 28l8-4 8 4" strokeLinecap="round" />
        </svg>
        <h1>TRIO TROLL</h1>
        <div className="sub">Campeão, runas, build e feitiços - Bronze</div>
        <div className="patch">
          {dd.ready ? `Ícones, itens e runas do patch ${dd.version} (Data Dragon)` : "Carregando ícones oficiais..."}
        </div>
      </header>

      <section className="panel">
        <div className="in controls">
          <div className="grp"><span className="lab">Nível de troll</span>
            <Seg value={L} onChange={setLevel}
              options={[[0, "0 Sério"], [1, "1 Leve"], [2, "2 Troll"], [3, "3 Caos"]]} />
            <span className="lvdesc">{LEVELS[L].d}</span>
          </div>
          <div className="grp"><span className="lab">Regras</span>
            <div className="toggles">
              <label className="tog"><input type="checkbox" checked={cfg.distinct} onChange={(e) => { sfx.click(); setCfg((c) => ({ ...c, distinct: e.target.checked })); }} /> Roles diferentes</label>
              {(L === 1 || L === 2) && (
                <label className="tog"><input type="checkbox" checked={cfg.loose} onChange={(e) => { sfx.click(); setCfg((c) => ({ ...c, loose: e.target.checked })); }} /> Lane maluca</label>
              )}
            </div>
          </div>
          <div className="rollwrap">
            <button className="roll" onClick={rollAll}>SORTEAR TRIO</button>
            <span className="hint">ou aperte Espaço</span>
          </div>
        </div>
      </section>

      <div className="legend">
        <span><i style={{ background: "var(--ad)" }} />Dano físico</span>
        <span><i style={{ background: "var(--ap)" }} />Dano mágico</span>
        <span><i style={{ background: "var(--tk)" }} />Tanque</span>
        <span><i style={{ background: "var(--sp)" }} />Suporte</span>
        <span><i style={{ background: "var(--bt)" }} />Botas</span>
      </div>

      <div className="cards">
        {players.map((p, i) => (
          <PlayerCard
            key={i} i={i} p={p} level={L} poolSize={POOLS[i] ? POOLS[i].size : 0}
            onName={(v) => patch(i, (q) => ({ ...q, name: v }))}
            onRole={(k) => { sfx.click(); patch(i, (q) => ({ ...q, roleSel: k })); }}
            onLock={() => {
              if (!p.res) { sfx.error(); return say("Sorteie primeiro pra poder travar"); }
              sfx.lock(!p.locked);
              patch(i, (q) => ({ ...q, locked: !q.locked }));
              say(p.locked ? `${p.name} destravado` : `${p.name} travado`);
            }}
            onReroll={(part) => reroll(i, part)}
          />
        ))}
      </div>

      <div className="bottom">
        <section className="panel"><div className="in">
          <h2>Desafio do trio</h2>
          <p className="chal">{challenge || "Sorteie o trio pra ver o desafio da partida."}</p>
          <div className="btnrow">
            <button className="btn" onClick={() => { sfx.swap(); nextChallenge(); }}>Outro desafio</button>
            <button className="btn gold" onClick={copy}>Copiar resultado</button>
          </div>
          {copyText && <textarea className="copybox" readOnly value={copyText} onFocus={(e) => e.target.select()} />}
        </div></section>

        <section className="panel"><div className="in">
          <h2>Fontes das picks off meta</h2>
          <ul className="sources">
            {SOURCES.map(([n, u, d]) => (
              <li key={n}><a href={u} target="_blank" rel="noopener noreferrer">{n}</a> <span>{d}</span></li>
            ))}
          </ul>
          <p className="fine">
            As picks do nível 0 (campeão e rota) vêm dos sites acima. Itens e runas seguem o patch atual, então confira no jogo
            se algo mudou. Projeto de fã, sem ligação com a Riot Games. League of Legends e as imagens carregadas do Data Dragon
            pertencem à Riot Games.
          </p>
        </div></section>
      </div>

      <div className={`toast ${toast ? "show" : ""}`} role="status">{toast}</div>
    </div>
  );
}

export default function App() {
  return (
    <DataDragonProvider>
      <Backdrop />
      <Main />
    </DataDragonProvider>
  );
}
