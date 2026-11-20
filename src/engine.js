
// Dados e lógica do sorteio (sem React). S é sincronizado pelo App antes de cada sorteio.
export const ROLE = {
  T:{full:"Topo",short:"Topo"}, J:{full:"Selva",short:"Selva"}, M:{full:"Meio",short:"Meio"},
  A:{full:"Atirador (ADC)",short:"ADC"}, S:{full:"Suporte",short:"Sup"}
};
export const ROLEKEYS = ["T","J","M","A","S"];

export const RAW = `Aatrox|TJ|a
Ahri|M|p
Akali|TM|p
Akshan|MA|a
Alistar|S|h
Ambessa|TJ|a
Amumu|JS|h
Anivia|M|p
Annie|MS|p
Aphelios|A|a
Ashe|AS|a
Aurelion Sol|M|p
Aurora|MT|p
Azir|M|p
Bard|S|p
Bel'Veth|J|a
Blitzcrank|S|h
Brand|SMJ|p
Braum|S|h
Briar|J|a
Caitlyn|A|a
Camille|T|a
Cassiopeia|MT|p
Cho'Gath|T|h
Corki|MA|h
Darius|T|a
Diana|JM|p
Dr. Mundo|TJ|h
Draven|A|a
Ekko|JM|p
Elise|J|p
Evelynn|J|p
Ezreal|A|h
Fiddlesticks|J|p
Fiora|T|a
Fizz|M|p
Galio|MS|p
Gangplank|T|a
Garen|T|a
Gnar|T|a
Gragas|JT|p
Graves|J|a
Gwen|TJ|p
Hecarim|J|a
Heimerdinger|MT|p
Hwei|M|p
Illaoi|T|a
Irelia|TM|a
Ivern|J|p
Janna|S|p
Jarvan IV|J|a
Jax|TJ|a
Jayce|TM|a
Jhin|A|a
Jinx|A|a
K'Sante|T|a
Kai'Sa|A|h
Kalista|A|a
Karma|SM|p
Karthus|JM|p
Kassadin|M|p
Katarina|M|p
Kayle|TA|h
Kayn|J|a
Kennen|T|p
Kha'Zix|J|a
Kindred|J|a
Kled|T|a
Kog'Maw|A|h
LeBlanc|M|p
Lee Sin|J|a
Leona|S|h
Lillia|J|p
Lissandra|M|p
Locke|MJ|a
Lucian|ATM|a
Lulu|S|p
Lux|SM|p
Malphite|TS|h
Malzahar|MS|p
Maokai|SJT|h
Master Yi|J|a
Mel|MS|p
Milio|S|p
Miss Fortune|A|a
Mordekaiser|TMJ|p
Morgana|S|p
Naafiri|JM|a
Nami|S|p
Nasus|T|h
Nautilus|S|h
Neeko|MSA|p
Nidalee|J|p
Nilah|A|a
Nocturne|J|a
Nunu & Willump|J|h
Olaf|TJ|a
Orianna|M|p
Ornn|T|h
Pantheon|ST|a
Poppy|TJS|h
Pyke|S|a
Qiyana|MJ|a
Quinn|TA|a
Rakan|S|h
Rammus|J|h
Rek'Sai|J|a
Rell|S|h
Renata Glasc|S|p
Renekton|T|a
Rengar|J|a
Riven|T|a
Rumble|TM|p
Ryze|MT|p
Samira|A|a
Sejuani|J|h
Senna|SA|a
Seraphine|SA|p
Sett|TMS|a
Shaco|JS|h
Shen|T|h
Shyvana|J|h
Singed|T|p
Sion|TS|h
Sivir|A|a
Skarner|J|h
Smolder|A|h
Sona|S|p
Soraka|S|p
Swain|SM|p
Sylas|MJ|p
Syndra|M|p
Tahm Kench|ST|h
Taliyah|JM|p
Talon|JM|a
Taric|ST|h
Teemo|T|p
Thresh|S|h
Tristana|A|a
Trundle|JT|a
Tryndamere|T|a
Twisted Fate|M|p
Twitch|A|h
Udyr|J|h
Urgot|T|a
Varus|AM|h
Vayne|A|a
Veigar|M|p
Vel'Koz|SM|p
Vex|M|p
Vi|J|a
Viego|JM|a
Viktor|M|p
Vladimir|MT|p
Volibear|TJ|h
Warwick|J|h
Wukong|JT|a
Xayah|A|a
Xerath|SM|p
Xin Zhao|J|a
Yasuo|MAT|a
Yone|MT|a
Yorick|T|h
Yunara|A|a
Yuumi|S|p
Zaahen|TJ|a
Zac|J|h
Zed|M|a
Zeri|A|a
Ziggs|MA|p
Zilean|S|p
Zoe|M|p
Zyra|S|p`;
export const CH = RAW.trim().split("\n").map(l=>{const [n,r,d]=l.split("|");return {n:n,r:r.split(""),d:d};});
export const CHBY = Object.fromEntries(CH.map(c=>[c.n,c]));

export const POOL = {
  ad:["Trinity Force","Infinity Edge","Black Cleaver","Sundered Sky","Eclipse","Ravenous Hydra","Titanic Hydra","Profane Hydra","Stridebreaker","Death's Dance","Maw of Malmortius","Mortal Reminder","Lord Dominik's Regards","Bloodthirster","Phantom Dancer","Rapid Firecannon","Statikk Shiv","Kraken Slayer","Blade of the Ruined King","Guinsoo's Rageblade","Navori Flickerblade","Essence Reaver","Serylda's Grudge","Youmuu's Ghostblade","Spear of Shojin","Hullbreaker","Edge of Night","Immortal Shieldbow","Experimental Hexplate","Terminus","Sterak's Gage","Guardian Angel","The Collector","Runaan's Hurricane","Voltaic Cyclosword","Manamune","Hubris","Axiom Arc","Umbral Glaive","Serpent's Fang","Bastionbreaker"],
  ap:["Rabadon's Deathcap","Void Staff","Shadowflame","Zhonya's Hourglass","Lich Bane","Luden's Echo","Liandry's Torment","Rod of Ages","Morellonomicon","Cosmic Drive","Horizon Focus","Riftmaker","Banshee's Veil","Nashor's Tooth","Stormsurge","Hextech Rocketbelt","Archangel's Staff","Cryptbloom","Malignance","Rylai's Crystal Scepter","Mejai's Soulstealer","Wit's End","Blackfire Torch"],
  tk:["Sunfire Aegis","Thornmail","Randuin's Omen","Warmog's Armor","Spirit Visage","Force of Nature","Jak'Sho, The Protean","Frozen Heart","Dead Man's Plate","Gargoyle Stoneplate","Abyssal Mask","Kaenic Rookern","Hollow Radiance","Iceborn Gauntlet","Heartsteel","Winter's Approach","Unending Despair","Knight's Vow","Zeke's Convergence","Locket of the Iron Solari"],
  sp:["Moonstone Renewer","Staff of Flowing Water","Ardent Censer","Redemption","Mikael's Blessing","Shurelya's Battlesong","Imperial Mandate","Dream Maker","Celestial Opposition","Solstice Sleigh","Bloodsong","Echoes of Helia"],
  bt:["Berserker's Greaves","Sorcerer's Shoes","Plated Steelcaps","Mercury's Treads","Ionian Boots of Lucidity","Boots of Swiftness"]
};
export const ITEMCAT = {};
Object.keys(POOL).forEach(k=>POOL[k].forEach(n=>ITEMCAT[n]=k));
export const NONBOOT = [].concat(POOL.ad,POOL.ap,POOL.tk,POOL.sp);

export const SP = {
  flash:{pt:"Flash",en:"Flash",c:"#f2d34c",p:"M13 2 5 13h6l-1 9 8-12h-6z"},
  ignite:{pt:"Incendiar",en:"Ignite",c:"#ff7a45",p:"M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-6 1-10z"},
  heal:{pt:"Curar",en:"Heal",c:"#5fe09a",p:"M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z"},
  barrier:{pt:"Barreira",en:"Barrier",c:"#f5b94a",p:"M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z"},
  exhaust:{pt:"Exaurir",en:"Exhaust",c:"#a899ff",p:"M6 3h12v3l-5 6 5 6v3H6v-3l5-6-5-6z"},
  tp:{pt:"Teleporte",en:"Teleport",c:"#b985ff",p:"M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"},
  smite:{pt:"Golpear",en:"Smite",c:"#ee5d45",p:"M12 2l2 7 7 1-5 5 1.5 7L12 18.5 6.5 22 8 15 3 10l7-1z"},
  cleanse:{pt:"Purificar",en:"Cleanse",c:"#68cdf5",p:"M12 2c4 5 7 8 7 12a7 7 0 0 1-14 0c0-4 3-7 7-12z"},
  ghost:{pt:"Fantasma",en:"Ghost",c:"#86d8ea",p:"M12 3a7 7 0 0 0-7 7v12l3.5-2.5L12 22l3.5-2.5L19 22V10a7 7 0 0 0-7-7zM9.5 9a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM14.5 9a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"}
};
export const SPELLKEYS = Object.keys(SP);

// Níveis de troll. O 0 usa as picks off meta dos sites (modo "off").
export const LEVELS = [
  {n:"Sério", d:"Picks off meta tiradas de sites. Build pronta e jogável."},
  {n:"Leve", d:"Campeão na rota dele e build fora do comum que ainda funciona."},
  {n:"Troll", d:"Build arriscada. Runa quase sempre combina."},
  {n:"Pesado", d:"Qualquer tema de build, Mejai incluso. Runa já pode vir torta."},
  {n:"Muito troll", d:"Campeão fora da rota, runa aleatória e às vezes build aleatória."},
  {n:"Caos", d:"Rota, itens, runas e fragmentos às cegas. Só os feitiços continuam normais."}
];

// Runas: o engine sorteia uma "receita" e o ddragon.jsx resolve nomes e ícones com os dados da Riot.
export const TREES = [8000, 8100, 8200, 8300, 8400]; // Precisão, Dominação, Feitiçaria, Inspiração, Determinação
export const KS_TREE = {
  conqueror:8000, lethaltempo:8000, pressthe:8000, fleet:8000,
  electrocute:8100, darkharvest:8100, hailofblades:8100,
  aery:8200, comet:8200, phaserush:8200,
  glacial:8300, spellbook:8300, firststrike:8300,
  grasp:8400, aftershock:8400, guardian:8400
};
const KS_FIT = {
  T:{a:["conqueror","grasp","phaserush"],p:["grasp","phaserush","comet","conqueror"],h:["grasp","aftershock","conqueror"]},
  J:{a:["conqueror","electrocute","darkharvest","lethaltempo"],p:["electrocute","darkharvest","phaserush","conqueror"],h:["aftershock","grasp","phaserush"]},
  M:{a:["electrocute","conqueror","firststrike"],p:["electrocute","comet","phaserush","darkharvest","firststrike"],h:["comet","electrocute","firststrike"]},
  A:{a:["lethaltempo","pressthe","fleet","hailofblades"],p:["comet","firststrike","phaserush"],h:["lethaltempo","pressthe","fleet"]},
  S:{a:["electrocute","hailofblades","aftershock"],p:["aery","comet","guardian","electrocute"],h:["aftershock","guardian","glacial"]}
};
export const SHARDS = [
  ["Força adaptativa","Velocidade de ataque","Aceleração de habilidade"],
  ["Força adaptativa","Velocidade de movimento","Vida por nível"],
  ["Vida","Tenacidade e resist. a lentidão","Vida por nível"]
];

export function genRunes(c, role, L, ks){
  const dmg = c ? c.d : "h";
  const sane = L <= 1 || (L <= 3 && Math.random() < (L === 2 ? 0.6 : 0.4));
  const key = ks || (L >= 4 ? null : sane ? pick(KS_FIT[role][dmg]) : pick(Object.keys(KS_TREE)));
  const rows = shuffle([1,2,3]).slice(0,2).sort();
  let shards;
  if (L >= 4) shards = [rnd(3), rnd(3), rnd(3)];
  else {
    const s1 = role === "A" && dmg !== "p" && Math.random() < 0.6 ? 1 : Math.random() < 0.2 ? 2 : 0;
    const s2 = Math.random() < 0.15 ? 1 : 0;
    const s3 = "TJS".includes(role) && Math.random() < 0.35 ? 1 : 0;
    shards = [s1, s2, s3];
  }
  return { ks:key, t:Math.random(), r:[Math.random(),Math.random(),Math.random(),Math.random()], s:Math.random(), sRows:rows, sR:[Math.random(),Math.random()], shards };
}

// core: itens fixos ("A|B" = sorteia um deles). ks: keystones que combinam com a build (chaves de KS_TREE).
export const THEMES = [
  {n:"Bruiser Ameaça",d:"Dano e vida. Ganha qualquer luta longa.",lvl:1,dmg:"ad",ks:["conqueror","grasp"],core:["Black Cleaver","Sterak's Gage"],flex:["Death's Dance","Spirit Visage","Guardian Angel","Thornmail","Sundered Sky","Eclipse"],boots:["Plated Steelcaps","Mercury's Treads"]},
  {n:"Full Letalidade",d:"Só item de letalidade. Some com o alvo antes dele reagir.",lvl:1,dmg:"ad",ks:["electrocute","darkharvest","firststrike","hailofblades"],core:["Youmuu's Ghostblade","Hubris"],flex:["Edge of Night","Serpent's Fang","Axiom Arc","Umbral Glaive","The Collector","Profane Hydra","Voltaic Cyclosword","Bastionbreaker"],boots:["Ionian Boots of Lucidity","Boots of Swiftness","Plated Steelcaps"]},
  {n:"On-Hit com PTA",d:"Ataque rápido com efeito no golpe. Pressione o Ataque e não para de bater.",lvl:1,dmg:"ad",ks:["pressthe","lethaltempo"],core:["Blade of the Ruined King","Kraken Slayer"],flex:["Guinsoo's Rageblade","Wit's End","Terminus","Runaan's Hurricane","Phantom Dancer","Guardian Angel"],boots:["Berserker's Greaves"]},
  {n:"Tanque que Queima",d:"Muita vida e dano em área só de ficar perto.",lvl:1,dmg:"any",ks:["grasp","aftershock"],core:["Sunfire Aegis","Iceborn Gauntlet"],flex:["Spirit Visage","Thornmail","Warmog's Armor","Force of Nature","Jak'Sho, The Protean","Heartsteel","Kaenic Rookern"],boots:["Plated Steelcaps","Mercury's Treads"]},
  {n:"Mago Gordão",d:"AP com vida. Aguenta o all-in e devolve.",lvl:1,dmg:"ap",ks:["grasp","phaserush","comet"],core:["Rod of Ages","Liandry's Torment"],flex:["Riftmaker","Warmog's Armor","Zhonya's Hourglass","Spirit Visage","Cryptbloom","Rylai's Crystal Scepter"],boots:["Sorcerer's Shoes","Mercury's Treads"]},
  {n:"Hydra e Cura",d:"Uma Hydra (só dá pra ter uma) e vida pra lutar sem parar.",lvl:1,dmg:"ad",ks:["conqueror"],core:["Ravenous Hydra|Titanic Hydra|Profane Hydra","Sterak's Gage"],flex:["Death's Dance","Spirit Visage","Black Cleaver","Sundered Sky","Guardian Angel","Thornmail"],boots:["Plated Steelcaps","Boots of Swiftness"]},
  {n:"Crit pra Todo Lado",d:"Crítico em qualquer campeão, sirva ou não.",lvl:1,dmg:"ad",ks:["lethaltempo","pressthe","fleet"],core:["Infinity Edge","Navori Flickerblade"],flex:["Phantom Dancer","Rapid Firecannon","Lord Dominik's Regards","Bloodthirster","Mortal Reminder","Immortal Shieldbow","Runaan's Hurricane"],boots:["Berserker's Greaves"]},
  {n:"Fura-Tank AD",d:"Penetração de armadura desde o primeiro recall.",lvl:1,dmg:"ad",ks:["conqueror","lethaltempo"],core:["Lord Dominik's Regards|Serylda's Grudge","Black Cleaver"],flex:["Terminus","Sundered Sky","Hullbreaker","Death's Dance","Sterak's Gage"],boots:["Berserker's Greaves","Plated Steelcaps"]},
  {n:"Fura-Tank AP",d:"Penetração mágica contra time tanque.",lvl:1,dmg:"ap",ks:["comet","electrocute","darkharvest"],core:["Void Staff|Cryptbloom","Liandry's Torment"],flex:["Malignance","Rabadon's Deathcap","Zhonya's Hourglass","Shadowflame","Rylai's Crystal Scepter"],boots:["Sorcerer's Shoes"]},
  {n:"Sanguessuga",d:"Roubo de vida em tudo.",lvl:2,dmg:"ad",ks:["conqueror","lethaltempo"],core:["Bloodthirster","Blade of the Ruined King"],flex:["Ravenous Hydra","Sundered Sky","Spirit Visage","Death's Dance","Guardian Angel"],boots:["Plated Steelcaps","Berserker's Greaves"]},
  {n:"On-Hit pra Todo Mundo",d:"Auto-ataque com efeito em qualquer campeão, até mago.",lvl:2,dmg:"any",ks:["pressthe","lethaltempo"],core:["Nashor's Tooth","Wit's End"],flex:["Blade of the Ruined King","Kraken Slayer","Terminus","Guinsoo's Rageblade","Rabadon's Deathcap","Runaan's Hurricane"],boots:["Berserker's Greaves","Mercury's Treads"]},
  {n:"Item de Suporte no Carry",d:"Escudo, cura e aura em quem não é suporte.",lvl:2,dmg:"any",ks:["aery","guardian","glacial"],core:["Moonstone Renewer","Ardent Censer"],flex:["Staff of Flowing Water","Redemption","Mikael's Blessing","Shurelya's Battlesong","Imperial Mandate","Locket of the Iron Solari","Zeke's Convergence"],boots:["Ionian Boots of Lucidity","Mercury's Treads"]},
  {n:"Muralha de Gelo",d:"Lentidão no ataque inimigo e em área.",lvl:2,dmg:"any",ks:["aftershock","glacial","grasp"],core:["Frozen Heart","Randuin's Omen"],flex:["Sunfire Aegis","Abyssal Mask","Hollow Radiance","Zeke's Convergence","Kaenic Rookern","Winter's Approach"],boots:["Plated Steelcaps","Ionian Boots of Lucidity"]},
  {n:"Rei do Espinho",d:"Quem bate em você se machuca. Bom contra time AD.",lvl:2,dmg:"any",ks:["grasp","aftershock"],core:["Thornmail","Randuin's Omen"],flex:["Sunfire Aegis","Frozen Heart","Dead Man's Plate","Spirit Visage","Warmog's Armor","Gargoyle Stoneplate"],boots:["Plated Steelcaps"]},
  {n:"AD com Lich Bane",d:"Habilidade, auto-ataque, explode. Em campeão AD.",lvl:2,dmg:"ad",ks:["electrocute","conqueror"],core:["Lich Bane","Black Cleaver"],flex:["Sterak's Gage","Spirit Visage","Sunfire Aegis","Hullbreaker","Guardian Angel","Death's Dance"],boots:["Mercury's Treads","Boots of Swiftness"]},
  {n:"Mejai Cinema",d:"Mejai no primeiro recall. Morreu, perdeu os acúmulos.",lvl:3,dmg:"ap",ks:["electrocute","darkharvest","comet"],core:["Mejai's Soulstealer","Zhonya's Hourglass","Rabadon's Deathcap"],flex:["Banshee's Veil","Void Staff","Archangel's Staff","Shadowflame"],boots:["Sorcerer's Shoes"]}
];

// Itens que não podem estar juntos na mesma build (passiva única ou restrição do jogo).
export const EXCL = [
  ["Trinity Force","Essence Reaver","Lich Bane","Iceborn Gauntlet","Bloodsong"],   // Lâmina Encantada
  ["Ravenous Hydra","Titanic Hydra","Profane Hydra","Stridebreaker"],               // Clivar (Hydras)
  ["Immortal Shieldbow","Bloodthirster","Sterak's Gage","Maw of Malmortius"],       // escudos (Linha da Vida)
  ["Lord Dominik's Regards","Mortal Reminder","Serylda's Grudge"],                  // Último Sussurro
  ["Mortal Reminder","Morellonomicon"],                                              // Feridas Dolorosas
  ["Edge of Night","Banshee's Veil"],                                                // Anular
  ["Sunfire Aegis","Hollow Radiance"],                                               // Imolação
  ["Void Staff","Cryptbloom"],                                                       // Joia Arruinadora
  ["Manamune","Archangel's Staff","Winter's Approach"]                               // Lágrima
];
export function clash(items, n){
  return EXCL.some(g => g.includes(n) && items.some(x => x !== n && g.includes(x)));
}
export function buildProblems(items){
  const out = [];
  EXCL.forEach(g => { const hit = items.filter(x => g.includes(x)); if (hit.length > 1) out.push(hit.join(" + ")); });
  if (items.filter(x => ITEMCAT[x] === "bt").length !== 1) out.push("bota");
  if (new Set(items).size !== items.length) out.push("item repetido");
  if (items.length !== 6) out.push("tamanho " + items.length);
  return out;
}
// Monta a build sem repetir item e sem juntar itens que não acumulam.
function assemble(list, boots){
  const body = [];
  for (const n of list){ if (body.length >= 5) break; if (!body.includes(n) && !clash(body, n)) body.push(n); }
  body.splice(1, 0, boots);
  return body;
}

export const OFF = [
  {champ:"Ivern",role:"T",src:"Sportskeeda",url:"https://www.sportskeeda.com/esports/top-5-off-meta-picks-builds-exploit-league-legends-season-11",ks:"aery",title:"Ivern Top Curandeiro",note:"Escudo e cura pro trio inteiro. Runa da fonte: Invocar Aery.",items:["Ionian Boots of Lucidity","Moonstone Renewer","Staff of Flowing Water","Redemption","Mikael's Blessing","Zeke's Convergence"],spells:["flash","tp"]},
  {champ:"Ivern",role:"J",src:"High Ground Gaming",url:"https://www.highgroundgaming.com/?p=43449",title:"Ivern Selva Jardineiro",note:"Pick rara na selva, com taxa de vitória acima de 51% nos dados citados pela fonte.",items:["Ionian Boots of Lucidity","Moonstone Renewer","Staff of Flowing Water","Redemption","Mikael's Blessing","Locket of the Iron Solari"],spells:["smite","flash"]},
  {champ:"Udyr",role:"J",src:"Sportskeeda",url:"https://www.sportskeeda.com/esports/top-5-off-meta-picks-builds-exploit-league-legends-season-11",ks:"phaserush",title:"Udyr Tanque Fugitivo",note:"Selva de tanque com velocidade e resistência. Runa da fonte: Avanço da Tempestade.",items:["Mercury's Treads","Sunfire Aegis","Force of Nature","Dead Man's Plate","Thornmail","Spirit Visage"],spells:["smite","flash"]},
  {champ:"Viego",role:"M",src:"Sportskeeda",url:"https://www.sportskeeda.com/esports/top-5-off-meta-picks-builds-exploit-league-legends-season-11",ks:"conqueror",title:"Viego Meio Possessivo",note:"Viego no meio com build de duelista. Runa da fonte: Conquistador.",items:["Berserker's Greaves","Blade of the Ruined King","Sundered Sky","Sterak's Gage","The Collector","Guardian Angel"],spells:["flash","ignite"]},
  {champ:"Yasuo",role:"A",src:"Sportskeeda",url:"https://www.sportskeeda.com/esports/top-5-off-meta-picks-builds-exploit-league-legends-season-11",ks:"conqueror",title:"Yasuo ADC Ventania",note:"Precisa de suporte que levanta inimigo (Alistar, Malphite, Rakan). Runa da fonte: Conquistador.",items:["Berserker's Greaves","Immortal Shieldbow","Infinity Edge","Phantom Dancer","Mortal Reminder","Guardian Angel"],spells:["flash","heal"]},
  {champ:"Poppy",role:"S",src:"Sportskeeda",url:"https://www.sportskeeda.com/esports/top-5-off-meta-picks-builds-exploit-league-legends-season-11",ks:"aftershock",title:"Poppy Suporte Muralha",note:"Segura o ADC inimigo longe e protege o seu. Runa da fonte: Pós-choque.",items:["Plated Steelcaps","Locket of the Iron Solari","Knight's Vow","Dead Man's Plate","Thornmail","Randuin's Omen"],spells:["flash","exhaust"]},
  {champ:"Malzahar",role:"S",src:"High Ground Gaming",url:"https://www.highgroundgaming.com/best-off-meta-supports-in-lol/",title:"Malzahar Suporte Void",note:"Vermes limpam a wave e a ult segura o alvo pra o trio matar.",items:["Ionian Boots of Lucidity","Liandry's Torment","Cosmic Drive","Zhonya's Hourglass","Morellonomicon","Rabadon's Deathcap"],spells:["flash","ignite"]},
  {champ:"Sion",role:"S",src:"High Ground Gaming",url:"https://www.highgroundgaming.com/best-off-meta-supports-in-lol/",title:"Sion Suporte Engage",note:"Q carregado em luta vira engage. Tanque que não cai.",items:["Mercury's Treads","Sunfire Aegis","Warmog's Armor","Spirit Visage","Thornmail","Randuin's Omen"],spells:["flash","ignite"]},
  {champ:"Pantheon",role:"S",src:"High Ground Gaming",url:"https://www.highgroundgaming.com/best-off-meta-supports-in-lol/",title:"Pantheon Suporte Lança",note:"Stun cedo, rotação rápida e dano de sobra. Precisa de mão.",items:["Ionian Boots of Lucidity","Sundered Sky","Black Cleaver","Sterak's Gage","Death's Dance","Guardian Angel"],spells:["flash","ignite"]},
  {champ:"Annie",role:"S",src:"High Ground Gaming",url:"https://www.highgroundgaming.com/best-off-meta-supports-in-lol/",title:"Annie Suporte Stun",note:"Stun pronto vira engage, mas é frágil. Jogue colado no ADC.",items:["Sorcerer's Shoes","Luden's Echo","Shadowflame","Zhonya's Hourglass","Rabadon's Deathcap","Void Staff"],spells:["flash","ignite"]},
  {champ:"Draven",role:"A",src:"High Ground Gaming",url:"https://www.highgroundgaming.com/best-off-meta-adcs-in-lol/",title:"Draven Show do Bronze",note:"A fonte cita Dravens 20-0 comuns no Bronze e na Prata.",items:["Berserker's Greaves","Infinity Edge","Bloodthirster","Phantom Dancer","Lord Dominik's Regards","Guardian Angel"],spells:["flash","heal"]},
  {champ:"Kalista",role:"A",src:"High Ground Gaming",url:"https://www.highgroundgaming.com/best-off-meta-adc-in-lol/",title:"Kalista Pula-Pula",note:"Mecanicamente difícil, mas rende muito com suporte de engage (Rell, Thresh).",items:["Berserker's Greaves","Blade of the Ruined King","Kraken Slayer","Runaan's Hurricane","Infinity Edge","Guardian Angel"],spells:["flash","heal"]},
  {champ:"Brand",role:"A",src:"NerfPlz",url:"https://www.nerfplz.com/2026/09/weird-pick-168-bot-lane-brand.html",title:"Brand Bot Lane em Chamas",note:"Pick estranha da fonte, boa com suporte que protege. Dano em área contínuo.",items:["Sorcerer's Shoes","Luden's Echo","Shadowflame","Zhonya's Hourglass","Rabadon's Deathcap","Void Staff"],spells:["flash","ignite"]},
  {champ:"Neeko",role:"A",src:"High Ground Gaming",url:"https://www.highgroundgaming.com/best-off-meta-supports-in-lol/",title:"Neeko ADC Camaleoa",note:"Maximize o dano sem roubar todo kill do time. Disfarce e stun em área.",items:["Sorcerer's Shoes","Luden's Echo","Shadowflame","Zhonya's Hourglass","Rabadon's Deathcap","Void Staff"],spells:["flash","ignite"]},
  {champ:"Mordekaiser",role:"M",src:"Dot Esports",url:"https://dotesports.com/?p=842572",title:"Morde Meio do Bronze",note:"A fonte mostra 53,78% de vitórias no meio entre jogadores de Bronze (patch 13.7).",items:["Sorcerer's Shoes","Liandry's Torment","Riftmaker","Rod of Ages","Zhonya's Hourglass","Void Staff"],spells:["flash","ignite"]},
  {champ:"Mordekaiser",role:"J",src:"Dot Esports",url:"https://dotesports.com/?p=842572",title:"Morde Selva Sombria",note:"A fonte mostra 53,05% de vitórias na selva entre jogadores de Bronze (patch 13.7).",items:["Sorcerer's Shoes","Liandry's Torment","Riftmaker","Rod of Ages","Zhonya's Hourglass","Void Staff"],spells:["smite","flash"]},
  {champ:"Sett",role:"M",src:"Dignitas",url:"https://dignitas.gg/articles/try-these-champion-picks-to-make-your-league-game-more-interesting",title:"Sett Meio Cheese",note:"Troca de dano que ninguém espera no meio. Ótimo pra pegar o inimigo de surpresa.",items:["Plated Steelcaps","Trinity Force","Black Cleaver","Sterak's Gage","Death's Dance","Guardian Angel"],spells:["flash","ignite"]},
  {champ:"Lucian",role:"T",src:"Dignitas",url:"https://dignitas.gg/articles/try-these-champion-picks-to-make-your-league-game-more-interesting",title:"Lucian Topo Metralha",note:"Lucian no topo pega muita gente de surpresa. Dano de trade alto no começo.",items:["Berserker's Greaves","Trinity Force","Navori Flickerblade","Infinity Edge","Lord Dominik's Regards","Bloodthirster"],spells:["flash","tp"]},
  {champ:"Taric",role:"T",src:"Red Bull",url:"https://redbull.com/ca-en/off-meta-builds-picks-league-of-legends",title:"Taric Topo Brilhante",note:"Suporte jogando no topo: tankão com stun e cura. Troll e jogável.",items:["Plated Steelcaps","Sunfire Aegis","Locket of the Iron Solari","Thornmail","Randuin's Omen","Spirit Visage"],spells:["flash","tp"]},
  {champ:"Shyvana",role:"J",src:"MobaFire",url:"https://www.mobafire.com/league-of-legends/build/troll-builds-just-4-fun-mostly-viable-229063",title:"Shyvana Lich Bane",note:"Guia troll da fonte: o Lich Bane combina com o golpe da Shyvana. Item pode ter mudado.",items:["Mercury's Treads","Lich Bane","Sunfire Aegis","Black Cleaver","Sterak's Gage","Thornmail"],spells:["smite","flash"]}
];

// lvl = nível de troll mínimo pra o desafio aparecer
export const CHALLENGES = [
  {t:"Primeiro a morrer paga o lanche.",lvl:0},
  {t:"Antes da partida, cada um fala a build em voz alta. Errou um item, paga prenda.",lvl:0},
  {t:"Dragão nascendo: os três vão juntos, sempre.",lvl:0},
  {t:"Xingou no chat, perde um ponto. Quem terminar com mais pontos é o MVP.",lvl:0},
  {t:"Barão só com os três vivos.",lvl:0},
  {t:"Ward antes de cada recall. Esqueceu, compra Sentinela de Controle pro trio.",lvl:0},
  {t:"Quem fizer o primeiro abate escolhe a música da próxima.",lvl:0},
  {t:"No nível 6, combo de ult dos três juntos pelo menos uma vez.",lvl:1},
  {t:"Perdeu a primeira torre, o trio troca de lane.",lvl:1},
  {t:"Recall só junto. Um volta pra base, os três voltam.",lvl:2},
  {t:"Flash só pra entrar na luta, nunca pra fugir.",lvl:2},
  {t:"Ninguém compra a bota antes do segundo item.",lvl:4},
  {t:"Toda luta começa com os três dando ping de ataque no mesmo alvo.",lvl:4},
  {t:"Ninguém pode voltar pra base antes de morrer pela primeira vez.",lvl:5}
];

export const rnd = n => Math.floor(Math.random()*n);
export const pick = a => a[rnd(a.length)];
export function wpick(pairs){
  let t = pairs.reduce((s,p)=>s+p[1],0), r = Math.random()*t;
  for (const p of pairs){ r -= p[1]; if (r < 0) return p[0]; }
  return pairs[0][0];
}
export function shuffle(a){ a = a.slice(); for (let i=a.length-1;i>0;i--){ const j=rnd(i+1); const t=a[i]; a[i]=a[j]; a[j]=t; } return a; }

export const S = { mode:"troll", level:2, distinct:true, loose:false, challenge:"" };

export function genSkill(){ return shuffle(["Q","W","E"]).join(" > "); }

export function chaosBuild(){
  const items = assemble(shuffle(NONBOOT), pick(POOL.bt));
  return { items, theme:{ n:"Caos Total", d:"Cinco itens aleatórios e uma bota." }, ks:null };
}

export function genBuild(c){
  const L = S.level;
  if (Math.random() < ({4:0.35, 5:0.75}[L] || 0)) return chaosBuild();
  let ok = THEMES.filter(t => t.lvl <= L && (t.dmg==="any" || (t.dmg==="ad" && c.d!=="p") || (t.dmg==="ap" && c.d!=="a")));
  if (!ok.length) ok = THEMES.filter(t => t.dmg==="any");
  const t = wpick(ok.map(x => [x, x.lvl===Math.min(L,3) ? 3 : 1]));
  const core = t.core.map(x => pick(x.split("|")));
  const items = assemble(core.concat(shuffle(t.flex)), pick(t.boots));
  return { items, theme:{ n:t.n, d:t.d }, ks:t.ks || null };
}

// Feitiços nunca trollam: Flash + o segundo que faz sentido pra rota, em qualquer nível.
export function genSpells(role){
  if (role === "J") return ["smite", Math.random()<0.88 ? "flash" : "ghost"];
  const base = {
    T:[["tp",5],["ignite",3],["ghost",2],["barrier",1],["cleanse",1]],
    M:[["ignite",4],["tp",3],["barrier",1],["cleanse",1],["ghost",1]],
    A:[["heal",5],["barrier",2],["cleanse",2],["ignite",2],["exhaust",1]],
    S:[["exhaust",4],["ignite",4],["heal",2],["barrier",1],["cleanse",1]]
  };
  return ["flash", wpick(base[role])];
}

// pool: Set com os campeões do jogador (ou null = todos). Se o pool não tiver ninguém pra rota, ignora a rota;
// se nem assim sobrar ninguém, usa a lista inteira.
export function genTroll(role, used, pool){
  const L = S.level;
  const loose = L >= 4 || S.loose;
  const base = pool ? CH.filter(c => pool.has(c.n)) : CH;
  let cands = base.filter(c => (loose || c.r.indexOf(role) >= 0) && !used.has(c.n));
  if (!cands.length) cands = base.filter(c => !used.has(c.n));
  if (!cands.length) cands = CH.filter(c => !used.has(c.n));
  const c = pick(cands);
  const b = genBuild(c);
  return { champ:c.n, role:role, dmg:c.d, items:b.items, theme:b.theme, spells:genSpells(role), runes:genRunes(c, role, L, themeKs(b, L)), ks:b.ks, skill:genSkill(), troll:L, off:false };
}

export function genOff(role, used, pool){
  const own = pool ? OFF.filter(e => pool.has(e.champ)) : OFF;
  let c = own.filter(e => e.role === role && !used.has(e.champ));
  if (!c.length) c = own.filter(e => !used.has(e.champ));
  if (!c.length) c = OFF.filter(e => e.role === role && !used.has(e.champ));
  if (!c.length) c = OFF.filter(e => !used.has(e.champ));
  const e = pick(c);
  const ch = CHBY[e.champ];
  return { champ:e.champ, role:e.role, dmg:ch ? ch.d : "h", items:e.items, theme:{ n:e.title, d:e.note }, spells:e.spells, runes:genRunes(ch, e.role, 0, e.ks), skill:"", src:e.src, url:e.url, troll:0, off:true };
}

export function gen(role, used, pool){ return S.mode === "off" ? genOff(role, used, pool) : genTroll(role, used, pool); }
// Keystone da build: sempre nos níveis 0-1, 70% no 2, 50% no 3, nunca no 4-5.
export function themeKs(b, L){
  if (!b.ks || L >= 4 || (L === 2 && Math.random() < 0.3) || (L === 3 && Math.random() < 0.5)) return undefined;
  return pick(b.ks);
}
export function regenBuild(res){
  const c = CHBY[res.champ];
  const b = genBuild(c);
  res.items = b.items; res.theme = b.theme; res.skill = genSkill(); res.troll = S.level;
  res.runes = genRunes(c, res.role, S.level, themeKs(b, S.level)); res.ks = b.ks;
}
