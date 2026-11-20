import { useEffect, useState } from "react";
import { CH, ROLE, ROLEKEYS, SP, ITEMCAT, SHARDS } from "./engine.js";
import { useDD } from "./ddragon.jsx";
import { sfx } from "./sfx.js";

const DMGLAB = { a: "Dano físico", p: "Dano mágico", h: "Dano híbrido" };
const hue = (name) => { let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360; return h; };
const initials = (name) => {
  const w = name.replace(/[^A-Za-z& ]/g, " ").split(/\s+/).filter((x) => x && x !== "&");
  return (w.length >= 2 ? w[0][0] + w[1][0] : (w[0] || "?")[0]).toUpperCase();
};
const acr = (n) =>
  n.replace(/[^A-Za-z' ]/g, "").split(/\s+/).filter((w) => /^[A-Z]/.test(w) && w !== "The" && w !== "Of").map((w) => w[0]).join("").slice(0, 3);

function ChampIcon({ name, size = 96 }) {
  const dd = useDD();
  const c = dd.champ(name);
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [name]);
  return (
    <div className="hex" style={{ width: size, height: size, "--h": hue(name) }}>
      {c && !broken ? (
        <img src={c.icon} alt={name} onError={() => setBroken(true)} />
      ) : (
        <span className="mono" style={{ fontSize: size * 0.4 }}>{initials(name)}</span>
      )}
    </div>
  );
}

function SpellTile({ k }) {
  const dd = useDD();
  const s = SP[k];
  const d = dd.spell(k);
  return (
    <div className="spell">
      <span className="sicon" style={{ "--c": s.c }}>
        {d ? (
          <img src={d.icon} alt={s.pt} />
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd"><path d={s.p} /></svg>
        )}
      </span>
      <div>
        <b>{d ? d.name : s.pt}</b>
        <small>{s.en}{d?.cooldown ? ` · ${d.cooldown}s` : ""}</small>
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
      <span className="num">{n + 1}</span>
      <div className="iframe">
        {it ? <img src={it.icon} alt={name} loading="lazy" /> : <span className="acr">{acr(name)}</span>}
      </div>
      <span className="iname">{it ? it.name : name}</span>
      <div className="tip">
        <b>{it ? it.name : name}</b>
        {it?.plain && <p>{it.plain}</p>}
        {it?.gold ? <em>{it.gold} de ouro</em> : null}
      </div>
    </li>
  );
}

function RuneDot({ r, big }) {
  return (
    <span className={`rdot ${big ? "big" : ""}`}>
      <img src={r.icon} alt={r.name} loading="lazy" />
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
  if (!R) return <p className="rnone">{dd.ready ? "Runas indisponíveis neste patch." : "Carregando runas..."}</p>;
  return (
    <div className="runes">
      <div className="rmain">
        <RuneDot r={R.keystone} big />
        <div>
          <b>{R.keystone.name}</b>
          <span>{R.tree.name} + {R.sec.name}</span>
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

const Meter = ({ l }) => (
  <span className="meter" title={`Nível de troll ${l} de 5`}>
    {[1, 2, 3, 4, 5].map((i) => <i key={i} className={i <= l ? "f" : ""} />)}
  </span>
);

export default function PlayerCard({ i, p, level, poolSize, onName, onRole, onLock, onReroll }) {
  const dd = useDD();
  const r = p.res;
  const [spin, setSpin] = useState(null);

  // Efeito de "caça-níquel" quando o campeão muda (rollId novo): desacelera e para com som.
  useEffect(() => {
    if (!r) return undefined;
    const c = dd.champ(r.champ);
    if (c) { const im = new Image(); im.src = c.splash; }
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) { sfx.reveal(i); return undefined; }
    const total = 300 + i * 150; // trio inteiro revela em 0,6s (antes 1,6s)
    const start = performance.now();
    let timer;
    const step = () => {
      const el = performance.now() - start;
      if (el >= total) { setSpin(null); sfx.reveal(i); return; }
      setSpin(CH[Math.floor(Math.random() * CH.length)].n);
      sfx.tick();
      const k = el / total;
      timer = setTimeout(step, 35 + k * k * 110);
    };
    step();
    return () => { clearTimeout(timer); setSpin(null); };
  }, [r?.rollId]);

  const champ = r ? dd.champ(r.champ) : null;

  return (
    <article className={`panel card ${p.locked ? "locked" : ""} ${spin ? "rolling" : ""}`}>
      <div className="in">
        {champ && !spin && <div className="splash" style={{ backgroundImage: `url(${champ.splash})` }} />}
        <div className="body">
          <div className="chead">
            <input
              className="pname" maxLength={20} value={p.name}
              onChange={(e) => onName(e.target.value)} aria-label={`Nome do jogador ${i + 1}`}
            />
            <button
              className={`iconbtn ${p.locked ? "on" : ""}`}
              onClick={onLock} title="Travar este jogador no próximo sorteio" aria-label="Travar"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="10" rx="1" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
              </svg>
            </button>
          </div>

          <div className="roles">
            {["auto", ...ROLEKEYS].map((k) => (
              <button key={k} className={p.roleSel === k ? "on" : ""} onClick={() => onRole(k)} data-role={k}>
                {k === "auto" ? "Auto" : ROLE[k].short}
              </button>
            ))}
          </div>

          {!r && (
            <div className="empty">
              <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M32 3 56 17v30L32 61 8 47V17z" /><path d="M32 13 47 22v20L32 51 17 42V22z" opacity=".5" />
                <path d="M32 24v16M24 28l8-4 8 4" strokeLinecap="round" />
              </svg>
              <b>AGUARDANDO</b>
              Aperte SORTEAR TRIO
            </div>
          )}

          {r && spin && (
            <div className="spinning">
              <ChampIcon name={spin} />
              <div>
                <div className="crole">Sorteando...</div>
                <h3 className="cname blur">{dd.champ(spin)?.name || spin}</h3>
              </div>
            </div>
          )}

          {r && !spin && (
            <>
              <div className="champ reveal">
                <ChampIcon name={r.champ} />
                <div>
                  <div className="crole" data-role={r.role}>{ROLE[r.role].full}</div>
                  <h3 className="cname">{champ?.name || r.champ}</h3>
                  {champ?.title && <div className="ctitle">{champ.title}</div>}
                  <div className="tags">
                    <span className="tag">{DMGLAB[r.dmg]}</span>
                    <span className="tag ok">Off meta</span>
                    {!r.off && <span className="tag hot">Troll <Meter l={r.troll} /></span>}
                  </div>
                </div>
              </div>

              <div className="blk reveal" style={{ "--d": ".1s" }}>
                <h4>Feitiços</h4>
                <div className="spells">{r.spells.map((k) => <SpellTile key={k} k={k} />)}</div>
              </div>

              {r.runes && (
                <div className="blk reveal" style={{ "--d": ".15s" }}>
                  <h4>Runas</h4>
                  <Runes spec={r.runes} />
                </div>
              )}

              <div className="blk reveal" style={{ "--d": ".2s" }}>
                <h4>Build</h4>
                <div className="theme"><b>{r.theme.n}</b><span>{r.theme.d}</span></div>
                <ol className="items">
                  {r.items.map((n, k) => <ItemCell key={`${r.rollId}-${r.theme.n}-${n}`} name={n} n={k} />)}
                </ol>
                {r.skill && <div className="skill">Maxar habilidades: <b>{r.skill}</b></div>}
                {r.src && (
                  <div className="src">Pick de <a href={r.url} target="_blank" rel="noopener noreferrer">{r.src}</a></div>
                )}
              </div>
            </>
          )}

          {poolSize > 0 && <div className="pool">Sorteando entre <b>{poolSize}</b> campeões da conta</div>}

          <div className="actions">
            <button onClick={() => onReroll("all")}>Outro campeão</button>
            {level > 0 && <button onClick={() => onReroll("build")}>Outra build</button>}
            {level > 0 && <button onClick={() => onReroll("spells")}>Outros feitiços</button>}
            {level > 0 && <button onClick={() => onReroll("runes")}>Outras runas</button>}
          </div>
        </div>
      </div>
    </article>
  );
}
