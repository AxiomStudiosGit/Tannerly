import React, { useState, useEffect, useRef } from "react";
import { ArrowRight, Plus, Minus, MessageSquare, X } from "lucide-react";

const FORM_ENDPOINT = "https://formspree.io/f/mbdnynnk";
const endpointReady = Boolean(FORM_ENDPOINT) && FORM_ENDPOINT.startsWith("https://formspree.io/f/");

/* ------------------------------------------------------------------ */
/*  Tannerley Barbell Club  |  Axiom Studios                            */
/*  Concept build. Fictional client, invented business data throughout. */
/*                                                                      */
/*  Material direction: machined steel, cast iron, knurling, powder     */
/*  coat. Dark graphite base with a static grain, every raised part on  */
/*  a shared bevel token (lit top edge, dark base edge). Orange is heat */
/*  and load only, never decoration.                                    */
/*                                                                      */
/*  Type: Saira 200 to 500 for display and numerals, headings lighter   */
/*  as they grow. Inter for body and UI. No third family.               */
/*                                                                      */
/*  Motion: one entrance behaviour site wide (fade and rise). One       */
/*  signature, the hero bar loading on scroll. Cursor sheen on three    */
/*  surfaces only: bar stage, pricing block, chat panel. One passive    */
/*  rAF throttled scroll listener. Reduced motion turns all of it off.  */
/*                                                                      */
/*  The chat responder is a demo shell. See the note above respond().   */
/* ------------------------------------------------------------------ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Saira:wght@200..500&family=Inter:wght@400;500;600&display=swap');

:root {
  --bg: #0B0B0C;
  --bg-alt: #111113;
  --text: #F5F5F7;
  --muted: #8A8A8F;
  --hair: rgba(245,245,247,0.10);
  --accent: #E14E1D;
  --r: 12px;
  --font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  --display: 'Saira', 'Inter', Helvetica, Arial, sans-serif;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  /* machined surface tokens: every raised part gets a lit top and a dark base */
  --edge-hi: rgba(255,255,255,0.10);
  --edge-lo: rgba(0,0,0,0.55);
  --sheen: 1;
}

* { box-sizing: border-box; }

.fg {
  position: relative;
  background:
    radial-gradient(120% 60% at 50% 0%, #16161A 0%, rgba(11,11,12,0) 55%),
    linear-gradient(180deg, #101013 0%, #0B0B0C 45%, #08080A 100%);
  color: var(--text);
  font-family: var(--font);
  font-size: 17px;
  line-height: 1.6;
  letter-spacing: -0.011em;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
/* fine machined grain, static, sits above backgrounds and below content */
.fg::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
}
.fg > * { position: relative; z-index: 1; }

.fg ::selection { background: var(--accent); color: #fff; }
.fg :focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; border-radius: 4px; }
/* sections take focus after a nav jump, so they get a hairline, not a full frame */
.fg .sec:focus { outline: none; }
.fg .sec:focus-visible { outline: 1px solid rgba(225,78,29,0.45); outline-offset: -1px; border-radius: 0; }

.w { width: 100%; max-width: 1120px; margin: 0 auto; padding: 0 24px; }

/* every raised part reads as a machined face: lit top edge, dark base edge */
.raised {
  background: linear-gradient(180deg, #1A1C1F 0%, #131417 46%, #0D0E10 100%);
  box-shadow: inset 0 1px 0 var(--edge-hi), inset 0 -1px 0 var(--edge-lo);
}
/* specular sheen, three surfaces only: bar stage, pricing block, chat panel */
.sheen::after {
  content: ""; position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
  background: radial-gradient(340px circle at var(--mx, 50%) var(--my, -20%),
    rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 34%, rgba(255,255,255,0) 62%);
  opacity: var(--sheen);
}

/* type */
.fg h1, .fg h2, .fg h3 {
  margin: 0; font-family: var(--display);
  font-weight: 300; letter-spacing: -0.022em; line-height: 1.08;
}
.h1 { font-size: clamp(2.625rem, 8.5vw, 5.5rem); font-weight: 200; letter-spacing: -0.03em; line-height: 1.0; }
.h2 { font-size: clamp(2rem, 5vw, 3.25rem); font-weight: 250; letter-spacing: -0.026em; }
.h3 { font-size: 1.25rem; font-weight: 500; letter-spacing: -0.012em; line-height: 1.2; }
.lead { font-size: 1.125rem; line-height: 1.6; color: var(--muted); max-width: 52ch; margin: 0; }
.p { font-size: 1rem; line-height: 1.6; color: var(--muted); max-width: 60ch; margin: 0; }

/* layout, 8px grid */
.sec { padding: 64px 0; scroll-margin-top: 80px; }
.sec-alt {
  background: linear-gradient(180deg, #151517 0%, #111113 38%, #0D0D0F 100%);
  box-shadow: inset 0 1px 0 rgba(245,245,247,0.05);
}
.head .lead { margin-top: 16px; }
.head { margin-bottom: 32px; }

/* buttons, two styles only */
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  background: var(--text); color: var(--bg);
  border: 0; border-radius: var(--r);
  padding: 16px 24px;
  font-family: var(--font); font-size: 1rem; font-weight: 500; letter-spacing: -0.01em;
  text-decoration: none; cursor: pointer;
  transition: transform 0.3s var(--ease);
}
.btn { box-shadow: inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.22); }
.btn:hover { transform: scale(1.02); }
.btn-quiet { background: transparent; color: var(--text); box-shadow: inset 0 0 0 1px var(--hair); }

/* nav */
.nav { position: sticky; top: 0; z-index: 50; background: rgba(13,13,15,0.68); backdrop-filter: blur(20px) saturate(1.2); -webkit-backdrop-filter: blur(20px) saturate(1.2); box-shadow: inset 0 -1px 0 var(--hair); }
.nav-in { display: flex; align-items: center; justify-content: space-between; height: 64px; gap: 16px; }
.mark { font-family: var(--display); font-size: 1.0625rem; font-weight: 500; letter-spacing: -0.015em; white-space: nowrap; }
.nav-links { display: none; gap: 32px; }
.nav-links a { font-size: 0.9375rem; color: var(--muted); text-decoration: none; transition: color 0.3s var(--ease); }
.nav-links a:hover { color: var(--text); }
.nav .btn { padding: 10px 18px; font-size: 0.9375rem; }

/* hero */
.hero { padding-top: 72px; }
.hero .lead { margin-top: 24px; }
.hero-cta { margin-top: 32px; display: flex; flex-wrap: wrap; align-items: center; gap: 16px; }
.hero-note { font-size: 0.9375rem; color: var(--muted); }

/* signature: the bar loads as the hero scrolls */
.stage {
  margin-top: 64px; height: 200px; position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  border-radius: var(--r);
}
.stage::before {
  content: "";
  position: absolute; inset: -10% -5% 0;
  background: radial-gradient(60% 70% at 50% 45%, rgba(245,245,247,0.07) 0%, rgba(245,245,247,0) 70%);
  pointer-events: none;
}
.bar { display: flex; align-items: center; justify-content: center; width: 100%; }
.shaft {
  height: 6px; flex: 1; max-width: 176px; border-radius: 3px;
  background: linear-gradient(180deg, #B4B7BD 0%, #767A80 42%, #34373C 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.6);
}
.collar {
  width: 7px; height: 26px; margin: 0 4px; border-radius: 2px;
  background: linear-gradient(180deg, #C2C5CA 0%, #7C8086 46%, #35383D 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(0,0,0,0.6);
}
/* cast iron plate: dark metal body, lit top edge, painted band across the face */
.plate {
  position: relative; margin: 0 3px; border-radius: 3px;
  background: linear-gradient(180deg, #35383D 0%, #1D2023 44%, #0D0E10 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(0,0,0,0.65);
  will-change: transform, opacity;
}
.plate::after {
  content: ""; position: absolute; left: 0; right: 0; top: 50%;
  height: 16%; transform: translateY(-50%);
  background: linear-gradient(180deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.03) 100%);
}
.plate.hot::after {
  background: linear-gradient(180deg, #F0672F 0%, #D2481A 46%, #9C330F 100%);
  box-shadow: 0 0 14px rgba(225,78,29,0.45), inset 0 1px 0 rgba(255,255,255,0.3);
}
.readout {
  position: absolute; bottom: 0; left: 0; right: 0; margin: 0;
  display: flex; justify-content: center; gap: 8px;
  font-family: var(--display); font-size: 0.9375rem;
  color: var(--muted); font-variant-numeric: tabular-nums;
}
.readout b { color: var(--text); font-weight: 500; }

/* stats */
.stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 40px 24px; }
.stat-n { font-family: var(--display); font-size: 2rem; font-weight: 250; letter-spacing: -0.03em; line-height: 1; }
.stat-l { font-size: 0.9375rem; color: var(--muted); margin-top: 8px; }

/* statement */
.statement { max-width: 22ch; }

/* rows */
.row { padding: 32px 0; border-top: 1px solid var(--hair); }
.row .p { margin-top: 12px; }
.row-num { display: grid; grid-template-columns: 40px 1fr; gap: 16px; }
.num { font-size: 1rem; font-weight: 500; color: var(--muted); font-variant-numeric: tabular-nums; }

/* coaches */
.coaches { display: grid; gap: 40px; }
.portrait {
  position: relative; overflow: hidden;
  aspect-ratio: 4 / 5; border-radius: var(--r);
  background: linear-gradient(158deg, #232327 0%, #17171A 52%, #0E0E10 100%);
  box-shadow: inset 0 1px 0 var(--edge-hi), inset 0 -1px 0 var(--edge-lo);
}
.portrait img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  filter: contrast(1.06) saturate(0.88) brightness(0.94);
}
.portrait::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background: linear-gradient(180deg, rgba(11,11,12,0) 45%, rgba(11,11,12,0.55) 100%);
}
.portrait-slot {
  position: absolute; left: 16px; bottom: 16px;
  font-size: 0.875rem; color: #5C5C61;
}
.coaches h3 { margin-top: 24px; }
.coaches .p { margin-top: 8px; }

/* quotes */
.quotes { display: grid; gap: 40px; }
.quote p { font-size: 1.125rem; line-height: 1.5; letter-spacing: -0.015em; margin: 0; max-width: 40ch; }
.quote cite { display: block; margin-top: 16px; font-style: normal; font-size: 0.9375rem; color: var(--muted); }

/* pricing */
.seg {
  position: relative; display: grid; grid-template-columns: repeat(3, 1fr);
  padding: 4px; border-radius: var(--r);
  background: linear-gradient(180deg, #0A0B0C 0%, #131417 100%);
  box-shadow: inset 0 1px 0 rgba(0,0,0,0.6), inset 0 -1px 0 var(--edge-hi);
}
.seg-ind {
  position: absolute; top: 4px; bottom: 4px; left: 4px;
  width: calc((100% - 8px) / 3); border-radius: 8px;
  background: linear-gradient(180deg, #26292D 0%, #16181B 100%);
  box-shadow: inset 0 1px 0 var(--edge-hi), 0 2px 8px rgba(0,0,0,0.5);
  transition: transform 0.34s var(--ease);
  will-change: transform;
}
.seg-btn {
  position: relative; z-index: 1; background: none; border: 0; cursor: pointer;
  padding: 14px 6px; font-family: var(--font); font-size: 0.9375rem;
  color: var(--muted); transition: color 0.3s var(--ease);
}
.seg-btn.on { color: var(--text); }
.plan { position: relative; margin-top: 16px; padding: 32px 28px; border-radius: var(--r); }
.plan-amt { font-family: var(--display); font-weight: 250; font-size: 3rem; letter-spacing: -0.03em; line-height: 1; margin-top: 12px; }
.plan-amt span { font-family: var(--font); font-size: 1rem; font-weight: 400; color: var(--muted); letter-spacing: -0.011em; }
.plan .p { margin-top: 16px; }

/* faq */
.faq-q {
  width: 100%; background: none; border: 0; border-top: 1px solid var(--hair);
  color: var(--text); font-family: var(--font); font-size: 1.0625rem; font-weight: 500;
  letter-spacing: -0.015em; text-align: left; padding: 24px 0;
  display: flex; align-items: center; justify-content: space-between; gap: 24px; cursor: pointer;
}
.faq-q svg { color: var(--muted); flex-shrink: 0; }
.faq-a { padding: 0 0 24px; }

/* form */
.form { display: grid; gap: 16px; max-width: 480px; }
.field label { display: block; margin-bottom: 8px; font-size: 1rem; color: var(--muted); }
.field input, .field select {
  width: 100%; border: 0; border-radius: var(--r);
  background: rgba(245,245,247,0.06); color: var(--text);
  font-family: var(--font); font-size: 1rem; padding: 16px;
}
.field input::placeholder { color: var(--muted); }
.field select {
  appearance: none;
  padding-right: 44px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none' stroke='%238A8A8F' stroke-width='1.5'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
}
.err { font-size: 0.9375rem; color: var(--accent); margin: 0; }
.form .btn { justify-self: start; margin-top: 8px; }
.done { max-width: 480px; }

/* footer */
.foot { padding: 64px 0 48px; border-top: 1px solid var(--hair); }
.foot-grid { display: grid; gap: 32px; }
.foot p, .foot a { font-size: 0.9375rem; color: var(--muted); text-decoration: none; margin: 0; }
.foot a:hover { color: var(--text); }
.foot h3 { font-size: 0.9375rem; font-weight: 500; margin-bottom: 12px; }
.fine { margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--hair); font-size: 0.875rem; color: #5C5C61; display: flex; flex-wrap: wrap; gap: 8px 24px; justify-content: space-between; }

/* chatbot, native to the system */
.bot-btn {
  position: fixed; right: 16px; bottom: 16px; z-index: 60;
  width: 52px; height: 52px; border-radius: 50%; border: 0; cursor: pointer;
  background: var(--text); color: var(--bg);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.6), 0 10px 26px rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.3s var(--ease);
}
.bot-btn:hover { transform: scale(1.02); }
.bot {
  position: fixed; right: 16px; bottom: 80px; z-index: 60;
  width: calc(100vw - 32px); max-width: 320px;
  border-radius: var(--r);
  box-shadow: inset 0 1px 0 var(--edge-hi), inset 0 -1px 0 var(--edge-lo), 0 16px 48px rgba(0,0,0,0.55);
  overflow: hidden;
  opacity: 0; transform: translate3d(0, 8px, 0) scale(0.98);
  transform-origin: 100% 100%;
  transition: opacity 0.3s var(--ease), transform 0.3s var(--ease);
  will-change: transform, opacity;
}
.bot.in { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
.bot-head { padding: 16px; border-bottom: 1px solid var(--hair); display: flex; align-items: center; justify-content: space-between; }
.bot-head span { font-size: 0.9375rem; font-weight: 500; }
.bot-head button { background: none; border: 0; color: var(--muted); cursor: pointer; display: flex; padding: 0; }
.bot-head-tools { display: flex; align-items: center; gap: 14px; }
.bot-reset {
  font-family: var(--font); font-size: 0.8125rem; color: var(--muted);
  transition: color 0.3s var(--ease);
}
.bot-reset:hover { color: var(--text); }
.bot-body { padding: 16px; display: grid; gap: 8px; }
.bot-log {
  display: grid; gap: 12px; align-content: start;
  min-height: 132px; max-height: 45vh; overflow-y: auto; margin-bottom: 8px;
}
.msg { margin: 0; font-size: 0.9375rem; max-width: 88%; animation: msgIn 0.3s var(--ease) both; }
@keyframes msgIn {
  from { opacity: 0; transform: translate3d(0, 8px, 0); }
  to { opacity: 1; transform: translate3d(0, 0, 0); }
}
/* typing state, opacity only */
.typing { display: flex; gap: 5px; align-items: center; padding: 4px 0; animation: msgIn 0.3s var(--ease) both; }
.typing i {
  width: 5px; height: 5px; border-radius: 50%; background: var(--muted); display: block;
  animation: dot 1.1s var(--ease) infinite;
}
.typing i:nth-child(2) { animation-delay: 0.15s; }
.typing i:nth-child(3) { animation-delay: 0.3s; }
@keyframes dot { 0%, 60%, 100% { opacity: 0.25; } 30% { opacity: 1; } }
.msg.them { color: var(--muted); }
.msg.you {
  justify-self: end; color: var(--text);
  background: rgba(245,245,247,0.08); border-radius: 8px; padding: 10px 12px;
}
.bot-msg { font-size: 0.9375rem; color: var(--muted); margin: 0 0 8px; }
.bot-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.bot-chip {
  border: 0; border-radius: 8px; color: var(--text);
  background: linear-gradient(180deg, #1C1E21 0%, #131417 100%);
  box-shadow: inset 0 1px 0 var(--edge-hi), inset 0 -1px 0 var(--edge-lo);
  font-family: var(--font); font-size: 0.875rem; text-align: left;
  padding: 9px 14px; cursor: pointer;
  transition: background 0.3s var(--ease);
}
.bot-chip:hover { background: linear-gradient(180deg, #23262A 0%, #16181B 100%); }
.bot-entry { display: flex; gap: 8px; padding: 12px 16px; border-top: 1px solid var(--hair); }
.bot-entry input {
  flex: 1; min-width: 0; border: 0; background: none; color: var(--text);
  font-family: var(--font); font-size: 0.9375rem; padding: 4px 0;
}
.bot-entry input::placeholder { color: #5C5C61; }
.bot-entry button { background: none; border: 0; color: var(--text); cursor: pointer; display: flex; padding: 4px; }

/* the single motion behaviour */
.reveal { opacity: 0; transform: translate3d(0, 20px, 0); transition: opacity 0.7s var(--ease), transform 0.7s var(--ease); }
.reveal.in { opacity: 1; transform: translate3d(0, 0, 0); }

@media (hover: none) { :root { --sheen: 0; } }
@media (prefers-reduced-motion: reduce) {
  :root { --sheen: 0; }
  .bot { transition: none; }
  .msg, .typing { animation: none; }
  .typing i { animation: none; opacity: 0.5; }
  .seg-ind { transition: none; }
  .reveal { opacity: 1; transform: none; transition: none; }
  .btn, .bot-btn, .nav-links a { transition: none; }
  .btn:hover, .bot-btn:hover { transform: none; }
}

@media (min-width: 768px) {
  .w { padding: 0 40px; }
  .sec { padding: 96px 0; scroll-margin-top: 88px; }
  .hero { padding-top: 112px; }
  .nav-links { display: flex; }
  .stage { height: 264px; margin-top: 88px; }
  .shaft { max-width: 240px; }
  .stats { grid-template-columns: repeat(4, 1fr); }
  .coaches, .quotes { grid-template-columns: repeat(3, 1fr); gap: 32px; }
  .split { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: start; }
  .row-num { grid-template-columns: 56px 1fr; gap: 24px; }
  .foot-grid { grid-template-columns: repeat(3, 1fr); }
  .stat-n { font-size: 2.5rem; }
  .bot-log { max-height: 320px; }
  .head { margin-bottom: 0; }
}
`;

/* ---------------------------- data ---------------------------- */

const PLATES = [
  { kg: 25, w: 19, h: 128, hot: true },
  { kg: 25, w: 19, h: 128, hot: true },
  { kg: 20, w: 16, h: 106, hot: false },
  { kg: 10, w: 12, h: 80, hot: false },
];
const BAR = 20; // plus 160 in plates, 180 kg loaded

const STATS = [
  ["8", "Lifters per session"],
  ["120", "Members"],
  ["2016", "Training in Tannerley since"],
  ["9 yrs", "Average coaching experience"],
];

const METHOD = [
  ["Written for you", "Your program follows your screen, your history and your numbers. It is rewritten every twelve weeks."],
  ["Eight lifters", "The size where a coach can still watch every set you do."],
  ["Coached, not supervised", "A coach on the floor for the full hour, calling loads and fixing lifts."],
  ["Every set logged", "Progress you can read back, not guess at."],
];

const STEPS = [
  ["We talk", "Your history, your injuries, what you want from this."],
  ["We screen how you move", "Squat, hinge, push, pull. It tells us where to start."],
  ["You lift", "Real working sets with a coach on you the whole time."],
  ["You get a plan", "A written first block and the exact weekly cost."],
];

/*
  Portraits. Drop a file path or URL into src and the grading, crop and
  overlay are already handled. Generate all three in one session so the
  light matches: cool key from camera left, single warm rim from behind,
  near black background, 4:5 crop, waist up, no equipment branding.

  1. Male strength coach, mid forties, short beard, arms at sides, plain
     dark tee, standing in a dark gym, cool key light from camera left,
     warm rim light behind, near black background, editorial portrait,
     natural skin texture, calm expression, 4:5.
  2. Female strength coach, early thirties, chalk on hands, dark tank,
     same cool key and warm rim, near black background, editorial
     portrait, composed expression, 4:5.
  3. Male coach, early thirties, standing beside a squat rack out of
     focus, same lighting setup, near black background, editorial
     portrait, 4:5.
*/
const COACHES = [
  {
    name: "Dane Whitmore",
    src: "",
    p: "Head coach. Fourteen years on the floor. Writes the programming.",
  },
  {
    name: "Priya Raman",
    src: "",
    p: "Strength coach. Competes in powerlifting. Takes anyone training around an injury.",
  },
  {
    name: "Callum Reid",
    src: "",
    p: "Coach. Runs most first sessions. Makes the first month simple.",
  },
];

const QUOTES = [
  ["Never touched a barbell at 41. I deadlift 140 kilos now and my back has stopped hurting.", "Sarah M, Tannerley"],
  ["Six years at big gyms, no progress. Thirty kilos on my squat in one block here.", "Tom H, Marrandah"],
  ["No pitch, no contract talk. Just an hour of proper coaching. I signed up on the way out.", "Nadia P, Tannerley Bay"],
];

const PLANS = [
  ["Foundations", "$49", "Two coached sessions a week."],
  ["Strength", "$69", "Unlimited coached sessions. Most members train here."],
  ["Individual", "$120", "Weekly one to one, plus unlimited sessions."],
];

const FAQS = [
  ["I have never lifted before.", "About half of our members started the same way. Your first block is technique and light loading, coached every rep."],
  ["I have an old injury.", "We screen you before you lift and program around what hurts. If you need a physio first, we will say so."],
  ["Is there a contract?", "No. Week to week, cancel with two weeks notice."],
  ["When do sessions run?", "One hour, from 5am to 9am and 3pm to 8pm on weekdays, plus 6am to 11am Saturdays."],
  ["What do I bring?", "Flat shoes, water, clothes you can move in. Allow 45 minutes."],
];

/*
  Chat responder. DEMO SHELL ONLY. Matching runs locally so the showcase
  works offline with no key in the bundle. This must never ship on a paying
  client build: swap respond() for a call to the Axiom Claude endpoint and
  move the copy below into the system prompt. The written answers stay the
  same either way, which is why they are written here first.
*/
const PROMPTS = [
  "When do sessions run?",
  "I have never lifted before",
  "Book my free intro",
];

const ANSWERS = [
  // 1. Injuries and physical limitations
  {
    match: [
      "injur", "injery", "bad back", "back pain", "sore back", "lower back",
      "my back", "back injury", "back issue", "knee", "shoulder", "elbow",
      "wrist", "ankle", "hip pain", "hip injury", "bad hip", "my hip",
      "joint", "spine", "slipped disc", "bulging disc", "herniated",
      "disc injury", "sciatica", "arthritis", "rehab", "physio", "surgery",
      "surgeon", "sore", "pain", "hurt", "recover"
    ],
    reply:
      "Most of our members are working around something. Everyone is screened before they lift, and your program is written around the injury rather than ignoring it. Priya Raman handles this side of the coaching, so mention it at your intro session."
  },

  // 2. Never lifted before
  {
    match: [
      "never lifted", "never trained", "beginner", "begginer", "new to",
      "no experience", "inexperienc", "first time", "start out", "starting out",
      "novice", "technique", "proper form", "bad form", "intimidat",
      "nervous", "scared", "embarrass", "know what i'm doing",
      "know what im doing"
    ],
    reply:
      "Most people who walk in have never touched a barbell. Callum Reid runs most first sessions and teaches the lifts from the start, with eight people in the room so you are coached rather than watched from a distance. No experience is expected."
  },

  // 3. Will I fit in here: age, sex, current fitness
  {
    match: [
      "too old", "older", "age limit", "how old", "over 50", "over 60",
      "in my 50", "in my 60", "in my 40", "senior",
      "woman", "women", "female", "girls", "ladies",
      "unfit", "out of shape", "overweight", "obese", "very weak", "too weak",
      "fit enough", "fitness level", "not fit", "get fit first",
      "in shape first", "everyone else", "fit in here", "belong"
    ],
    reply:
      "The room is mixed in age, sex and starting point, and the programming is individual, so nobody is asked to keep up with anyone else. Sessions are coached, which is what makes that workable. If you are unsure, book the intro and see the room for yourself."
  },

  // 4. Pricing
  {
    match: [
      "price", "prices", "pricing", "cost", "how much", "howmuch",
      "fees", "joining fee", "sign up fee", "rate", "rates", "membership",
      "member ship", "per week", "weekly", "expensive", "cheap", "afford",
      "payment", "dollar", "$"
    ],
    reply:
      "Pricing is per week. Foundations is $49 for two sessions, Strength is $69 for unlimited and is what most members are on, and Individual is $120 for a weekly one to one plus unlimited sessions. Nothing is locked in beyond the week."
  },

  // 5. Booking the intro session
  {
    match: [
      "book", "booking", "intro", "trial", "free session", "taster",
      "try a", "try out", "give it a go", "sign up", "signup", "join up",
      "joining", "how do i join", "want to join", "get started",
      "how do i start", "first session", "come in", "visit", "drop in",
      "appointment"
    ],
    reply:
      "The intro is a free 45 minute session with a coach, usually Callum Reid. You talk through your history, get screened, and lift something light so we can see how you move. Use the booking form on this page and we will confirm a time."
  },

  // 6. Trial terms and cancellation
  {
    match: [
      "cancel", "cancle", "cancellation", "contract", "lock in", "locked in",
      "commit", "minimum term", "min term", "notice period", "weeks notice",
      "quit", "stop coming", "pause", "freeze", "refund", "obligation",
      "tied in", "tied down"
    ],
    reply:
      "Membership runs week to week with no contract. To cancel, give two weeks notice and that is the end of it. The intro session is free and carries no obligation to sign up."
  },

  // 7. Session times and hours
  {
    match: [
      "time", "times", "timetable", "schedule", "hours", "opening",
      "are you open", "open at", "open on", "do you open", "closed",
      "close at", "closing", "do you close", "when do", "when are",
      "what time", "morning", "evening", "afternoon", "weekend", "saturday",
      "sunday", "how early", "early morning", "too early", "how late",
      "late session", "after work", "leave work", "finish work",
      "before work", "5am", "6am", "6pm", "7pm", "availab"
    ],
    reply:
      "Sessions run one hour. Weekdays are 5am to 9am and 3pm to 8pm, Saturdays are 6am to 11am, and we are closed Sunday. Each session caps at eight lifters, so times are booked rather than walk in."
  },

  // 8. Location and parking
  {
    match: [
      "where", "location", "located", "address", "parking", "park", "car park",
      "carpark", "direction", "tannerley", "tarrawool", "marrandah",
      "tannerley bay", "central coast", "near me",
      "nearby", "how do i get", "find you", "map", "public transport",
      "train station", "bus stop", "by bus", "the bus"
    ],
    reply:
      "We are at Unit 3, 14 Tarrawool Rise, Tannerley, on the Central Coast, NSW. There is free off street parking at the door, and it is quiet at session times. The address is also in the footer of this page."
  },

  // 9. Other training types we do not offer
  {
    match: [
      "yoga", "pilates", "cardio", "treadmill", "rower", "exercise bike",
      "spin class", "spin bike", "classes", "group class", "class timetable",
      "group fitness",
      "crossfit", "cross fit", "hiit", "boxing", "bootcamp", "machine",
      "machines", "cable", "equipment", "open gym", "personal training",
      "personal trainer", "one to one", "1 on 1", "one on one", "weight loss",
      "bodybuilding", "running program", "swim", "sauna", "childcare", "creche"
    ],
    reply:
      "We do barbell strength training in coached small groups, and that is all we do. There are no classes, cardio machines, yoga or open gym floor here. If you want one to one coaching, the Individual membership includes a weekly private session."
  },

  // 10. Who built the site and this assistant
  {
    match: [
      "who built", "who made", "who designed", "built this", "made this",
      "designed this", "website", "web site", "web design", "developer",
      "designer", "axiom", "chatbot", "chat bot", "are you a bot",
      "are you real", "are you human", "assistant", "who wrote"
    ],
    reply:
      "This site and this assistant were built by Axiom Studios, a web design studio on the Central Coast."
  },

  // 11. Cold open: what is this place
  {
    match: [
      "what is this", "what do you do", "what do you offer", "what's this",
      "whats this", "what kind", "what sort", "tell me about", "about you",
      "about the gym", "info", "how many people", "how many lifters",
      "class size", "group size", "cap at", "how big", "explain", "gym", "strength", "barbell",
      "weight", "lifting", "training", "hello", "good morning", "help"
    ],
    reply:
      "Tannerley Barbell Club is a small group barbell gym in Tannerley. Eight lifters a session, one hour, with a program written for you and rewritten every twelve weeks. It is coached training, not a room you are left alone in."
  }
];

const FALLBACK =
  "I do not have an answer for that one. A coach can answer it directly at the free intro session, and the Book my free intro form on this page is the way to arrange one.";

const respond = (text) => {
  const q = text.toLowerCase();
  const hit = ANSWERS.find((a) => a.match.some((m) => q.includes(m)));
  return hit ? hit.reply : FALLBACK;
};

/* ---------------------------- helpers ---------------------------- */

function Reveal({ children, className = "", ...rest }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${seen ? "in" : ""} ${className}`} {...rest}>
      {children}
    </div>
  );
}

/* cursor sheen. Three surfaces only. rAF throttled, pointer devices only. */
function useSheen() {
  const ref = useRef(null);
  const frame = useRef(0);
  const live = useRef(true);
  useEffect(() => {
    live.current =
      window.matchMedia("(hover: hover)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => frame.current && cancelAnimationFrame(frame.current);
  }, []);
  const onPointerMove = (e) => {
    if (!live.current || frame.current) return;
    const { clientX, clientY } = e;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--my", `${((clientY - r.top) / r.height) * 100}%`);
    });
  };
  const onPointerLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "-20%");
  };
  return { ref, onPointerMove, onPointerLeave };
}

/* ---------------------------- page ---------------------------- */

export default function TannerleyBarbellClub() {
  const [openFaq, setOpenFaq] = useState(-1);
  const [plan, setPlan] = useState(1);
  const stageSheen = useSheen();
  const planSheen = useSheen();
  const botSheen = useSheen();
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", goal: "Get stronger" });
  const [error, setError] = useState("");
  const [bot, setBot] = useState(false); // mounted
  const [botIn, setBotIn] = useState(false); // animated in
  const [chat, setChat] = useState([]);
  const [asked, setAsked] = useState([]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const logRef = useRef(null);
  const inputRef = useRef(null);
  const launcherRef = useRef(null);
  const timers = useRef([]);
  const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const el = logRef.current;
    if (!el || (chat.length === 0 && !typing)) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduced() ? "auto" : "smooth" });
  }, [chat, typing]);

  const openBot = () => {
    setBot(true);
    if (reduced()) {
      setBotIn(true);
      return;
    }
    requestAnimationFrame(() => requestAnimationFrame(() => setBotIn(true)));
  };
  const closeBot = () => {
    setBotIn(false);
    launcherRef.current?.focus();
    if (reduced()) {
      setBot(false);
      return;
    }
    const t = setTimeout(() => setBot(false), 300);
    timers.current.push(t);
  };

  // focus the input once the panel is up
  useEffect(() => {
    if (botIn) inputRef.current?.focus();
  }, [botIn]);

  const resetChat = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setChat([]);
    setAsked([]);
    setTyping(false);
    setDraft("");
    inputRef.current?.focus();
  };

  const ask = (text) => {
    const q = text.trim();
    if (!q) return;
    setDraft("");
    setAsked((a) => (a.includes(text) ? a : [...a, text]));
    setChat((c) => [...c, { from: "you", text: q }]);
    const reply = respond(q);
    setTyping(true);
    // time to answer scales with the length of the answer, within human bounds
    const wait = reduced() ? 150 : Math.min(900, Math.max(400, reply.length * 6));
    const t = setTimeout(() => {
      setTyping(false);
      setChat((c) => [...c, { from: "them", text: reply }]);
    }, wait);
    timers.current.push(t);
  };

  const remaining = PROMPTS.filter((q) => !asked.includes(q));

  // in page links: keep the href for meaning, do the scroll ourselves.
  // scroll-margin-top on the sections keeps headings clear of the sticky nav.
  const jump = (e) => {
    const id = e.currentTarget.getAttribute("href")?.slice(1);
    const el = id && document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
    // keyboard users continue from the section they asked for
    el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  };

  const heroRef = useRef(null);
  const [load, setLoad] = useState(0);
  const [scrub, setScrub] = useState(false);

  useEffect(() => {
    const on =
      window.matchMedia("(min-width: 768px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setScrub(on);
    if (!on) {
      setLoad(1);
      return;
    }
    let ticking = false;
    const measure = () => {
      ticking = false;
      const el = heroRef.current;
      if (!el) return;
      const span = el.offsetHeight * 0.7 || 1;
      setLoad(Math.min(1, Math.max(0, window.scrollY / span)));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(measure);
      }
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const loaded = load * PLATES.length;
  const kgRaw =
    BAR +
    2 * PLATES.reduce((a, p, i) => a + p.kg * Math.min(1, Math.max(0, loaded - i)), 0);
  const kg = Math.round(kgRaw / 2.5) * 2.5;
  const set = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    if (error) setError("");
  };
  const submit = async () => {
    if (sending) return;
    if (!form.name.trim()) return setError("Add your name so a coach knows who to ask for.");
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      return setError("Check the email address, we send the confirmation there.");
    if (!endpointReady) return setError("Booking is unavailable right now. Please call 02 5550 0100.");
    setError("");
    setSending(true);
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 200) {
        setSent(true);
      } else {
        setError("Something went wrong sending that. Please try again or call 02 5550 0100.");
      }
    } catch {
      setError("Something went wrong sending that. Please try again or call 02 5550 0100.");
    } finally {
      setSending(false);
    }
  };

  const plate = (i, dir) => {
    const t = Math.min(1, Math.max(0, loaded - i));
    return {
      opacity: t,
      transform: `translate3d(${dir * (1 - t) * 24}px, 0, 0) scaleY(${0.6 + t * 0.4})`,
      transition: scrub ? "none" : "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)",
    };
  };

  return (
    <div className="fg">
      <style>{CSS}</style>

      <nav className="nav">
        <div className="w nav-in">
          <span className="mark">Tannerley Barbell Club</span>
          <div className="nav-links">
            <a href="#method" onClick={jump}>Method</a>
            <a href="#coaches" onClick={jump}>Coaches</a>
            <a href="#pricing" onClick={jump}>Pricing</a>
            <a href="#faq" onClick={jump}>Questions</a>
          </div>
          <a href="#book" className="btn" onClick={jump}>Book intro</a>
        </div>
      </nav>

      <header className="w hero" ref={heroRef}>
        <Reveal>
          <h1 className="h1">Real strength.<br />Properly coached.</h1>
        </Reveal>
        <Reveal>
          <p className="lead">
            Small group barbell training in Tannerley. Eight lifters a session, a program written for
            you, a coach on every set.
          </p>
        </Reveal>
        <Reveal>
          <div className="hero-cta">
            <a href="#book" className="btn" onClick={jump}>
              Book a free intro <ArrowRight size={17} />
            </a>
            <span className="hero-note">45 minutes. No contract.</span>
          </div>
        </Reveal>

        <div
          className="stage raised sheen"
          ref={stageSheen.ref}
          onPointerMove={stageSheen.onPointerMove}
          onPointerLeave={stageSheen.onPointerLeave}
        >
          <div className="bar">
            {[...PLATES].reverse().map((p, j) => (
              <div
                key={`l${j}`}
                className={`plate ${p.hot ? "hot" : ""}`}
                style={{ width: p.w, height: p.h, ...plate(PLATES.length - 1 - j, 1) }}
              />
            ))}
            <span className="collar" />
            <span className="shaft" />
            <span className="collar" />
            {PLATES.map((p, i) => (
              <div
                key={`r${i}`}
                className={`plate ${p.hot ? "hot" : ""}`}
                style={{ width: p.w, height: p.h, ...plate(i, -1) }}
              />
            ))}
          </div>
          <p className="readout">
            <b>{load >= 1 ? kg.toFixed(0) : kg.toFixed(1)} kg</b>
            <span>on the bar</span>
          </p>
        </div>
      </header>

      <section className="sec">
        <div className="w">
          <Reveal>
            <div className="stats">
              {STATS.map(([n, l]) => (
                <div key={l}>
                  <div className="stat-n">{n}</div>
                  <div className="stat-l">{l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="sec sec-alt">
        <div className="w">
          <Reveal>
            <h2 className="h2 statement">Most gyms sell access. We coach.</h2>
          </Reveal>
        </div>
      </section>

      <section className="sec" id="method">
        <div className="w split">
          <Reveal className="head">
            <h2 className="h2">How we train.</h2>
          </Reveal>
          <div>
            {METHOD.map(([t, p]) => (
              <Reveal className="row" key={t}>
                <h3 className="h3">{t}</h3>
                <p className="p">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec-alt">
        <div className="w split">
          <Reveal className="head">
            <h2 className="h2">Your first session.</h2>
            <p className="lead">One hour, one coach, free.</p>
          </Reveal>
          <div>
            {STEPS.map(([t, p], i) => (
              <Reveal className="row row-num" key={t}>
                <span className="num">0{i + 1}</span>
                <div>
                  <h3 className="h3">{t}</h3>
                  <p className="p">{p}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="coaches">
        <div className="w">
          <Reveal className="head" style={{ marginBottom: 40 }}>
            <h2 className="h2">The coaches.</h2>
          </Reveal>
          <div className="coaches">
            {COACHES.map((c) => (
              <Reveal key={c.name}>
                <div className="portrait">
                  {c.src ? (
                    <img src={c.src} alt={`${c.name}, coach at Tannerley Barbell Club`} />
                  ) : (
                    <span className="portrait-slot" role="img" aria-label={`Image slot for ${c.name}, client photography`}>
                      Client photography
                    </span>
                  )}
                </div>
                <h3 className="h3">{c.name}</h3>
                <p className="p">{c.p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec-alt">
        <div className="w">
          <Reveal className="head" style={{ marginBottom: 40 }}>
            <h2 className="h2">Members.</h2>
          </Reveal>
          <div className="quotes">
            {QUOTES.map(([q, who]) => (
              <Reveal className="quote" key={who}>
                <p>{q}</p>
                <cite>{who}</cite>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="pricing">
        <div className="w split">
          <Reveal className="head">
            <h2 className="h2">Pricing.</h2>
            <p className="lead">Week to week. Cancel with two weeks notice.</p>
          </Reveal>
          <Reveal>
            <div className="seg" role="tablist" aria-label="Membership options">
              <span className="seg-ind" style={{ transform: `translate3d(${plan * 100}%, 0, 0)` }} />
              {PLANS.map(([name], i) => (
                <button
                  key={name}
                  role="tab"
                  id={`plan-tab-${i}`}
                  aria-selected={plan === i}
                  aria-controls="plan-panel"
                  className={`seg-btn ${plan === i ? "on" : ""}`}
                  onClick={() => setPlan(i)}
                >
                  {name}
                </button>
              ))}
            </div>
            <div
              className="plan raised sheen"
              id="plan-panel"
              role="tabpanel"
              aria-labelledby={`plan-tab-${plan}`}
              ref={planSheen.ref}
              onPointerMove={planSheen.onPointerMove}
              onPointerLeave={planSheen.onPointerLeave}
            >
              <h3 className="h3">{PLANS[plan][0]}</h3>
              <div className="plan-amt">
                {PLANS[plan][1]} <span>per week</span>
              </div>
              <p className="p">{PLANS[plan][2]}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="sec sec-alt" id="faq">
        <div className="w split">
          <Reveal className="head">
            <h2 className="h2">Questions.</h2>
          </Reveal>
          <div>
            {FAQS.map(([q, a], i) => (
              <div key={q}>
                <button
                  className="faq-q"
                  id={`faq-q-${i}`}
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  {q}
                  {openFaq === i ? <Minus size={18} /> : <Plus size={18} />}
                </button>
                {openFaq === i && (
                  <div className="faq-a" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
                    <p className="p">{a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="book">
        <div className="w split">
          <Reveal className="head">
            <h2 className="h2">Come in and lift.</h2>
            <p className="lead">An hour with a coach, at no cost. Decide afterwards.</p>
          </Reveal>
          <Reveal>
            {sent ? (
              <div className="done">
                <h3 className="h3">Booked in.</h3>
                <p className="p" style={{ marginTop: 12 }}>
                  Thanks {form.name.split(" ")[0]}. A coach will call within one business day to set
                  a time. To move faster, call 02 5550 0100.
                </p>
              </div>
            ) : (
              <div className="form">
                <div className="field">
                  <label htmlFor="n">Name</label>
                  <input id="n" value={form.name} onChange={set("name")} placeholder="Your name" />
                </div>
                <div className="field">
                  <label htmlFor="e">Email</label>
                  <input id="e" type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" />
                </div>
                <div className="field">
                  <label htmlFor="ph">Phone</label>
                  <input id="ph" value={form.phone} onChange={set("phone")} placeholder="0400 000 000" />
                </div>
                <div className="field">
                  <label htmlFor="g">Goal</label>
                  <select id="g" value={form.goal} onChange={set("goal")}>
                    <option>Get stronger</option>
                    <option>Start from scratch</option>
                    <option>Train around an injury</option>
                    <option>Change body composition</option>
                  </select>
                </div>
                <button className="btn" onClick={submit} disabled={sending} aria-busy={sending}>
                  {sending ? "Sending…" : <>Book my free intro <ArrowRight size={17} /></>}
                </button>
                {error && (
                  <p className="err" role="alert">
                    {error}
                  </p>
                )}
              </div>
            )}
          </Reveal>
        </div>
      </section>

      <footer className="foot">
        <div className="w">
          <div className="foot-grid">
            <div>
              <h3>Tannerley Barbell Club</h3>
              <p>
                Unit 3, 14 Tarrawool Rise
                <br />
                Tannerley, Central Coast NSW
              </p>
            </div>
            <div>
              <h3>Contact</h3>
              <p><a href="tel:0255500100">02 5550 0100</a></p>
              <p><a href="mailto:train@tannerleybarbell.com.au">train@tannerleybarbell.com.au</a></p>
            </div>
            <div>
              <h3>Hours</h3>
              <p>
                Monday to Friday, 5am to 9am and 3pm to 8pm
                <br />
                Saturday, 6am to 11am
                <br />
                Sunday, closed
              </p>
            </div>
          </div>
          <div className="fine">
            <span>
              Concept build. Tannerley Barbell Club is a fictional client created to demonstrate our
              work.
            </span>
            <span>Site by Axiom Studios</span>
          </div>
        </div>
      </footer>

      {bot && (
        <div
          className={`bot raised sheen ${botIn ? "in" : ""}`}
          role="dialog"
          aria-label="Chat with Tannerley Barbell Club"
          ref={botSheen.ref}
          onPointerMove={botSheen.onPointerMove}
          onPointerLeave={botSheen.onPointerLeave}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.stopPropagation();
              closeBot();
            }
          }}
        >
          <div className="bot-head">
            <span>Tannerley Assistant</span>
            <div className="bot-head-tools">
              {chat.length > 0 && (
                <button className="bot-reset" onClick={resetChat}>
                  Start over
                </button>
              )}
              <button onClick={closeBot} aria-label="Close chat">
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="bot-body">
            {chat.length === 0 && (
              <p className="bot-msg">
                Ask about session times, pricing, or booking your free intro.
              </p>
            )}
            <div className="bot-log" ref={logRef} aria-live="polite">
              {chat.map((m, i) => (
                <p className={`msg ${m.from}`} key={i}>
                  {m.text}
                </p>
              ))}
              {typing && (
                <span className="typing" role="status" aria-label="Typing">
                  <i />
                  <i />
                  <i />
                </span>
              )}
            </div>
            {!typing && remaining.length > 0 && (
              <div className="bot-chips">
                {remaining.map((q) => (
                  <button className="bot-chip" key={q} onClick={() => ask(q)}>
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="bot-entry">
            <input
              ref={inputRef}
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  ask(draft);
                }
              }}
              placeholder="Type a message"
              aria-label="Message"
            />
            <button type="button" aria-label="Send message" onClick={() => ask(draft)}>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
      <button
        className="bot-btn"
        ref={launcherRef}
        onClick={() => (bot ? closeBot() : openBot())}
        aria-label={bot ? "Close chat" : "Open chat"}
        aria-expanded={bot}
      >
        {bot ? <X size={20} /> : <MessageSquare size={20} />}
      </button>
    </div>
  );
}
