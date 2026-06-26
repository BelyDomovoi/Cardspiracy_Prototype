import { useState, useEffect, useRef, useCallback } from "react";
import phrasesData from "../data/protopie_phrases_combined.json";

// ─── Shared assets ────────────────────────────────────────────────────────────
import imgBg from "../imports/1/35ef4ddb3c75e406cbe598fee14997df39c43963.png";
import imgFade from "../imports/1/73509681d11badca068ba3aa79af498d3deb3589.png";
import imgImage97 from "../imports/1/18936dcceaf362f92e9282c8838f98f861cb4846.png";
import imgImage109 from "../imports/1/6ee4345aa4ea15deaa366a355902b1d2f8a5986b.png";
import imgEllipse47 from "../imports/1/9655adacfc8f10e8f1df674e4bbe5e70ab5cab7b.png";
import imgRecMic from "../imports/1/b80e742f7702c119b0901c7d10b8321c2192f34b.png";
import imgChatGpt25634Pm2 from "../imports/1/2b62062baafa10e34dee82191b4050e1f2561f41.png";
import imgChatGpt4712Pm1 from "../imports/1/8319a3acffb1c3fb538a84147ea46cfdf2610f14.png";
import imgImage98 from "../imports/1/3021c74158dd0403449fda1d1c20fc57988d6b86.png";
import imgChatGpt25634Pm1 from "../imports/1/d3eccf188cd139539ab4aaaafdb9227d896491b0.png";
import imgScreenGlass from "../imports/1/31a425343b014f566cb55bd7122a5a10c73edc6c.png";
import imgSubtractA from "../imports/1/cb288efdc4cf394b455da759efc8b2c15d1b67fd.png";
import imgSubtractB from "../imports/2/ebdc476ccac2a8138c777970f46b2fb77fb4db77.png";
import imgIconMailA from "../imports/1/c5df63a57b8c81b94233fe80d99c95ed558ce82f.png";
import imgIconMailB from "../imports/2/859ad54447a7b75c94f474ac10c6ccc5416689c5.png";
import imgHeroMushroom from "../imports/hero_mushroom.png";
import imgPhraseEmptyBg from "../imports/phrase_empty_bg.png";
import imgCardGovernment from "../imports/card_government.png";
import imgCardHollowEarth from "../imports/card_hollow_earth.png";
import imgCardOtherworldly from "../imports/card_otherworldly.png";
import svgPaths from "../imports/1/svg-81hq1u4nej";

// ─── Shake animation keyframes ────────────────────────────────────────────────
// Injected once via <style> tag. Shake = 40% of 1050ms ≈ 420ms; pause ≈ 630ms.
const ANIMATION_CSS = `
@keyframes envelopeShakeLoop {
  0%   { transform: translateX(0px);  }
  8%   { transform: translateX(-4px); }
  16%  { transform: translateX(4px);  }
  24%  { transform: translateX(-4px); }
  32%  { transform: translateX(4px);  }
  40%  { transform: translateX(0px);  }
  100% { transform: translateX(0px);  }
}
@keyframes phraseFall {
  0%   { transform: translateY(-190px); opacity: 0; }
  12%  { opacity: 1; }
  88%  { opacity: 1; }
  100% { transform: translateY(690px); opacity: 0; }
}
@keyframes indicatorPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.32; transform: scale(0.86); }
}
`;

// ─── Interaction state machine ────────────────────────────────────────────────
type IntroPhase =
  | "waitingForAlert"          // envelope default, screen_firststage disabled
  | "envelopeAlert"            // envelope alert + shake, waiting for first click
  | "revealingInitialMessages" // messages animating in, screen_firststage disabled
  | "readingMessages"          // messages visible, screen_firststage enabled
  | "finalIntroState"          // Frame 5 messages visible, Rec active
  | "phraseSelection"          // phrase picking game after Rec
  | "testCompleted";           // summary shown

// ─── Animation timing constants ───────────────────────────────────────────────
const ALERT_DELAY_MS   = 800;  // delay before envelope switches to alert
const PHRASE_DELAY_MS  = 800;  // delay before character phrase appears
const MSG1_DELAY_MS    = 0;    // first message appears immediately on click
const MSG2_DELAY_MS    = 200;  // second message stagger
const MSG_ANIM_MS      = 260;  // duration of each message fade+slide transition
const REVEAL_TOTAL_MS  = MSG2_DELAY_MS + MSG_ANIM_MS + 30; // ≈490ms buffer

const HANDWRITE_FONT   = "'SNFBSTRD handwrite', sans-serif";
const PHRASE_READING   = "может и рад бы забыть";
const MAX_SELECTED_PHRASES = 10;
const PHRASE_SPAWN_MS = 3000;
const PHRASE_FALL_MS = 9500;
const PHRASE_WIDTH = 400;
const PHRASE_LANES = [63.77, 424.43];

type CardCategory = "GOVERNMENT" | "HOLLOW_EARTH" | "OTHERWORLDLY";
type PhraseType = CardCategory | "NONE";

interface PhraseRecord {
  id: number;
  type: PhraseType;
  text: string;
}

interface FallingPhrase extends PhraseRecord {
  instanceId: number;
  left: number;
  duration: number;
  height: number;
  fontSize: number;
}

const CARD_IMAGES: Record<CardCategory, { src: string; name: string; rotate: string }> = {
  GOVERNMENT: { src: imgCardGovernment, name: "Goverment_Card", rotate: "-2deg" },
  HOLLOW_EARTH: { src: imgCardHollowEarth, name: "HollowEarth_Card", rotate: "2deg" },
  OTHERWORLDLY: { src: imgCardOtherworldly, name: "OtherWorld_Card", rotate: "-1deg" },
};

const PHRASE_POOL: PhraseRecord[] = (phrasesData as { phrases: PhraseRecord[] }).phrases.map((phrase) => ({
  id: phrase.id,
  type: phrase.type,
  text: phrase.text,
}));

function shuffledPhrases() {
  return [...PHRASE_POOL].sort(() => Math.random() - 0.5);
}

function getPhraseHeight(text: string) {
  return 120;
}

function getPhraseFontSize(text: string) {
  if (text.length > 112) return 15;
  if (text.length > 82) return 16;
  if (text.length > 58) return 18;
  return 20;
}

// ─── Test metrics ─────────────────────────────────────────────────────────────
// stateTimings[0] = time in waitingForAlert (start → alert)
// stateTimings[1] = time in envelopeAlert (alert → first click)
// stateTimings[2] = time in readingMessages (msg reveal done → second click)
// stateTimings[3] = time in finalIntroState (final msgs shown → Rec click)
interface TestMetrics {
  startTime: number;
  stateEntryTimes: number[];
  stateTimings: (number | null)[];
  validClicks: number;
  misclicks: number;
  prematureRecClicks: number;
  finalStateReached: boolean;
  recClicked: boolean;
  messagesSkipped: boolean;
  completionTime: number | null;
}

function createMetrics(): TestMetrics {
  const now = Date.now();
  return {
    startTime: now,
    stateEntryTimes: [now, 0, 0, 0],
    stateTimings: [null, null, null, null],
    validClicks: 0,
    misclicks: 0,
    prematureRecClicks: 0,
    finalStateReached: false,
    recClicked: false,
    messagesSkipped: false,
    completionTime: null,
  };
}

function fmt(ms: number | null): string {
  if (ms === null || ms === undefined) return "—";
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)}s`;
  return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
}

// ─── Scale hook ───────────────────────────────────────────────────────────────
function useCanvasScale(w: number, h: number) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const compute = () =>
      setScale(Math.min(window.innerWidth / w, window.innerHeight / h));
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [w, h]);
  return scale;
}

// ─── Static Figma components (unchanged) ─────────────────────────────────────

function Desk() {
  return (
    <div className="h-[50px] overflow-clip relative w-[661px]" data-name="desk">
      <div className="absolute bg-[#7c7a6e] h-[142.741px] left-[-3px] top-[1.65px] w-[1013.358px]" />
      <div className="absolute h-[142.308px] left-[-10.69px] top-[1.65px] w-[1021.044px]" data-name="image 97">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <img alt="" className="absolute max-w-none object-cover size-full" src={imgImage97} />
          <img alt="" className="absolute max-w-none object-cover size-full" src={imgImage97} />
        </div>
      </div>
    </div>
  );
}

function HeroMushroom() {
  return (
    <div className="absolute h-[541px] left-[57px] overflow-hidden top-[92.37px] w-[429px]" data-name="hero_mushroom">
      <img
        alt=""
        className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
        src={imgHeroMushroom}
      />
    </div>
  );
}

function Keyboard({
  onRecClick,
  onTipClick,
  recActive,
}: {
  onRecClick: (e: React.MouseEvent) => void;
  onTipClick: (e: React.MouseEvent) => void;
  recActive: boolean;
}) {
  return (
    <div
      className="absolute h-[196px] left-[-1px] overflow-clip top-[651px] w-[438px]"
      data-name="keyboard"
    >
      <div className="absolute h-[196px] left-0 top-0 w-[438px]" data-name="image 109">
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src={imgImage109}
        />
      </div>
      <div
        className="absolute h-[101px] left-[310px] overflow-clip top-[70px] w-[99px]"
        data-name="btns"
        onClick={onRecClick}
        style={{ cursor: recActive ? "pointer" : "default" }}
      >
        <div className="absolute h-[95.347px] left-[2.26px] top-[2.1px] w-[95.229px]">
          <img
            alt=""
            className="absolute block inset-0 max-w-none size-full"
            height="95.347"
            src={imgEllipse47}
            width="95.229"
          />
        </div>
        <div
          className="absolute h-[104.625px] left-[-4.88px] top-[-2.25px] w-[108.75px]"
          data-name="ChatGPT Image Apr 6, 2026, 01_19_05 PM 2"
        >
          <img
            alt=""
            className="absolute inset-0 max-w-none object-bottom pointer-events-none size-full"
            src={imgRecMic}
          />
        </div>
        <div
          className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col justify-center leading-[0] left-[30.88px] not-italic text-[#171717] text-[24px] top-[24.06px] tracking-[-0.48px] whitespace-nowrap"
          style={{ fontFamily: "'Gagalin', sans-serif" }}
        >
          <p className="leading-none">rec</p>
        </div>
      </div>
      <div
        aria-label="Show test results"
        className="absolute flex h-[27.116px] items-center justify-center left-[161.24px] top-[134.5px] w-[127.148px]"
        data-name="tip"
        onClick={onTipClick}
        role="button"
        style={{ cursor: "pointer" }}
        tabIndex={0}
      >
        <div className="flex-none rotate-[0.45deg]">
          <div className="bg-[#3d3d3d] h-[26.122px] opacity-15 relative w-[126.947px]" />
        </div>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[258.01px] top-[305.87px]">
      <div
        className="-translate-x-1/2 absolute h-[288.496px] left-[calc(50%+178.33px)] opacity-32 top-[346.78px] w-[676.954px]"
        data-name="ChatGPT Image Apr 6, 2026, 02_47_12 PM 1"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-bottom pointer-events-none size-full"
          src={imgChatGpt4712Pm1}
        />
      </div>
      <div
        className="absolute h-[354.904px] left-[258.01px] opacity-23 top-[305.87px] w-[668.234px]"
        data-name="image 98"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
          src={imgImage98}
        />
      </div>
    </div>
  );
}

function Interface() {
  return (
    <div className="absolute contents left-[-353.59px] top-[92.74px]" data-name="interface">
      <div
        className="absolute h-[308.84px] left-[-353.59px] opacity-28 top-[92.74px] w-[568.546px]"
        data-name="ChatGPT Image Apr 6, 2026, 02_56_34 PM 2"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-bottom pointer-events-none size-full"
          src={imgChatGpt25634Pm2}
        />
      </div>
      <Group />
      <div
        className="-translate-x-1/2 absolute bottom-[0.09px] h-[68.519px] left-[calc(50%-5.81px)] opacity-67 w-[886.832px]"
        data-name="ChatGPT Image Apr 6, 2026, 02_56_34 PM 1"
      >
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(237, 235, 223) 0%, rgb(237, 235, 223) 100%)",
            }}
          />
          <img
            alt=""
            className="absolute max-w-none object-bottom opacity-10 size-full"
            src={imgChatGpt25634Pm1}
          />
        </div>
      </div>
    </div>
  );
}

function Bg() {
  return (
    <div className="absolute h-[544px] left-[13px] overflow-clip top-[15px] w-[874px]" data-name="bg">
      <div
        className="absolute h-[544.037px] left-[0.38px] top-[-0.13px] w-[861.617px]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0, 0, 0, 0.11) 0%, rgba(0, 0, 0, 0.11) 100%), linear-gradient(90deg, rgb(237, 235, 223) 0%, rgb(237, 235, 223) 100%)",
        }}
        data-name="color"
      />
      <Interface />
    </div>
  );
}

function Screen({ subtractImg }: { subtractImg: string }) {
  return (
    <div className="absolute contents left-0 top-0" data-name="screen">
      <div className="absolute h-[574.542px] left-[0.78px] pointer-events-none top-[1.89px] w-[889.065px] z-[20]" data-name="Subtract">
        <img
          alt=""
          className="absolute block inset-0 max-w-none size-full"
          height="574.541"
          src={subtractImg}
          width="889.065"
        />
      </div>
      <div
        className="absolute h-[574.542px] left-0 pointer-events-none top-0 w-[887.257px] z-[20]"
        data-name="ChatGPT Image Apr 6, 2026, 02_31_25 PM 1"
      >
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <img alt="" className="absolute max-w-none object-bottom size-full" src={imgScreenGlass} />
          <img alt="" className="absolute max-w-none object-bottom size-full" src={imgScreenGlass} />
        </div>
      </div>
    </div>
  );
}

function MouseLeftClick() {
  return (
    <div className="absolute left-[793.22px] size-[32px] top-[474.87px]" data-name="MouseLeftClick">
      <svg
        className="absolute block inset-0 size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 32 32"
      >
        <g clipPath="url(#clip0_1_224)" id="MouseLeftClick">
          <g id="Vector" />
          <path d={svgPaths.p3cc11a70} fill="var(--fill-0, #171717)" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_224">
            <rect fill="white" height="32" width="32" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

// ─── Envelope with animation ──────────────────────────────────────────────────
// isAlert     — switches from Frame 1 (plain) to Frame 2 (badge) visual
// badgeIn     — triggers the CSS transition that reveals the badge
// isShaking   — applies the looping shake animation
// onEnvClick  — click handler active only during envelopeAlert phase
function MailIconAnimated({
  isAlert,
  badgeIn,
  isShaking,
  onEnvClick,
}: {
  isAlert: boolean;
  badgeIn: boolean;
  isShaking: boolean;
  onEnvClick?: (e: React.MouseEvent) => void;
}) {
  const shakeStyle: React.CSSProperties = isShaking
    ? { animation: "envelopeShakeLoop 1050ms ease-in-out infinite" }
    : {};

  if (isAlert) {
    return (
      <div
        className="absolute bottom-[428.06px] h-[52px] left-[67.22px] overflow-clip w-[64px]"
        data-name="icon_mail"
        onClick={onEnvClick}
        style={{ ...shakeStyle, cursor: onEnvClick ? "pointer" : "default" }}
      >
        <div className="absolute bg-white h-[43.176px] left-0 rounded-[4px] top-[6.59px] w-[57.735px]" />
        <div
          className="-translate-x-1/2 -translate-y-1/2 absolute h-[45.958px] left-[calc(50%-2px)] top-[calc(50%+2.27px)] w-[60px]"
          data-name="icon_mail"
        >
          <img
            alt=""
            className="absolute inset-0 max-w-none object-bottom pointer-events-none size-full"
            src={imgIconMailB}
          />
        </div>
        {/* Badge circle — animates in via CSS transition */}
        <div
          className="absolute left-[44px] size-[20px] top-0"
          style={{
            opacity: badgeIn ? 1 : 0,
            transform: badgeIn ? "scale(1)" : "scale(0.5)",
            transformOrigin: "center center",
            transition: "opacity 240ms ease-out, transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <svg className="absolute block inset-0 size-full" fill="none" viewBox="0 0 20 20">
            <circle cx="10" cy="10" fill="#E23939" id="Ellipse 51" r="10" />
          </svg>
        </div>
        {/* Badge number */}
        <div
          className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col justify-center leading-[0] left-[49.74px] not-italic text-[#171717] text-[16px] top-[10px] tracking-[-0.32px] w-[9.672px]"
          style={{
            fontFamily: HANDWRITE_FONT,
            opacity: badgeIn ? 1 : 0,
            transition: "opacity 240ms ease-out 60ms",
          }}
        >
          <p className="leading-none">2</p>
        </div>
      </div>
    );
  }

  // Default / plain state (Frame 1)
  return (
    <div
      className="absolute bottom-[431.06px] h-[46px] left-[67.22px] overflow-clip w-[58px]"
      data-name="icon_mail"
      style={shakeStyle}
    >
      <div className="absolute bg-white h-[43.176px] left-0 rounded-[4px] top-[1.31px] w-[57.735px]" />
      <div
        className="-translate-x-1/2 -translate-y-1/2 absolute h-[45.958px] left-1/2 top-[calc(50%-0.02px)] w-[58px]"
        data-name="icon_mail"
      >
        <img
          alt=""
          className="absolute inset-0 max-w-none object-bottom pointer-events-none size-full"
          src={imgIconMailA}
        />
      </div>
    </div>
  );
}

// ─── Monitor messages ─────────────────────────────────────────────────────────

// Frame 3/4 messages — revealed with staggered opacity+slide animation.
// Pass msg1In / msg2In as false → true to trigger each transition.
function MonitorMessages2({
  msg1In,
  msg2In,
}: {
  msg1In: boolean;
  msg2In: boolean;
}) {
  const msgStyle = (visible: boolean): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0px)" : "translateY(8px)",
    transition: `opacity ${MSG_ANIM_MS}ms ease-out, transform ${MSG_ANIM_MS}ms ease-out`,
  });

  return (
    <>
      <div
        className="absolute bg-white left-[143px] top-[97px] w-[544px]"
        style={msgStyle(msg1In)}
      >
        <div className="content-stretch flex items-center overflow-clip px-[20px] py-[16px] relative rounded-[inherit] size-full">
          <div
            className="[word-break:break-word] flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[20px] tracking-[-0.4px] w-[504px]"
            style={{ fontFamily: HANDWRITE_FONT }}
          >
            <p>
              <span className="leading-[1.55] text-[#e23939]">Привет!</span>
              <span className="leading-[1.55]">{" Давно не виделись. Или недавно...?"}</span>
            </p>
          </div>
        </div>
        <div aria-hidden className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none" />
      </div>
      <div
        className="absolute bg-white left-[143px] top-[180px] w-[544px]"
        style={msgStyle(msg2In)}
      >
        <div className="content-stretch flex items-center overflow-clip px-[20px] py-[16px] relative rounded-[inherit] size-full">
          <div
            className="[word-break:break-word] flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[20px] tracking-[-0.4px] w-[475.672px]"
            style={{ fontFamily: HANDWRITE_FONT }}
          >
            <p>
              <span className="leading-[1.55]">{"впрочем не важно. "}</span>
              <span className="leading-[1.55] text-[#e23939]">
                ты же не забыл как брать интервью?
              </span>
              <span className="leading-[1.55]">
                {" у тебя это здорово получалось, пока ты не слился как сучка в тот раз...."}
              </span>
            </p>
          </div>
        </div>
        <div aria-hidden className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none" />
      </div>
    </>
  );
}

// Frame 5 messages — instant, no animation.
function MonitorMessages3() {
  return (
    <div
      className="absolute content-stretch flex flex-col gap-[20px] items-start left-[143px] top-[97px] w-[544px]"
      data-name="message"
    >
      <div className="bg-white relative w-full">
        <div className="content-stretch flex items-center overflow-clip px-[20px] py-[16px] relative rounded-[inherit] size-full">
          <div
            className="[word-break:break-word] flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[20px] tracking-[-0.4px] w-[514.408px]"
            style={{ fontFamily: HANDWRITE_FONT }}
          >
            <p>
              <span className="leading-[1.55]">
                {"КСТАТИ, ПОКА ТЫ НЫКАЛСЯ, Я ТУТ ПОДКРУТИЛ КОЕ-ЧТО, "}
              </span>
              <span className="leading-[1.55] text-[#e23939]">
                Дорожка ТЕПЕРЬ режется сама, надо только выбрать САМЫЙ СОК
              </span>
            </p>
          </div>
        </div>
        <div aria-hidden className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none" />
      </div>
      <div className="bg-white relative w-[544px]">
        <div className="content-stretch flex items-center overflow-clip px-[20px] py-[16px] relative rounded-[inherit] size-full">
          <div
            className="[word-break:break-word] flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[20px] tracking-[-0.4px] w-[514.408px]"
            style={{ fontFamily: HANDWRITE_FONT }}
          >
            <p>
              <span className="leading-[1.55]">{"ГОСТЬ УЖЕ ЖДЕТ, ЖМИ кНОПКУ "}</span>
              <span className="leading-[1.55] text-[#e23939]">REC</span>
              <span className="leading-[1.55]">{" И ПОГНАЛИ"}</span>
            </p>
          </div>
        </div>
        <div aria-hidden className="absolute border-2 border-black border-solid inset-[-1px] pointer-events-none" />
      </div>
    </div>
  );
}

function PhraseCounter({ value, active }: { value: number; active: boolean }) {
  return (
    <div className="absolute content-stretch flex gap-[12px] items-center justify-center left-[29.22px] top-[28.5px]" data-name="counter">
      <div
        className="relative shrink-0 size-[40px]"
        data-name="indicator"
        style={{ animation: active ? "indicatorPulse 820ms ease-in-out infinite" : undefined }}
      >
        <div className="absolute inset-0 rounded-full bg-[#e23939]" />
        <div className="absolute inset-[3px] rounded-full border border-[#edebdf]" />
      </div>
      <div
        className="[word-break:break-word] flex flex-col h-[56.952px] justify-center leading-[0] not-italic relative shrink-0 text-[#e23939] text-[44px] tracking-[-0.88px] w-[92px]"
        style={{ fontFamily: "'Gagalin', sans-serif" }}
      >
        <p className="leading-none">{value}/{MAX_SELECTED_PHRASES}</p>
      </div>
    </div>
  );
}

function PhraseTile({
  phrase,
  onPick,
  onExpired,
}: {
  phrase: FallingPhrase;
  onPick: (phrase: FallingPhrase, e: React.MouseEvent) => void;
  onExpired: (instanceId: number) => void;
}) {
  return (
    <div
      className="absolute overflow-clip top-0"
      data-name="phrase"
      onAnimationEnd={() => onExpired(phrase.instanceId)}
      onClick={(e) => onPick(phrase, e)}
      style={{
        animation: `phraseFall ${phrase.duration}ms linear forwards`,
        cursor: "pointer",
        height: phrase.height,
        left: phrase.left,
        width: PHRASE_WIDTH,
        zIndex: 10,
      }}
    >
      <div
        className="absolute border border-black border-solid left-0 overflow-clip top-0 w-full"
        style={{ height: phrase.height }}
      >
        <div className="absolute bg-white inset-0" />
        <img
          alt=""
          className="absolute bottom-0 left-0 max-w-none object-bottom opacity-20 pointer-events-none w-[calc(100%-24px)]"
          src={imgPhraseEmptyBg}
          style={{ height: phrase.height }}
        />
        <div
          className="[word-break:break-word] absolute bottom-[14px] flex flex-col justify-center leading-[0] left-[20px] not-italic text-[#171717] top-[14px] tracking-[-0.4px] w-[329px]"
          style={{ fontFamily: HANDWRITE_FONT, fontSize: phrase.fontSize }}
        >
          <p className="leading-none">{phrase.text}</p>
        </div>
      </div>
      <div className="absolute bg-[#171717] right-0 top-0 w-[24px]" style={{ height: phrase.height }} />
      <div
        className="absolute flex items-center justify-center right-0 size-[24px] text-[#edebdf] text-[28px]"
        aria-hidden
        style={{ top: (phrase.height - 24) / 2 }}
      >
        <span className="block leading-none translate-y-[-1px]">+</span>
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  index,
  total,
}: {
  category: CardCategory;
  index: number;
  total: number;
}) {
  const card = CARD_IMAGES[category];
  const figmaLefts = [907.41, 1034.36, 1155.33];
  const left = total <= 3
    ? figmaLefts[index]
    : 760 + index * ((1470 - 760 - 152) / Math.max(1, total - 1));
  return (
    <div
      className="absolute h-[223px] overflow-clip top-[597px] w-[152px]"
      data-name={card.name}
      style={{
        left,
        transform: `rotate(${card.rotate})`,
        boxShadow: "0 12px 24px rgba(0,0,0,0.35)",
      }}
    >
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={card.src} />
    </div>
  );
}

function AwardedCards({ cards }: { cards: CardCategory[] }) {
  const visibleCards = cards.slice(0, MAX_SELECTED_PHRASES);
  return (
    <>
      {visibleCards.map((category, index) => (
        <CategoryCard
          key={`${category}-${index}`}
          category={category}
          index={index}
          total={visibleCards.length}
        />
      ))}
    </>
  );
}

function PhraseSelectionScene({
  activePhrases,
  selectedCount,
  onPhraseClick,
  onPhraseExpired,
}: {
  activePhrases: FallingPhrase[];
  selectedCount: number;
  onPhraseClick: (phrase: FallingPhrase, e: React.MouseEvent) => void;
  onPhraseExpired: (instanceId: number) => void;
}) {
  return (
    <>
      <div
        className="absolute h-[544px] left-0 overflow-hidden top-[15px] w-[887.257px] z-[10]"
        data-name="phrase_flow"
      >
        {activePhrases.map((phrase) => (
          <PhraseTile
            key={phrase.instanceId}
            phrase={phrase}
            onPick={onPhraseClick}
            onExpired={onPhraseExpired}
          />
        ))}
      </div>
      <div className="absolute inset-0 pointer-events-none z-[40]">
        <PhraseCounter value={selectedCount} active={selectedCount < MAX_SELECTED_PHRASES} />
      </div>
    </>
  );
}

// ─── Character phrase scrim ───────────────────────────────────────────────────
function CharacterPhrase({ phrase, visible }: { phrase: string; visible: boolean }) {
  return (
    <div
      className="-translate-x-1/2 -translate-y-1/2 absolute h-[92px] left-[calc(50%-0.45px)] overflow-clip top-[calc(50%+276px)] w-[1600px]"
      style={{ visibility: visible ? "visible" : "hidden" }}
      data-name="scrim"
    >
      <div
        className="-translate-x-1/2 -translate-y-1/2 absolute h-[92px] left-1/2 top-1/2 w-[1600px]"
        style={{
          filter: "blur(8.25px)",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 1600 92' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%25' width='100%25' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(80 0 0 73.549 800 46)'><stop stop-color='rgba(0,0,0,1)' offset='0.73097'/><stop stop-color='rgba(6,6,6,0.9375)' offset='0.74779'/><stop stop-color='rgba(13,13,13,0.875)' offset='0.7646'/><stop stop-color='rgba(26,26,26,0.75)' offset='0.79823'/><stop stop-color='rgba(51,51,51,0.5)' offset='0.86549'/><stop stop-color='rgba(102,102,102,0)' offset='1'/></radialGradient></defs></svg>\")",
        }}
        data-name="monolog_scrim"
      />
      <div
        className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col justify-center leading-[0] left-1/2 not-italic text-[#edebdf] text-[24px] text-center top-[calc(50%+0.5px)] tracking-[-0.48px] whitespace-nowrap"
        style={{ fontFamily: HANDWRITE_FONT }}
      >
        <p className="leading-[1.55]">{phrase}</p>
      </div>
    </div>
  );
}

// ─── Test summary overlay ─────────────────────────────────────────────────────
function SummaryOverlay({
  metrics,
  onRestart,
}: {
  metrics: TestMetrics;
  onRestart: () => void;
}) {
  const elapsed =
    metrics.completionTime !== null
      ? metrics.completionTime - metrics.startTime
      : Date.now() - metrics.startTime;

  const rows: [string, string, boolean?][] = [
    ["Intro completed", metrics.finalStateReached ? "Yes" : "No", !metrics.finalStateReached],
    ["Rec clicked", metrics.recClicked ? "Yes" : "No", !metrics.recClicked],
    ["Total completion time", fmt(elapsed)],
    ["Valid monitor clicks", String(metrics.validClicks)],
    ["Misclick count", String(metrics.misclicks)],
    ["Premature Rec clicks", String(metrics.prematureRecClicks)],
    ["Messages skipped", metrics.messagesSkipped ? "Yes" : "No", metrics.messagesSkipped],
  ];

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ zIndex: 100, background: "rgba(0,0,0,0.72)" }}
    >
      <div
        style={{
          width: 560,
          background: "rgb(237,235,223)",
          border: "2px solid #171717",
          padding: "32px 36px",
        }}
      >
        <h2
          style={{
            fontFamily: HANDWRITE_FONT,
            fontSize: 26,
            color: "#171717",
            letterSpacing: "-0.52px",
            marginBottom: 20,
          }}
        >
          РЕЗУЛЬТАТЫ ТЕСТА
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {rows.map(([label, value, isNeg]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(23,23,23,0.2)",
                paddingBottom: 6,
              }}
            >
              <span style={{ fontFamily: HANDWRITE_FONT, fontSize: 16, color: "#171717" }}>
                {label}
              </span>
              <span
                style={{
                  fontFamily: HANDWRITE_FONT,
                  fontSize: 16,
                  color: isNeg ? "#e23939" : "#171717",
                  fontWeight: 600,
                }}
              >
                {value}
              </span>
            </div>
          ))}

          <div style={{ marginTop: 8 }}>
            <p style={{ fontFamily: HANDWRITE_FONT, fontSize: 15, color: "#171717", marginBottom: 6 }}>
              Time per state:
            </p>
            {metrics.stateTimings.map((t, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  paddingLeft: 16,
                  paddingBottom: 4,
                  borderBottom: "1px solid rgba(23,23,23,0.1)",
                }}
              >
                <span style={{ fontFamily: HANDWRITE_FONT, fontSize: 14, color: "#555" }}>
                  State {i + 1}
                </span>
                <span style={{ fontFamily: HANDWRITE_FONT, fontSize: 14, color: "#171717" }}>
                  {fmt(t)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onRestart}
          style={{
            marginTop: 24,
            width: "100%",
            padding: "12px 0",
            fontFamily: HANDWRITE_FONT,
            fontSize: 18,
            color: "#171717",
            background: "white",
            border: "2px solid #171717",
            cursor: "pointer",
            letterSpacing: "-0.36px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#f0eed8";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "white";
          }}
        >
          Restart test
        </button>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const scale = useCanvasScale(1600, 900);

  // ── Interaction state ──────────────────────────────────────────────────────
  const [phase, setPhase] = useState<IntroPhase>("waitingForAlert");

  // ── Envelope animation state ───────────────────────────────────────────────
  const [envelopeShaking, setEnvelopeShaking] = useState(false);
  const [badgeIn, setBadgeIn] = useState(false); // triggers badge CSS transition

  // ── Message reveal state ───────────────────────────────────────────────────
  const [msg1In, setMsg1In] = useState(false);
  const [msg2In, setMsg2In] = useState(false);
  const [showFinalMessages, setShowFinalMessages] = useState(false);

  // ── Phrase + summary ───────────────────────────────────────────────────────
  const [phraseVisible, setPhraseVisible] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [metrics, setMetrics] = useState<TestMetrics>(createMetrics);
  const [activePhrases, setActivePhrases] = useState<FallingPhrase[]>([]);
  const [selectedPhraseCount, setSelectedPhraseCount] = useState(0);
  const [awardedCards, setAwardedCards] = useState<CardCategory[]>([]);

  // Multiple timers managed via a ref array
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const phraseDeckRef = useRef<PhraseRecord[]>(shuffledPhrases());
  const phraseInstanceRef = useRef(0);
  const phraseLaneRef = useRef(0);
  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);
  const after = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms);
    timersRef.current.push(id);
  }, []);
  const spawnPhrase = useCallback(() => {
    setActivePhrases((current) => {
      if (current.length >= 2) return current;
      if (phraseDeckRef.current.length === 0) {
        phraseDeckRef.current = shuffledPhrases();
      }

      const activeTexts = new Set(current.map((phrase) => phrase.text));
      let next = phraseDeckRef.current.pop();
      let guard = 0;
      while (next && activeTexts.has(next.text) && guard < phraseDeckRef.current.length) {
        phraseDeckRef.current.unshift(next);
        next = phraseDeckRef.current.pop();
        guard += 1;
      }
      if (!next) return current;

      const occupiedLanes = new Set(current.map((phrase) => phrase.left));
      let laneIndex = phraseLaneRef.current % PHRASE_LANES.length;
      if (occupiedLanes.has(PHRASE_LANES[laneIndex])) {
        laneIndex = (laneIndex + 1) % PHRASE_LANES.length;
      }
      phraseLaneRef.current = laneIndex + 1;

      phraseInstanceRef.current += 1;
      return [
        ...current,
        {
          ...next,
          instanceId: phraseInstanceRef.current,
          left: PHRASE_LANES[laneIndex],
          duration: PHRASE_FALL_MS,
          height: getPhraseHeight(next.text),
          fontSize: getPhraseFontSize(next.text),
        },
      ];
    });
  }, []);

  // ── Derived visual values ──────────────────────────────────────────────────
  const isAlertIcon   = phase === "envelopeAlert";
  const isPhraseSelection = phase === "phraseSelection";
  const subtractImg   = showFinalMessages      ? imgSubtractB
                      : isAlertIcon            ? imgSubtractB
                      : imgSubtractA;
  const recActive     = phase === "finalIntroState";
  // screen_firststage is only pointer-active during readingMessages
  const screenCursor  = phase === "readingMessages" ? "pointer" : "default";
  const showMessages1 = phase === "revealingInitialMessages" || phase === "readingMessages";

  // ── Initial alert sequence (mount only) ───────────────────────────────────
  useEffect(() => {
    const id = setTimeout(() => {
      const now = Date.now();
      // Record time spent in waitingForAlert
      setMetrics(prev => {
        const timings = [...prev.stateTimings];
        timings[0] = now - prev.stateEntryTimes[0];
        const entryTimes = [...prev.stateEntryTimes];
        entryTimes[1] = now;
        return { ...prev, stateTimings: timings, stateEntryTimes: entryTimes };
      });
      setPhase("envelopeAlert");
      setEnvelopeShaking(true);
      // Small delay so the badge container renders at opacity:0 before transitioning
      setTimeout(() => setBadgeIn(true), 50);
    }, ALERT_DELAY_MS);
    return () => {
      clearTimeout(id);
      clearTimers();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (phase !== "phraseSelection" || selectedPhraseCount >= MAX_SELECTED_PHRASES) return;

    spawnPhrase();
    const id = setInterval(spawnPhrase, PHRASE_SPAWN_MS);
    return () => clearInterval(id);
  }, [phase, selectedPhraseCount, spawnPhrase]);

  useEffect(() => {
    if (phase === "phraseSelection" && selectedPhraseCount >= MAX_SELECTED_PHRASES) {
      setActivePhrases([]);
    }
  }, [phase, selectedPhraseCount]);

  // ── Envelope click (envelopeAlert only) ───────────────────────────────────
  const handleEnvelopeClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation(); // prevent bubbling to screen_firststage / global
      if (phase !== "envelopeAlert") return;

      const now = Date.now();
      setEnvelopeShaking(false);
      setPhase("revealingInitialMessages");

      setMetrics(prev => {
        const timings = [...prev.stateTimings];
        timings[1] = now - (prev.stateEntryTimes[1] || now);
        return { ...prev, validClicks: prev.validClicks + 1, stateTimings: timings };
      });

      after(() => setMsg1In(true), MSG1_DELAY_MS);
      after(() => setMsg2In(true), MSG2_DELAY_MS);

      after(() => {
        const readingNow = Date.now();
        setPhase("readingMessages");
        setMetrics(prev => {
          const entryTimes = [...prev.stateEntryTimes];
          entryTimes[2] = readingNow;
          return { ...prev, stateEntryTimes: entryTimes };
        });
        after(() => setPhraseVisible(true), PHRASE_DELAY_MS);
      }, REVEAL_TOTAL_MS);
    },
    [phase, after]
  );

  // ── screen_firststage click (readingMessages and later) ────────────────────
  // During envelopeAlert, clicks NOT on the envelope bubble through to global
  // (counted as misclicks). No stopPropagation is called in that case.
  const handleScreenClick = useCallback(
    (e: React.MouseEvent) => {
      // During envelopeAlert the envelope handles its own click.
      // Let any other click on screen_firststage bubble to global (misclick).
      if (phase === "envelopeAlert") return;

      e.stopPropagation();

      switch (phase) {
        case "waitingForAlert":
        case "revealingInitialMessages":
        case "finalIntroState":
        case "phraseSelection":
        case "testCompleted":
          return;

        case "readingMessages": {
          const now = Date.now();
          setPhraseVisible(false);
          setShowFinalMessages(true);
          setPhase("finalIntroState");

          setMetrics(prev => {
            const timings = [...prev.stateTimings];
            timings[2] = now - (prev.stateEntryTimes[2] || now);
            const entryTimes = [...prev.stateEntryTimes];
            entryTimes[3] = now;
            return {
              ...prev,
              validClicks: prev.validClicks + 1,
              finalStateReached: true,
              stateTimings: timings,
              stateEntryTimes: entryTimes,
            };
          });

          return;
        }
      }
    },
    [phase]
  );

  // ── Rec button click ───────────────────────────────────────────────────────
  const handleRecClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (phase === "testCompleted" || phase === "phraseSelection") return;

      if (phase !== "finalIntroState" && phase !== "testCompleted") {
        setMetrics(prev => ({ ...prev, prematureRecClicks: prev.prematureRecClicks + 1 }));
        return;
      }

      const now = Date.now();
      setActivePhrases([]);
      setSelectedPhraseCount(0);
      setAwardedCards([]);
      phraseDeckRef.current = shuffledPhrases();
      phraseLaneRef.current = 0;
      setPhase("phraseSelection");
      setMetrics(prev => {
        const timings = [...prev.stateTimings];
        timings[3] = now - (prev.stateEntryTimes[3] || now);
        return {
          ...prev,
          recClicked: true,
          stateTimings: timings,
        };
      });
    },
    [phase]
  );

  // ── Tip click ──────────────────────────────────────────────────────────────
  const handleTipClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (phase === "testCompleted") return;

      const now = Date.now();
      clearTimers();
      setPhase("testCompleted");
      setMetrics(prev => {
        const timings = [...prev.stateTimings];
        if (phase === "waitingForAlert") timings[0] = now - prev.stateEntryTimes[0];
        if (phase === "envelopeAlert") timings[1] = now - (prev.stateEntryTimes[1] || now);
        if (phase === "readingMessages") timings[2] = now - (prev.stateEntryTimes[2] || now);
        if (phase === "finalIntroState") timings[3] = now - (prev.stateEntryTimes[3] || now);
        if (phase === "phraseSelection" && timings[3] === null) {
          timings[3] = now - (prev.stateEntryTimes[3] || now);
        }
        return {
          ...prev,
          finalStateReached: prev.finalStateReached || phase === "finalIntroState",
          messagesSkipped:
            prev.messagesSkipped ||
            phase === "waitingForAlert" ||
            phase === "envelopeAlert" ||
            phase === "revealingInitialMessages" ||
            phase === "readingMessages",
          completionTime: now,
          stateTimings: timings,
        };
      });
      setShowSummary(true);
    },
    [phase, clearTimers]
  );

  const handlePhraseExpired = useCallback((instanceId: number) => {
    setActivePhrases((current) => current.filter((phrase) => phrase.instanceId !== instanceId));
  }, []);

  const handlePhraseClick = useCallback((phrase: FallingPhrase, e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhraseCount >= MAX_SELECTED_PHRASES) return;

    setActivePhrases((current) => current.filter((item) => item.instanceId !== phrase.instanceId));
    setSelectedPhraseCount((current) => Math.min(MAX_SELECTED_PHRASES, current + 1));

    if (phrase.type !== "NONE") {
      setAwardedCards((cards) => [...cards, phrase.type as CardCategory]);
    }
  }, [selectedPhraseCount]);

  // ── Global misclick ────────────────────────────────────────────────────────
  const handleGlobalClick = useCallback(() => {
    if (phase === "testCompleted" || showSummary) return;
    setMetrics(prev => ({ ...prev, misclicks: prev.misclicks + 1 }));
  }, [phase, showSummary]);

  // ── Restart ────────────────────────────────────────────────────────────────
  const handleRestart = useCallback(() => {
    clearTimers();
    setPhase("waitingForAlert");
    setEnvelopeShaking(false);
    setBadgeIn(false);
    setMsg1In(false);
    setMsg2In(false);
    setShowFinalMessages(false);
    setPhraseVisible(false);
    setShowSummary(false);
    setActivePhrases([]);
    setSelectedPhraseCount(0);
    setAwardedCards([]);
    phraseDeckRef.current = shuffledPhrases();
    phraseLaneRef.current = 0;
    setMetrics(createMetrics());

    const id = setTimeout(() => {
      const now = Date.now();
      setMetrics(prev => {
        const timings = [...prev.stateTimings];
        timings[0] = now - prev.stateEntryTimes[0];
        const entryTimes = [...prev.stateEntryTimes];
        entryTimes[1] = now;
        return { ...prev, stateTimings: timings, stateEntryTimes: entryTimes };
      });
      setPhase("envelopeAlert");
      setEnvelopeShaking(true);
      setTimeout(() => setBadgeIn(true), 50);
    }, ALERT_DELAY_MS);
    timersRef.current.push(id);
  }, [clearTimers]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#0a0a0a" }}>
      {/* Inject shake keyframes once */}
      <style dangerouslySetInnerHTML={{ __html: ANIMATION_CSS }} />

      {/* 1600×900 canvas — absolutely centred, scaled to fit viewport */}
      <div
        style={{
          position: "absolute",
          width: 1600,
          height: 900,
          top: "50%",
          left: "50%",
          transformOrigin: "center center",
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
        className="bg-white"
        onClick={handleGlobalClick}
      >
        {/* Background */}
        <div className="absolute h-[900px] left-[-0.42px] top-0 w-[1600px]" data-name="bg">
          <img
            alt=""
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            src={imgBg}
          />
        </div>

        {/* Left fade overlay */}
        <div className="absolute h-[346.838px] left-0 top-[64px] w-[661px]" data-name="fade">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img
              alt=""
              className="absolute h-[102.06%] left-0 max-w-none top-[-2.06%] w-[104.01%]"
              src={imgFade}
            />
          </div>
        </div>

        {isPhraseSelection && <HeroMushroom />}

        {/* Desk shelf */}
        <div className="absolute flex h-[50px] items-center justify-center left-[-3px] top-[586px] w-[661px]">
          <div className="-scale-y-100 flex-none rotate-180">
            <Desk />
          </div>
        </div>

        {/* Keyboard + Rec */}
        <Keyboard
          onRecClick={handleRecClick}
          onTipClick={handleTipClick}
          recActive={recActive}
        />

        {/* Monitor — screen_firststage */}
        <div
          className="-translate-y-1/2 absolute h-[574.542px] left-[661.78px] overflow-clip top-[calc(50%-100.73px)] w-[887.257px]"
          data-name="screen_firststage"
          onClick={handleScreenClick}
          style={{ cursor: screenCursor }}
        >
          <Bg />
          <Screen subtractImg={subtractImg} />

          {!isPhraseSelection && (
            <MailIconAnimated
              isAlert={isAlertIcon}
              badgeIn={badgeIn}
              isShaking={envelopeShaking}
              onEnvClick={phase === "envelopeAlert" ? handleEnvelopeClick : undefined}
            />
          )}

          <MouseLeftClick />

          {/* Initial messages — animated reveal */}
          {showMessages1 && <MonitorMessages2 msg1In={msg1In} msg2In={msg2In} />}

          {/* Final messages — instant */}
          {showFinalMessages && !isPhraseSelection && <MonitorMessages3 />}
          {isPhraseSelection && (
            <PhraseSelectionScene
              activePhrases={activePhrases}
              selectedCount={selectedPhraseCount}
              onPhraseClick={handlePhraseClick}
              onPhraseExpired={handlePhraseExpired}
            />
          )}
        </div>

        {isPhraseSelection && <AwardedCards cards={awardedCards} />}

        {/* Character phrase scrim */}
        <CharacterPhrase phrase={PHRASE_READING} visible={phraseVisible} />

        {/* Test summary */}
        {showSummary && (
          <SummaryOverlay metrics={metrics} onRestart={handleRestart} />
        )}
      </div>
    </div>
  );
}
