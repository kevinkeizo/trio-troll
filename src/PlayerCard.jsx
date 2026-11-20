import { useEffect, useState } from "react";
import { CH, ROLE, ROLEKEYS, SP, ITEMCAT, SHARDS } from "./engine.js";
import { useDD } from "./ddragon.jsx";
import { sfx } from "./sfx.js";

const DMGLAB = { a: "Dano físico", p: "Dano mágico", h: "Dano híbrido" };
const CATLAB = { ad: "Dano físico", ap: "Dano mágico", tk: "Tanque", sp: "Suporte", bt: "Botas" };
const LVLAB = ["Sério", "Leve", "Troll", "Caos"];
const initials = (name) => {
  const w = name.replace(/[^A-Za-z& ]/g, " ").split(/\s+/).filter((x) => x && x !== "&");
  return (w.length >= 2 ? w[0][0] + w[1][0] : (w[0] || "?")[0]).toUpperCase();
};
const acr = (n) =>
  n.replace(/[^A-Za-z' ]/g, "").split(/\s+/).filter((w) => /^[A-Z]/.test(w) && w !== "The" && w !== "Of").map((w) => w[0]).join("").slice(0, 3);

function Face({ name }) {
  const dd = useDD();
  const c = dd.champ(name);
  return (
    <span className="face">
      {c ? <img src={c.icon} alt="" /> : <b>{initials(name)}</b>}
    </span>
  );
}

function SpellTile({ k }) {
  const dd = useDD();
  const s = SP[k];
  const d = dd.spell(k);
  return (
    <div className="spell">
      <span className="sicon" style={{ "--c": s.c }}>
        {d ? <img src={d.icon} alt="" /> : <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd"><path d={s.p} /></svg>}
      </span>
      <div>
        <b>{d ? d.name : s.pt}</b>
        <small>{d?.cooldown ? `${d.cooldown}s` : s.en}</small>
      </div>
    </div>
  );
}

function ItemCell({ name, n }) {
  const dd = useDD();
  const it = dd.item(name);
  const cat = ITEMCAT[name] || "ot";
  return (
    <li className={`item it-${cat}`} style={{ "--k": n }}>
      <div className="iframe">
        {it ? <img src={it.icon} alt="" loading="lazy" /> : <span className="acr">{acr(name)}</span>}
      </div>
      <div className="itxt">
        <span className="num">{n + 1}</span>
        <span className="iname">{it ? it.name : name}</span>
      </div>
      <div className="tip">
        <b>{it ? it.name : name}</b>
        {CATLAB[cat] && <span className="tcat">{CATLAB[cat]}</span>}
        {it?.plain && <p>{it.plain}</p>}
        {it?.gold ? <em>{it.gold} de ouro</em> : null}
      </div>
    </li>
  );
}

function RuneDot({ r, big }) {
  return (
    <span className={`rdot ${big ? "big" : ""}`}>
      <img src={r.icon} alt="" loading="lazy" />
      <span className="tip">
        <b>{r.name}</b>
        {r.desc && <p>{r.desc}</p>}
      </span>
    </span>
  );
}

function Runes({ spec }) {
  const dd = useDD();
  const R = dd.runes(spec);
  if (!R) return <p className="muted">{dd.ready ? "Runas indisponíveis neste patch." : "Carregando runas..."}</p>;
  return (
    <div className="runes">
      <div className="rmain">
        <RuneDot r={R.keystone} big />
        <div>
          <b>{R.keystone.name}</b>
          <small>{R.tree.name} + {R.sec.name}</small>
        </div>
      </div>
      <div className="rrow">
        <img className="tree" src={R.tree.icon} alt={R.tree.name} title={R.tree.name} />
        {R.minors.map((r) => <RuneDot key={r.id} r={r} />)}
        <span className="rsep" />
        <img className="tree" src={R.sec.icon} alt={R.sec.name} title={R.sec.name} />
        {R.secMinors.map((r) => <RuneDot key={r.id} r={r} />)}
      </div>
      <div className="shards">
        {spec.shards.map((s, k) => <span key={k}>{SHARDS[k][s]}</span>)}
      </div>
    </div>
  );
}

export default function PlayerCard({ i, p, level, onName, onRole, onLock, onReroll }) {
  const dd = useDD();
  const r = p.res;
  const [spin, setSpin] = useState(null);

  // Roleta que desacelera e para; cada card para um pouco depois do anterior.
  useEffect(() => {
    if (!r) return undefined;
    const c = dd.champ(r.champ);
    if (c) { const im = new Image(); im.src = c.splash; }
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) { sfx.reveal(i); return undefined; }
    const total = 950 + i * 420;
    const start = performance.now();
    let timer;
    const step = () => {
      const el = performance.now() - start;
      if (el >= total) { setSpin(null); sfx.reveal(i); return; }
      setSpin(CH[Math.floor(Math.random() * CH.length)].n);
      sfx.tick();
      const k = el / total;
      timer = setTimeout(step, 40 + k * k * 200);
    };
    step();
    return () => { clearTimeout(timer); setSpin(null); };
  }, [r?.rollId]);

  const champ = r ? dd.champ(r.champ) : null;
  const off = r?.off;

  return (
    <article className={`card ${p.locked ? "locked" : ""} ${spin ? "rolling" : ""}`}>
      <div className={`banner ${r ? "" : "blank"}`}>
        {r && !spin && champ && <img className="splash" key={r.rollId} src={champ.splash} alt="" />}
        <div className="btop">
          <input
            className="pname" maxLength={20} value={p.name}
            onChange={(e) => onName(e.target.value)} aria-label={`Nome do jogador ${i + 1}`}
          />
          <button
            className={`iconbtn ${p.locked ? "on" : ""}`} onClick={onLock}
            title={p.locked ? "Destravar" : "Travar: mantém este jogador no próximo sorteio"}
            aria-label={p.locked ? "Destravar jogador" : "Travar jogador"} aria-pressed={p.locked}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d={p.locked ? "M8 11V8a4 4 0 0 1 8 0v3" : "M8 11V8a4 4 0 0 1 7.5-2"} />
            </svg>
          </button>
        </div>
        <div className="bbody">
          {!r && (
            <div className="empty">
              <b>Sem campeão</b>
              <span>Aperte Espaço ou Sortear trio</span>
            </div>
          )}
          {r && spin && (
            <div className="spinning">
              <Face name={spin} />
              <span className="cname">{dd.champ(spin)?.name || spin}</span>
            </div>
          )}
          {r && !spin && (
            <div className="reveal">
              <span className="crole" data-role={r.role}>{ROLE[r.role].full}</span>
              <h3 className="cname">{champ?.name || r.champ}</h3>
              {champ?.title && <span className="ctitle">{champ.title}</span>}
            </div>
          )}
        </div>
      </div>

      <div className="cbody">
        <div className="roles" role="group" aria-label="Rota">
          {["auto", ...ROLEKEYS].map((k) => (
            <button key={k} className={p.roleSel === k ? "on" : ""} onClick={() => onRole(k)} aria-pressed={p.roleSel === k}>
              {k === "auto" ? "Auto" : ROLE[k].short}
            </button>
          ))}
        </div>

        {r && !spin && (
          <>
            <div className="tags reveal">
              <span className="tag">{DMGLAB[r.dmg]}</span>
              <span className={`tag lvl l${r.troll}`}>{off ? "Nível 0 · Off meta" : `Nível ${r.troll} · ${LVLAB[r.troll]}`}</span>
            </div>

            <section className="sec reveal" style={{ "--d": ".05s" }}>
              <h4>Feitiços</h4>
              <div className="spells">{r.spells.map((k) => <SpellTile key={k} k={k} />)}</div>
            </section>

            {r.runes && (
              <section className="sec reveal" style={{ "--d": ".1s" }}>
                <h4>Runas</h4>
                <Runes spec={r.runes} />
              </section>
            )}

            <section className="sec reveal" style={{ "--d": ".15s" }}>
              <h4>Build</h4>
              <div className="theme"><b>{r.theme.n}</b><p>{r.theme.d}</p></div>
              <ol className="items">
                {r.items.map((n, k) => <ItemCell key={`${r.rollId}-${r.theme.n}-${n}`} name={n} n={k} />)}
              </ol>
              {r.skill && (
                <div className="skill">
                  <span>Upar</span>
                  {r.skill.split(" > ").map((s, k) => (
                    <span key={s} className="skk">{k > 0 && <i className="gt">›</i>}<kbd className="key">{s}</kbd></span>
                  ))}
                </div>
              )}
              {r.src && (
                <p className="src">Pick de <a href={r.url} target="_blank" rel="noopener noreferrer">{r.src}</a></p>
              )}
            </section>
          </>
        )}
      </div>

      <div className="actions">
        <span className="alab">Trocar</span>
        <button onClick={() => onReroll("all")}>Campeão</button>
        {level > 0 && <button onClick={() => onReroll("build")}>Build</button>}
        {level > 0 && <button onClick={() => onReroll("spells")}>Feitiços</button>}
        {level > 0 && <button onClick={() => onReroll("runes")}>Runas</button>}
      </div>
    </article>
  );
}
