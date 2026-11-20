import { useEffect, useRef, useState } from "react";
import {
  S, ROLEKEYS, ROLE, SP, CHALLENGES,
  gen, genSpells, regenBuild, shuffle, pick,
} from "./engine.js";
import { DataDragonProvider, useDD } from "./ddragon.jsx";
import PlayerCard from "./PlayerCard.jsx";

const SOURCES = [
  ["Sportskeeda", "https://www.sportskeeda.com/esports/top-5-off-meta-picks-builds-exploit-league-legends-season-11", "Ivern, Udyr, Viego, Yasuo, Poppy"],
  ["High Ground Gaming", "https://www.highgroundgaming.com/best-off-meta-supports-in-lol/", "Suportes, ADCs e selva"],
  ["Dot Esports", "https://dotesports.com/?p=842572", "Mordekaiser no Bronze"],
  ["Dignitas", "https://dignitas.gg/articles/try-these-champion-picks-to-make-your-league-game-more-interesting", "Sett mid, Lucian top"],
  ["Red Bull", "https://redbull.com/ca-en/off-meta-builds-picks-league-of-legends", "Taric top"],
  ["NerfPlz", "https://www.nerfplz.com/2026/09/weird-pick-168-bot-lane-brand.html", "Brand bot"],
  ["MobaFire", "https://www.mobafire.com/league-of-legends/build/troll-builds-just-4-fun-mostly-viable-229063", "Shyvana Lich Bane"],
];

const loadNames = () => {
  const base = ["Zebra", "Amigo 1", "Amigo 2"];
  try {
    const s = JSON.parse(localStorage.getItem("trio-names") || "null");
    if (Array.isArray(s)) return base.map((n, i) => (typeof s[i] === "string" && s[i].trim() ? s[i].slice(0, 20) : n));
  } catch (e) { /* sem storage, segue com o padrão */ }
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

function Main() {
  const dd = useDD();
  const [cfg, setCfg] = useState({ mode: "troll", level: 2, distinct: true, loose: false });
  const [players, setPlayers] = useState(() =>
    loadNames().map((name) => ({ name, roleSel: "auto", locked: false, res: null })));
  const [challenge, setChallenge] = useState("");
  const [toast, setToast] = useState("");
  const [copyText, setCopyText] = useState("");
  const rollSeq = useRef(1);
  const toastT = useRef(null);

  const say = (m) => { setToast(m); clearTimeout(toastT.current); toastT.current = setTimeout(() => setToast(""), 1800); };
  useEffect(() => { try { localStorage.setItem("trio-names", JSON.stringify(players.map((p) => p.name))); } catch (e) { /* ok */ } }, [players]);

  const sync = () => Object.assign(S, cfg); // o engine lê as regras do objeto S
  const patch = (i, fn) => setPlayers((ps) => ps.map((p, j) => (j === i ? fn(p) : p)));
  const newRoll = (r) => ({ ...r, rollId: rollSeq.current++ });

  const nextChallenge = () => {
    let n; do { n = pick(CHALLENGES); } while (n === challenge && CHALLENGES.length > 1);
    setChallenge(n);
  };

  const rollAll = () => {
    sync();
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

  const reroll = (i, part) => {
    sync();
    const p = players[i];
    if (part === "all" || !p.res || cfg.mode === "off") {
      const others = players.filter((q, j) => j !== i && q.res).map((q) => q.res);
      const used = new Set(others.map((r) => r.champ));
      let role = p.roleSel;
      if (role === "auto") {
        const taken = new Set(cfg.distinct ? others.map((r) => r.role) : []);
        const free = ROLEKEYS.filter((r) => !taken.has(r));
        role = pick(free.length ? free : ROLEKEYS);
      }
      patch(i, (q) => ({ ...q, res: newRoll(gen(role, used)) }));
    } else if (part === "build") {
      const res = { ...p.res }; regenBuild(res); patch(i, (q) => ({ ...q, res }));
    } else {
      patch(i, (q) => ({ ...q, res: { ...q.res, spells: genSpells(q.res.role) } }));
    }
  };

  const changeMode = (mode) => {
    setCfg((c) => ({ ...c, mode }));
    setPlayers((ps) => ps.map((p) => (p.locked ? p : { ...p, res: null })));
  };

  const summary = () => {
    const lines = [`TRIO ${cfg.mode === "off" ? "OFF META" : `TROLL nível ${cfg.level}`} - Bronze`];
    players.forEach((p) => {
      if (!p.res) return;
      const r = p.res;
      lines.push(`${p.name}: ${r.champ} (${ROLE[r.role].short}) | ${r.spells.map((k) => SP[k].pt).join(" + ")} | ${r.theme.n}: ${r.items.join(", ")}`);
    });
    if (challenge) lines.push(`Desafio: ${challenge}`);
    return lines.join("\n");
  };

  const copy = async () => {
    if (!players.some((p) => p.res)) return say("Sorteie o trio primeiro");
    const txt = summary();
    try { await navigator.clipboard.writeText(txt); setCopyText(""); say("Resultado copiado"); }
    catch (e) { setCopyText(txt); say("Selecione e copie o texto abaixo"); }
  };

  return (
    <div className="wrap">
      <header className="top">
        <svg className="mark" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
          <path d="M32 3 56 17v30L32 61 8 47V17z" /><path d="M32 13 47 22v20L32 51 17 42V22z" opacity=".6" />
          <path d="M32 24v16M24 28l8-4 8 4" strokeLinecap="round" />
        </svg>
        <h1>TRIO TROLL</h1>
        <div className="sub">Sorteador de campeão, build e feitiços - Bronze</div>
        <div className="patch">
          {dd.ready ? `Ícones e itens do patch ${dd.version} (Data Dragon)` : "Carregando ícones oficiais..."}
        </div>
      </header>

      <section className="panel">
        <div className="in controls">
          <div className="grp"><span className="lab">Modo</span>
            <Seg value={cfg.mode} onChange={changeMode} options={[["off", "Off meta (dos sites)"], ["troll", "Troll"]]} />
          </div>
          {cfg.mode === "troll" && (
            <div className="grp"><span className="lab">Nível de troll</span>
              <Seg value={cfg.level} onChange={(v) => setCfg((c) => ({ ...c, level: +v }))}
                options={[[1, "1 Quase sério"], [2, "2 Troll jogável"], [3, "3 Caos"]]} />
            </div>
          )}
          <div className="grp"><span className="lab">Regras</span>
            <div className="toggles">
              <label className="tog"><input type="checkbox" checked={cfg.distinct} onChange={(e) => setCfg((c) => ({ ...c, distinct: e.target.checked }))} /> Roles diferentes</label>
              {cfg.mode === "troll" && cfg.level < 3 && (
                <label className="tog"><input type="checkbox" checked={cfg.loose} onChange={(e) => setCfg((c) => ({ ...c, loose: e.target.checked }))} /> Lane maluca</label>
              )}
            </div>
          </div>
          <div className="rollwrap"><button className="roll" onClick={rollAll}>SORTEAR TRIO</button></div>
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
            key={i} i={i} p={p} mode={cfg.mode}
            onName={(v) => patch(i, (q) => ({ ...q, name: v.trim() ? v : `Jogador ${i + 1}` }))}
            onRole={(k) => patch(i, (q) => ({ ...q, roleSel: k }))}
            onLock={() => {
              if (!p.res) return say("Sorteie primeiro pra poder travar");
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
            <button className="btn" onClick={nextChallenge}>Outro desafio</button>
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
            As picks (campeão e rota) vêm dos sites acima. Os itens foram ajustados para a lista atual, então confira no jogo
            se algum mudou. Projeto de fã, sem ligação com a Riot Games. League of Legends e as imagens carregadas do Data Dragon
            pertencem à Riot Games.
          </p>
        </div></section>
      </div>

      <div className={`toast ${toast ? "show" : ""}`}>{toast}</div>
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
