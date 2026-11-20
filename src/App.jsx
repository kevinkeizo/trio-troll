import { useEffect, useRef, useState } from "react";
import {
  S, ROLEKEYS, ROLE, SP, CHALLENGES, LEVELS, SHARDS,
  gen, genSpells, genRunes, regenBuild, shuffle, pick, CHBY,
} from "./engine.js";
import { DataDragonProvider, useDD } from "./ddragon.jsx";
import PlayerCard from "./PlayerCard.jsx";
import { sfx, isMuted, setMuted } from "./sfx.js";

const SOURCES = [
  ["Sportskeeda", "https://www.sportskeeda.com/esports/top-5-off-meta-picks-builds-exploit-league-legends-season-11", "Ivern, Udyr, Viego, Yasuo, Poppy"],
  ["High Ground Gaming", "https://www.highgroundgaming.com/best-off-meta-supports-in-lol/", "Suportes, ADCs e selva"],
  ["Dot Esports", "https://dotesports.com/?p=842572", "Mordekaiser no Bronze"],
  ["Dignitas", "https://dignitas.gg/articles/try-these-champion-picks-to-make-your-league-game-more-interesting", "Sett meio, Lucian topo"],
  ["Red Bull", "https://redbull.com/ca-en/off-meta-builds-picks-league-of-legends", "Taric topo"],
  ["NerfPlz", "https://www.nerfplz.com/2026/09/weird-pick-168-bot-lane-brand.html", "Brand bot"],
  ["MobaFire", "https://www.mobafire.com/league-of-legends/build/troll-builds-just-4-fun-mostly-viable-229063", "Shyvana Lich Bane"],
];

const store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k) || "null"); return v ?? d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ok */ } },
};

const loadNames = () => {
  const base = ["Zebra", "Amigo 1", "Amigo 2"];
  const s = store.get("trio-names", null);
  if (Array.isArray(s)) return base.map((n, i) => (typeof s[i] === "string" && s[i].trim() ? s[i].slice(0, 20) : n));
  return base;
};

function Logo() {
  return (
    <svg className="logo" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="11" r="7" fill="currentColor" />
      <circle cx="11" cy="27" r="7" fill="currentColor" opacity=".55" />
      <circle cx="29" cy="27" r="7" fill="currentColor" opacity=".8" />
    </svg>
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

function Switch({ checked, onChange, label, hint }) {
  return (
    <label className="sw">
      <input type="checkbox" checked={checked} onChange={(e) => { sfx.click(); onChange(e.target.checked); }} />
      <span className="tr" />
      <span>{label}{hint && <small> {hint}</small>}</span>
    </label>
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

  const say = (m) => { setToast(m); clearTimeout(toastT.current); toastT.current = setTimeout(() => setToast(""), 1800); };
  useEffect(() => { store.set("trio-names", players.map((p) => p.name)); }, [players]);
  useEffect(() => { store.set("trio-cfg", cfg); document.documentElement.dataset.level = cfg.level; }, [cfg]);

  // O engine lê as regras do objeto S.
  const sync = () => Object.assign(S, { level: cfg.level, mode: cfg.level === 0 ? "off" : "troll", distinct: cfg.distinct, loose: cfg.loose });
  const patch = (i, fn) => setPlayers((ps) => ps.map((p, j) => (j === i ? fn(p) : p)));
  const newRoll = (r) => ({ ...r, rollId: rollSeq.current++ });

  const nextChallenge = () => {
    const pool = CHALLENGES.filter((c) => c.lvl <= cfg.level).map((c) => c.t);
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
      const res = newRoll(gen(finalRoles[i], used));
      used.add(res.champ);
      return { ...p, res };
    }));
    nextChallenge();
  };
  rollRef.current = rollAll;

  // Espaço sorteia (fora de campos de texto e botões).
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
    if (part === "all" || !p.res || cfg.level === 0) {
      sfx.roll();
      const others = players.filter((q, j) => j !== i && q.res).map((q) => q.res);
      const used = new Set(others.map((r) => r.champ));
      let role = p.roleSel;
      if (role === "auto") {
        const taken = new Set(cfg.distinct ? others.map((r) => r.role) : []);
        const free = ROLEKEYS.filter((r) => !taken.has(r));
        role = pick(free.length ? free : ROLEKEYS);
      }
      patch(i, (q) => ({ ...q, res: newRoll(gen(role, used)) }));
      return;
    }
    sfx.swap();
    if (part === "build") {
      const res = { ...p.res }; regenBuild(res); patch(i, (q) => ({ ...q, res }));
    } else if (part === "runes") {
      patch(i, (q) => ({ ...q, res: { ...q.res, runes: genRunes(CHBY[q.res.champ], q.res.role, cfg.level) } }));
    } else {
      patch(i, (q) => ({ ...q, res: { ...q.res, spells: genSpells(q.res.role) } }));
    }
  };

  const setLevel = (v) => {
    if (v === cfg.level) return;
    sfx.level(v);
    if ((v === 0) !== (cfg.level === 0)) setPlayers((ps) => ps.map((p) => (p.locked ? p : { ...p, res: null })));
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
    const lines = [`TRIO TROLL - nível ${cfg.level} (${LEVELS[cfg.level].n})`];
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
      if (r.skill) lines.push(`  Upar: ${r.skill}`);
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

  const L = cfg.level;

  return (
    <div className="wrap">
      <div className="glow" aria-hidden="true" />
      <header className="top">
        <div className="brand">
          <Logo />
          <div>
            <h1>Trio Troll</h1>
            <p>Campeão, runas, build e feitiços sorteados pros três.</p>
          </div>
        </div>
        <div className="meta">
          <span className="patch">{dd.ready ? `Patch ${dd.version}` : "Carregando dados da Riot..."}</span>
          <button className="iconbtn" onClick={toggleMute} aria-label={muted ? "Ligar som" : "Desligar som"} title={muted ? "Ligar som" : "Desligar som"}>
            <SoundIcon off={muted} />
          </button>
        </div>
      </header>

      <section className="console">
        <span className="lab">Nível de troll</span>
        <div className="levels" role="radiogroup" aria-label="Nível de troll">
          {LEVELS.map((l, i) => (
            <button key={i} role="radio" aria-checked={L === i} className={`lv l${i} ${L === i ? "on" : ""}`} onClick={() => setLevel(i)}>
              <span className="lvn">{i}</span>
              <span className="lvname">
                {l.n}
                <span className="pips">{[1, 2, 3].map((k) => <i key={k} className={k <= i ? "f" : ""} />)}</span>
              </span>
              <span className="lvd">{l.d}</span>
            </button>
          ))}
        </div>
        <div className="consolefoot">
          <div className="toggles">
            <Switch checked={cfg.distinct} onChange={(v) => setCfg((c) => ({ ...c, distinct: v }))} label="Rotas diferentes" />
            {(L === 1 || L === 2) && (
              <Switch checked={cfg.loose} onChange={(v) => setCfg((c) => ({ ...c, loose: v }))} label="Campeão fora da rota" />
            )}
          </div>
          <button className="roll" onClick={rollAll}>Sortear trio <kbd>Espaço</kbd></button>
        </div>
      </section>

      <div className="cards">
        {players.map((p, i) => (
          <PlayerCard
            key={i} i={i} p={p} level={L}
            onName={(v) => patch(i, (q) => ({ ...q, name: v }))}
            onRole={(k) => { sfx.click(); patch(i, (q) => ({ ...q, roleSel: k })); }}
            onLock={() => {
              if (!p.res) { sfx.error(); return say("Sorteie antes de travar"); }
              sfx.lock(!p.locked);
              patch(i, (q) => ({ ...q, locked: !q.locked }));
              say(p.locked ? `${p.name || "Jogador"} destravado` : `${p.name || "Jogador"} travado`);
            }}
            onReroll={(part) => reroll(i, part)}
          />
        ))}
      </div>

      <div className="bottom">
        <section className="box">
          <h2 className="lab">Desafio da partida</h2>
          <p className="chal">{challenge || "Sai junto com o sorteio."}</p>
          <div className="btnrow">
            <button className="btn" onClick={() => { sfx.swap(); nextChallenge(); }}>Outro desafio</button>
            <button className="btn pri" onClick={copy}>Copiar resultado</button>
          </div>
          {copyText && <textarea className="copybox" readOnly value={copyText} onFocus={(e) => e.target.select()} />}
        </section>

        <section className="box">
          <h2 className="lab">Fontes do nível 0</h2>
          <ul className="sources">
            {SOURCES.map(([n, u, d]) => (
              <li key={n}><a href={u} target="_blank" rel="noopener noreferrer">{n}</a> <span>{d}</span></li>
            ))}
          </ul>
          <p className="fine">
            Itens e runas seguem o patch atual do Data Dragon. Confira no cliente antes de travar a build.
            Projeto de fã, sem vínculo com a Riot Games. League of Legends e as imagens são da Riot Games.
          </p>
        </section>
      </div>

      <div className={`toast ${toast ? "show" : ""}`} role="status">{toast}</div>
    </div>
  );
}

export default function App() {
  return (
    <DataDragonProvider>
      <Main />
    </DataDragonProvider>
  );
}
