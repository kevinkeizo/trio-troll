
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
  ad:["Trinity Force","Infinity Edge","Black Cleaver","Sundered Sky","Eclipse","Ravenous Hydra","Titanic Hydra","Profane Hydra","Stridebreaker","Death's Dance","Maw of Malmortius","Mortal Reminder","Lord Dominik's Regards","Bloodthirster","Phantom Dancer","Rapid Firecannon","Statikk Shiv","Kraken Slayer","Blade of the Ruined King","Guinsoo's Rageblade","Navori Flickerblade","Essence Reaver","Serylda's Grudge","Youmuu's Ghostblade","Spear of Shojin","Hullbreaker","Edge of Night","Immortal Shieldbow","Experimental Hexplate","Terminus","Sterak's Gage","Guardian Angel","The Collector","Runaan's Hurricane","Voltaic Cyclosword","Muramana"],
  ap:["Rabadon's Deathcap","Void Staff","Shadowflame","Zhonya's Hourglass","Lich Bane","Luden's Companion","Liandry's Torment","Rod of Ages","Morellonomicon","Cosmic Drive","Horizon Focus","Riftmaker","Demonic Embrace","Banshee's Veil","Nashor's Tooth","Stormsurge","Seraph's Embrace","Hextech Rocketbelt","Archangel's Staff","Cryptbloom","Malignance","Rylai's Crystal Scepter","Mejai's Soulstealer","Wit's End","Blackfire Torch"],
  tk:["Sunfire Aegis","Thornmail","Randuin's Omen","Warmog's Armor","Spirit Visage","Force of Nature","Jak'Sho, The Protean","Frozen Heart","Dead Man's Plate","Gargoyle Stoneplate","Abyssal Mask","Kaenic Rookern","Hollow Radiance","Iceborn Gauntlet","Heartsteel","Fimbulwinter","Unending Despair","Knight's Vow","Zeke's Convergence","Locket of the Iron Solari"],
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

export const THEMES = [
  {n:"Bruiser Ameaça",d:"Dano e vida juntos. Bate, aguenta e não morre na luta longa.",lvl:1,dmg:"ad",core:["Black Cleaver","Sterak's Gage"],flex:["Death's Dance","Maw of Malmortius","Spirit Visage","Guardian Angel","Thornmail","Sundered Sky","Eclipse"],boots:["Plated Steelcaps","Mercury's Treads"]},
  {n:"Tanque que Queima",d:"Parede de vida que ainda causa dano em área. Ninguém entende como você morre tão pouco.",lvl:1,dmg:"any",core:["Sunfire Aegis","Iceborn Gauntlet"],flex:["Spirit Visage","Thornmail","Warmog's Armor","Force of Nature","Jak'Sho, The Protean","Heartsteel","Kaenic Rookern"],boots:["Plated Steelcaps","Mercury's Treads"]},
  {n:"Mago Gordão",d:"AP com muita vida. Aguenta o all-in e ainda devolve o dano.",lvl:1,dmg:"ap",core:["Rod of Ages","Liandry's Torment"],flex:["Riftmaker","Warmog's Armor","Demonic Embrace","Zhonya's Hourglass","Spirit Visage","Cryptbloom"],boots:["Sorcerer's Shoes","Mercury's Treads"]},
  {n:"Fã de Hydra",d:"Só Hydra e cura. Limpa a wave inteira em um golpe.",lvl:1,dmg:"ad",core:["Ravenous Hydra","Titanic Hydra"],flex:["Sterak's Gage","Death's Dance","Stridebreaker","Black Cleaver","Maw of Malmortius","Guardian Angel"],boots:["Plated Steelcaps","Boots of Swiftness"]},
  {n:"Crit pra Todo Lado",d:"Crítico em tudo, até em quem não devia. Dano absurdo se o alvo ficar parado.",lvl:1,dmg:"ad",core:["Infinity Edge","Navori Flickerblade"],flex:["Phantom Dancer","Rapid Firecannon","Lord Dominik's Regards","Bloodthirster","Mortal Reminder","Immortal Shieldbow"],boots:["Berserker's Greaves"]},
  {n:"Fura-Tank AD",d:"Item contra tanque desde o primeiro recall. O time inimigo vai ficar sem armadura.",lvl:1,dmg:"ad",core:["Lord Dominik's Regards","Serylda's Grudge"],flex:["Black Cleaver","Mortal Reminder","Terminus","Sundered Sky","Hullbreaker"],boots:["Berserker's Greaves","Plated Steelcaps"]},
  {n:"Fura-Tank AP",d:"Penetração mágica pra derreter time cheio de resistência.",lvl:1,dmg:"ap",core:["Void Staff","Liandry's Torment"],flex:["Cryptbloom","Malignance","Rabadon's Deathcap","Zhonya's Hourglass","Shadowflame","Rylai's Crystal Scepter"],boots:["Sorcerer's Shoes"]},
  {n:"Sanguessuga",d:"Lifesteal de cima a baixo. Quanto mais bate, mais vive.",lvl:2,dmg:"ad",core:["Bloodthirster","Immortal Shieldbow"],flex:["Death's Dance","Sterak's Gage","Maw of Malmortius","Edge of Night","Hullbreaker","Spirit Visage"],boots:["Plated Steelcaps","Berserker's Greaves"]},
  {n:"On-Hit pra Todo Mundo",d:"Qualquer campeão vira auto-ataque com efeito. Surpresa total no meio da luta.",lvl:2,dmg:"any",core:["Nashor's Tooth","Wit's End"],flex:["Blade of the Ruined King","Kraken Slayer","Terminus","Guinsoo's Rageblade","Rabadon's Deathcap","Runaan's Hurricane"],boots:["Berserker's Greaves","Mercury's Treads"]},
  {n:"Item de Suporte no Carry",d:"Escudo, cura e aura em quem não é suporte. O time inteiro agradece.",lvl:2,dmg:"any",core:["Moonstone Renewer","Ardent Censer"],flex:["Staff of Flowing Water","Redemption","Mikael's Blessing","Shurelya's Battlesong","Imperial Mandate","Locket of the Iron Solari","Zeke's Convergence"],boots:["Ionian Boots of Lucidity","Mercury's Treads"]},
  {n:"Muralha de Gelo",d:"Frozen Heart e amigos. Ataque inimigo vira cócega e a lane inteira fica lenta.",lvl:2,dmg:"any",core:["Frozen Heart","Randuin's Omen"],flex:["Sunfire Aegis","Abyssal Mask","Hollow Radiance","Zeke's Convergence","Kaenic Rookern","Fimbulwinter"],boots:["Plated Steelcaps","Ionian Boots of Lucidity"]},
  {n:"Rei do Espinho",d:"Quanto mais batem em você, mais dói neles. Perfeito contra time de AD.",lvl:2,dmg:"any",core:["Thornmail","Randuin's Omen"],flex:["Sunfire Aegis","Frozen Heart","Dead Man's Plate","Spirit Visage","Warmog's Armor","Gargoyle Stoneplate"],boots:["Plated Steelcaps"]},
  {n:"AD com Lich Bane",d:"Golpe depois da habilidade em campeão AD. Combo curto que dói de verdade.",lvl:2,dmg:"ad",core:["Lich Bane","Trinity Force"],flex:["Black Cleaver","Sterak's Gage","Spirit Visage","Sunfire Aegis","Hullbreaker","Guardian Angel"],boots:["Mercury's Treads","Boots of Swiftness"]},
  {n:"Mejai Cinema",d:"Mejai logo no primeiro recall. Se snowballar, ninguém para. Se morrer, vira meme. Regra do grupo: sem culpa.",lvl:3,dmg:"ap",core:["Mejai's Soulstealer","Zhonya's Hourglass","Rabadon's Deathcap"],flex:["Banshee's Veil","Void Staff","Seraph's Embrace","Shadowflame"],boots:["Sorcerer's Shoes"]}
];

export const OFF = [
  {champ:"Ivern",role:"T",src:"Sportskeeda",url:"https://www.sportskeeda.com/esports/top-5-off-meta-picks-builds-exploit-league-legends-season-11",title:"Ivern Top Curandeiro",note:"Tanque que dá escudo e cura pro trio inteiro. Runas da fonte: Summon Aery e Transcendence.",items:["Ionian Boots of Lucidity","Moonstone Renewer","Staff of Flowing Water","Redemption","Mikael's Blessing","Zeke's Convergence"],spells:["flash","tp"]},
  {champ:"Ivern",role:"J",src:"High Ground Gaming",url:"https://www.highgroundgaming.com/?p=43449",title:"Ivern Selva Jardineiro",note:"Pick rara na selva, com taxa de vitória acima de 51% nos dados citados pela fonte.",items:["Ionian Boots of Lucidity","Moonstone Renewer","Staff of Flowing Water","Redemption","Mikael's Blessing","Locket of the Iron Solari"],spells:["smite","flash"]},
  {champ:"Udyr",role:"J",src:"Sportskeeda",url:"https://www.sportskeeda.com/esports/top-5-off-meta-picks-builds-exploit-league-legends-season-11",title:"Udyr Tanque Fugitivo",note:"Selva de tanque com velocidade e resistência. Runa da fonte: Phase Rush.",items:["Mercury's Treads","Sunfire Aegis","Force of Nature","Dead Man's Plate","Thornmail","Spirit Visage"],spells:["smite","flash"]},
  {champ:"Viego",role:"M",src:"Sportskeeda",url:"https://www.sportskeeda.com/esports/top-5-off-meta-picks-builds-exploit-league-legends-season-11",title:"Viego Meio Possessivo",note:"Viego no meio com build de duelista. Runa da fonte: Conqueror.",items:["Berserker's Greaves","Blade of the Ruined King","Sundered Sky","Sterak's Gage","The Collector","Guardian Angel"],spells:["flash","ignite"]},
  {champ:"Yasuo",role:"A",src:"Sportskeeda",url:"https://www.sportskeeda.com/esports/top-5-off-meta-picks-builds-exploit-league-legends-season-11",title:"Yasuo ADC Ventania",note:"Precisa de suporte que levanta inimigo (Alistar, Malphite, Rakan). Runa da fonte: Conqueror.",items:["Berserker's Greaves","Immortal Shieldbow","Infinity Edge","Phantom Dancer","Mortal Reminder","Guardian Angel"],spells:["flash","heal"]},
  {champ:"Poppy",role:"S",src:"Sportskeeda",url:"https://www.sportskeeda.com/esports/top-5-off-meta-picks-builds-exploit-league-legends-season-11",title:"Poppy Suporte Muralha",note:"Segura o ADC inimigo longe e protege o seu. Runa da fonte: Aftershock.",items:["Plated Steelcaps","Locket of the Iron Solari","Knight's Vow","Dead Man's Plate","Thornmail","Randuin's Omen"],spells:["flash","exhaust"]},
  {champ:"Malzahar",role:"S",src:"High Ground Gaming",url:"https://www.highgroundgaming.com/best-off-meta-supports-in-lol/",title:"Malzahar Suporte Void",note:"Vermes limpam a wave e a ult segura o alvo pra o trio matar.",items:["Ionian Boots of Lucidity","Liandry's Torment","Cosmic Drive","Zhonya's Hourglass","Morellonomicon","Rabadon's Deathcap"],spells:["flash","ignite"]},
  {champ:"Sion",role:"S",src:"High Ground Gaming",url:"https://www.highgroundgaming.com/best-off-meta-supports-in-lol/",title:"Sion Suporte Engage",note:"Q carregado em luta vira engage. Tanque que não cai.",items:["Mercury's Treads","Sunfire Aegis","Warmog's Armor","Spirit Visage","Thornmail","Randuin's Omen"],spells:["flash","ignite"]},
  {champ:"Pantheon",role:"S",src:"High Ground Gaming",url:"https://www.highgroundgaming.com/best-off-meta-supports-in-lol/",title:"Pantheon Suporte Lança",note:"Stun cedo, rotação rápida e dano de sobra. Precisa de mão.",items:["Ionian Boots of Lucidity","Sundered Sky","Black Cleaver","Sterak's Gage","Death's Dance","Guardian Angel"],spells:["flash","ignite"]},
  {champ:"Annie",role:"S",src:"High Ground Gaming",url:"https://www.highgroundgaming.com/best-off-meta-supports-in-lol/",title:"Annie Suporte Stun",note:"Stun pronto vira engage, mas é frágil. Jogue colado no ADC.",items:["Sorcerer's Shoes","Luden's Companion","Shadowflame","Zhonya's Hourglass","Rabadon's Deathcap","Void Staff"],spells:["flash","ignite"]},
  {champ:"Draven",role:"A",src:"High Ground Gaming",url:"https://www.highgroundgaming.com/best-off-meta-adcs-in-lol/",title:"Draven Show do Bronze",note:"A fonte cita Dravens 20-0 comuns no Bronze e Prata. Machado no chão, kill no bolso.",items:["Berserker's Greaves","Infinity Edge","Bloodthirster","Phantom Dancer","Lord Dominik's Regards","Immortal Shieldbow"],spells:["flash","heal"]},
  {champ:"Kalista",role:"A",src:"High Ground Gaming",url:"https://www.highgroundgaming.com/best-off-meta-adc-in-lol/",title:"Kalista Pula-Pula",note:"Mecanicamente difícil, mas rende muito com suporte de engage (Rell, Thresh).",items:["Berserker's Greaves","Blade of the Ruined King","Kraken Slayer","Runaan's Hurricane","Infinity Edge","Guardian Angel"],spells:["flash","heal"]},
  {champ:"Brand",role:"A",src:"NerfPlz",url:"https://www.nerfplz.com/2026/09/weird-pick-168-bot-lane-brand.html",title:"Brand Bot Lane em Chamas",note:"Pick estranha da fonte, boa com suporte que protege. Dano em área contínuo.",items:["Sorcerer's Shoes","Luden's Companion","Shadowflame","Zhonya's Hourglass","Rabadon's Deathcap","Void Staff"],spells:["flash","ignite"]},
  {champ:"Neeko",role:"A",src:"High Ground Gaming",url:"https://www.highgroundgaming.com/best-off-meta-supports-in-lol/",title:"Neeko ADC Camaleoa",note:"Maximize o dano sem roubar todo kill do time. Disfarce e stun em área.",items:["Sorcerer's Shoes","Luden's Companion","Shadowflame","Zhonya's Hourglass","Rabadon's Deathcap","Void Staff"],spells:["flash","ignite"]},
  {champ:"Mordekaiser",role:"M",src:"Dot Esports",url:"https://dotesports.com/?p=842572",title:"Morde Meio do Bronze",note:"A fonte mostra 53,78% de vitórias no meio entre jogadores de Bronze (patch 13.7).",items:["Sorcerer's Shoes","Liandry's Torment","Riftmaker","Rod of Ages","Zhonya's Hourglass","Void Staff"],spells:["flash","ignite"]},
  {champ:"Mordekaiser",role:"J",src:"Dot Esports",url:"https://dotesports.com/?p=842572",title:"Morde Selva Sombria",note:"A fonte mostra 53,05% de vitórias na selva entre jogadores de Bronze (patch 13.7).",items:["Sorcerer's Shoes","Liandry's Torment","Riftmaker","Rod of Ages","Zhonya's Hourglass","Void Staff"],spells:["smite","flash"]},
  {champ:"Sett",role:"M",src:"Dignitas",url:"https://dignitas.gg/articles/try-these-champion-picks-to-make-your-league-game-more-interesting",title:"Sett Meio Cheese",note:"Troca de dano que ninguém espera no meio. Ótimo pra pegar o inimigo de surpresa.",items:["Plated Steelcaps","Trinity Force","Black Cleaver","Sterak's Gage","Death's Dance","Guardian Angel"],spells:["flash","ignite"]},
  {champ:"Lucian",role:"T",src:"Dignitas",url:"https://dignitas.gg/articles/try-these-champion-picks-to-make-your-league-game-more-interesting",title:"Lucian Topo Metralha",note:"Lucian no topo pega muita gente de surpresa. Dano de trade alto no começo.",items:["Berserker's Greaves","Trinity Force","Essence Reaver","Infinity Edge","Lord Dominik's Regards","Bloodthirster"],spells:["flash","tp"]},
  {champ:"Taric",role:"T",src:"Red Bull",url:"https://redbull.com/ca-en/off-meta-builds-picks-league-of-legends",title:"Taric Topo Brilhante",note:"Suporte jogando no topo: tankão com stun e cura. Troll e jogável.",items:["Plated Steelcaps","Sunfire Aegis","Locket of the Iron Solari","Thornmail","Randuin's Omen","Spirit Visage"],spells:["flash","tp"]},
  {champ:"Shyvana",role:"J",src:"MobaFire",url:"https://www.mobafire.com/league-of-legends/build/troll-builds-just-4-fun-mostly-viable-229063",title:"Shyvana Lich Bane",note:"Guia troll da fonte: o Lich Bane combina com o golpe da Shyvana. Item pode ter mudado.",items:["Mercury's Treads","Lich Bane","Sunfire Aegis","Black Cleaver","Sterak's Gage","Thornmail"],spells:["smite","flash"]}
];

export const CHALLENGES = [
  "Primeiro a morrer paga o lanche da próxima rodada.",
  "Antes de começar, cada um fala a build em voz alta. Quem esquecer um item paga uma prenda.",
  "Os 3 rotacionam juntos pro mesmo objetivo toda vez que o Dragão estiver perto de nascer.",
  "Sem flame no chat: quem xingar perde um ponto. Quem tiver mais pontos no final é o MVP.",
  "Se um perder a lane, os outros dois ajudam sem reclamar.",
  "Barão só quando os 3 estiverem vivos.",
  "Cada um coloca uma ward antes de dar recall. Quem esquecer dá a última ward.",
  "Primeiro abate do jogo: todos comemoram no chat com a mesma frase combinada.",
  "Pelo menos um dos três pinga os itens do outro quando a build estiver ruim e todos riem.",
  "Quem fizer o primeiro abate escolhe a música da próxima partida.",
  "Se perder a primeira torre, o trio troca de lane e tenta de novo.",
  "No nível 6, os 3 tentam um combo juntos pelo menos uma vez."
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
  const items = shuffle(NONBOOT).slice(0,5);
  items.splice(1,0,pick(POOL.bt));
  return { items, theme:{ n:"Caos Total", d:"Cinco itens sorteados sem critério. Se funcionar, foi sorte. Se não funcionar, foi história." } };
}

export function genBuild(c){
  const L = S.level;
  if (L === 3 && Math.random() < 0.3) return chaosBuild();
  let ok = THEMES.filter(t => t.lvl <= L && (t.dmg==="any" || (t.dmg==="ad" && c.d!=="p") || (t.dmg==="ap" && c.d!=="a")));
  if (!ok.length) ok = THEMES.filter(t => t.dmg==="any");
  const t = wpick(ok.map(x => [x, x.lvl===L ? 3 : 1]));
  const flex = shuffle(t.flex.filter(n => t.core.indexOf(n) < 0));
  const body = t.core.concat(flex).slice(0,5);
  const items = body.slice();
  items.splice(1,0,pick(t.boots));
  return { items, theme:{ n:t.n, d:t.d } };
}

export function genSpells(role){
  const L = S.level;
  if (role === "J") return ["smite", L===3 ? pick(["flash","ghost","tp","heal","barrier","cleanse","exhaust","ignite"]) : (Math.random()<0.88 ? "flash" : "ghost")];
  if (L === 3){
    const pool = SPELLKEYS.filter(k => k!=="smite");
    return shuffle(pool).slice(0,2);
  }
  const base = {
    T:[["tp",5],["ignite",3],["ghost",2],["barrier",1],["cleanse",1]],
    M:[["ignite",4],["tp",3],["barrier",1],["cleanse",1],["ghost",1]],
    A:[["heal",5],["barrier",2],["cleanse",2],["ignite",2],["exhaust",1]],
    S:[["exhaust",4],["ignite",4],["heal",2],["barrier",1],["cleanse",1]]
  };
  const second = L === 1 ? wpick(base[role]) : pick(SPELLKEYS.filter(k => k!=="smite" && k!=="flash"));
  return ["flash", second];
}

export function genTroll(role, used){
  const L = S.level;
  const loose = L === 3 || S.loose;
  let cands = CH.filter(c => (loose || c.r.indexOf(role) >= 0) && !used.has(c.n));
  if (!cands.length) cands = CH.filter(c => !used.has(c.n));
  const c = pick(cands);
  const b = genBuild(c);
  return { champ:c.n, role:role, dmg:c.d, items:b.items, theme:b.theme, spells:genSpells(role), skill:genSkill(), troll:L, off:false };
}

export function genOff(role, used){
  let c = OFF.filter(e => e.role === role && !used.has(e.champ));
  if (!c.length) c = OFF.filter(e => !used.has(e.champ));
  const e = pick(c);
  const ch = CHBY[e.champ];
  return { champ:e.champ, role:e.role, dmg:ch ? ch.d : "h", items:e.items, theme:{ n:e.title, d:e.note }, spells:e.spells, skill:"", src:e.src, url:e.url, troll:0, off:true };
}

export function gen(role, used){ return S.mode === "off" ? genOff(role, used) : genTroll(role, used); }
export function regenBuild(res){
  const c = CHBY[res.champ];
  const b = genBuild(c);
  res.items = b.items; res.theme = b.theme; res.skill = genSkill(); res.troll = S.level;
}
export function newChallenge(){
  let n; do { n = pick(CHALLENGES); } while (n === S.challenge && CHALLENGES.length > 1);
  S.challenge = n; return n;
}
