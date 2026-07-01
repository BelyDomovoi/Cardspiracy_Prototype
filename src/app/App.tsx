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
import audioEnvelopeNotification from "../imports/envelope_notification.mp3";
import imgSecondStageBackgroundFull from "../imports/second_stage_background_full.png";
import imgSecondStageKeyboard from "../imports/second_stage_keyboard.png";
import imgSecondStageInterfaceLeft from "../imports/second_stage_interface_left.png";
import imgSecondStageWaveWindow from "../imports/second_stage_wave_window.png";
import imgSecondStageInterfaceRight from "../imports/second_stage_interface_right.png";
import imgSecondStageBottomLeft from "../imports/second_stage_bottom_left.png";
import imgSecondStageBottomRight from "../imports/second_stage_bottom_right.png";
import imgSecondStageSubtract from "../imports/second_stage_subtract.png";
import imgSecondStageDownloadIcon from "../imports/second_stage_download_icon.svg";
import imgGuideImage110 from "../imports/guide_image_110.png";
import imgGuideImage111 from "../imports/guide_image_111.png";
import imgGuideArrowSmall from "../imports/guide_arrow_small.png";
import imgGuideArrowLarge from "../imports/guide_arrow_large.png";
import imgGuideEllipse52 from "../imports/guide_ellipse_52.png";
import imgGuideEllipse53 from "../imports/guide_ellipse_53.png";
import imgGuidePlus from "../imports/guide_plus.png";
import imgGuideX from "../imports/guide_x.png";
import imgGuidePlusCard from "../imports/guide_plus_card.png";
import imgGuidePlusHype from "../imports/guide_plus_hype.png";
import imgGuideFirst from "../imports/guide_first.png";
import imgGuideSecond from "../imports/guide_second.png";
import imgSecondStageGuideScreen from "../imports/second_stage_guide_screen.png";
import imgFolderGovernment from "../imports/folder_government.png";
import imgFolderHollowEarth from "../imports/folder_hollow_earth.png";
import imgFolderOtherworldly from "../imports/folder_otherworldly.png";
import imgZoneAddEmpty from "../imports/zone_add_empty.png";
import imgZoneAddGovernment from "../imports/zone_add_government.png";
import imgZoneAddHollowEarth from "../imports/zone_add_hollow_earth.png";
import imgZoneAddOtherworldly from "../imports/zone_add_otherworldly.png";
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
  8%   { opacity: 1; }
  92%  { opacity: 1; }
  100% { transform: translateY(690px); opacity: 0; }
}
@keyframes indicatorPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.32; transform: scale(0.86); }
}
@keyframes cardDealToTable {
  0% {
    opacity: 0;
    transform: translate3d(34px, -150px, 0) scale(1.18);
  }
  58% {
    opacity: 1;
    transform: translate3d(0, 10px, 0) scale(0.98);
  }
  78% {
    transform: translate3d(0, -4px, 0) scale(1.01);
  }
  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
}
@keyframes firstStageFadeOut {
  0% { opacity: 1; }
  100% { opacity: 0; }
}
@keyframes secondStageFadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
@keyframes folderBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.46; }
}
.second-stage-preview-card {
  transform: translateY(0) scale(1);
  transform-origin: bottom center;
  transition: transform 180ms ease-out, filter 180ms ease-out;
  z-index: 24;
}
.second-stage-preview-card:hover {
  transform: translateY(-96px) scale(1.45);
  filter: drop-shadow(0 0 18px rgba(226, 57, 57, 0.9));
  z-index: 80;
}
`;

// ─── Interaction state machine ────────────────────────────────────────────────
type IntroPhase =
  | "waitingForAlert"          // envelope default, screen_firststage disabled
  | "envelopeAlert"            // envelope alert + shake, waiting for first click
  | "revealingInitialMessages" // messages animating in, screen_firststage disabled
  | "readingMessages"          // messages visible, screen_firststage enabled
  | "finalIntroState"          // Frame 5 messages visible, Rec active
  | "gameIntroScrim"           // Rec clicked, waiting for scrim click before game starts
  | "phraseSelection"          // phrase picking game after Rec
  | "gameOutroScrim"           // 10 selections done, waiting for scrim click
  | "gameComplete"             // outro scrim dismissed, cards remain visible
  | "secondStageAlert"         // second scene, envelope alert visible
  | "secondStageMessages"      // second scene messages visible after envelope click
  | "secondStageGame"          // second scene card/folder game
  | "testCompleted";           // summary shown

// ─── Animation timing constants ───────────────────────────────────────────────
const ALERT_DELAY_MS   = 800;  // delay before envelope switches to alert
const PHRASE_DELAY_MS  = 800;  // delay before character phrase appears
const MSG1_DELAY_MS    = 0;    // first message appears immediately on click
const MSG2_DELAY_MS    = 200;  // second message stagger
const MSG_ANIM_MS      = 260;  // duration of each message fade+slide transition
const REVEAL_TOTAL_MS  = MSG2_DELAY_MS + MSG_ANIM_MS + 30; // ≈490ms buffer
const SCENE_FADE_MS    = 520;

const HANDWRITE_FONT   = "'SNFBSTRD handwrite', sans-serif";
const PHRASE_READING   = "может и рад бы забыть";
const GAME_INTRO_SCRIM = "места под материал маловато....";
const GAME_OUTRO_SCRIM_LINES = [
  "фух, этот жуткий тип ушел",
  "теперь можно спокойно смонтировать материал",
];
const SECOND_STAGE_MESSAGE_1 = {
  redStart: "Как прошло? ",
  black: "подумал, что ПОСЛЕ ДОЛГОГО ПЕРЕРЫВА может ВЫЙТИ тухловато, поэтому подкину тебе ",
  redMiddle: "темок, которые можно ",
  redEnd: " с твоими",
  blackEnd: "свести",
};
const SECOND_STAGE_MESSAGE_2 = "НО ЭТО ПЕРВЫЙ И ПОСЛЕДНИЙ РАЗ!!!";
const TYPEWRITER_MS_PER_CHAR = 34;
const MAX_SELECTED_PHRASES = 10;
const PHRASE_FALL_MS = 6500;
const PHRASE_PATH_PX = 880;
const PHRASE_MIN_GAP = 120;
const PHRASE_HEIGHT = 120;
const PHRASE_SAFE_SPAWN_MS = Math.ceil(((PHRASE_HEIGHT + PHRASE_MIN_GAP) / PHRASE_PATH_PX) * PHRASE_FALL_MS);
const PHRASE_SPAWN_MS = 200;
const PHRASE_MAX_ACTIVE = Math.ceil(PHRASE_FALL_MS / PHRASE_SAFE_SPAWN_MS) + 1;
const PHRASE_WIDTH = 400;
const PHRASE_LANES = [63.77, 424.43];
const SECOND_STAGE_GAME_SECONDS = 45;
const HYPE_MAX = 10;
const HYPE_START = 5;
const HYPE_WIN_THRESHOLD = HYPE_MAX * 0.5;
const HYPE_GAIN = 1;
const HYPE_DECAY = 0.08;
const FOLDER_LIFETIME_MS = 7600;
const FOLDER_BLINK_MS = 2600;
const ADD_CARD_REPLACE_MS = 2200;
const SECOND_STAGE_CARD_WIDTH = 130;
const SECOND_STAGE_CARD_HEIGHT = 190;
const SECOND_STAGE_CARD_GAP = 82;
const MAX_VISIBLE_FOLDERS = 2;
const FOLDER_STAGE_LEFT = 184.97;
const FOLDER_WITH_ADD_SLOT_WIDTH = 325;
const FOLDER_SCREEN_WIDTH = 1185;
const FOLDER_SCREEN_RIGHT_GAP = 56;

type CardCategory = "GOVERNMENT" | "HOLLOW_EARTH" | "OTHERWORLDLY";
type PhraseType = CardCategory | "NONE";
type SecondStageResult = "WIN" | "LOSE" | null;
type DragPosition = { x: number; y: number };

interface SecondStageFolder {
  id: number;
  category: CardCategory;
  state: "empty" | "waiting" | "hidden";
  mainCard?: CardCategory;
  addedCard?: CardCategory;
  expiresAt: number;
  blinkAt: number;
  left: number;
  top: number;
}

interface PhraseRecord {
  id: number;
  type: PhraseType;
  text: string;
}

interface FallingPhrase extends PhraseRecord {
  instanceId: number;
  startedAt: number;
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

const FOLDER_IMAGES: Record<CardCategory, { src: string; zone: string; name: string; label: string }> = {
  GOVERNMENT: {
    src: imgFolderGovernment,
    zone: imgZoneAddGovernment,
    name: "Goverment_Folder",
    label: "правительство",
  },
  HOLLOW_EARTH: {
    src: imgFolderHollowEarth,
    zone: imgZoneAddHollowEarth,
    name: "HollowEarth_Folder",
    label: "полая земля",
  },
  OTHERWORLDLY: {
    src: imgFolderOtherworldly,
    zone: imgZoneAddOtherworldly,
    name: "OtherWorld_Folder",
    label: "потустороннее",
  },
};

const CATEGORY_ORDER: CardCategory[] = ["GOVERNMENT", "OTHERWORLDLY", "HOLLOW_EARTH"];
const FOLDER_POSITIONS = [
  { left: 24, top: 12 },
  {
    left: FOLDER_SCREEN_WIDTH - FOLDER_STAGE_LEFT - FOLDER_WITH_ADD_SLOT_WIDTH - FOLDER_SCREEN_RIGHT_GAP,
    top: 98,
  },
];

const PHRASE_POOL: PhraseRecord[] = (phrasesData as { phrases: PhraseRecord[] }).phrases.map((phrase) => ({
  id: phrase.id,
  type: phrase.type,
  text: phrase.text,
}));

function shuffledPhrases() {
  return [...PHRASE_POOL].sort(() => Math.random() - 0.5);
}

function getPhraseHeight(text: string) {
  return PHRASE_HEIGHT;
}

function getPhraseFontSize(text: string) {
  if (text.length > 112) return 15;
  if (text.length > 82) return 16;
  if (text.length > 58) return 18;
  return 20;
}

function randomCardCategory(): CardCategory {
  return CATEGORY_ORDER[Math.floor(Math.random() * CATEGORY_ORDER.length)];
}

function randomFolderLifetime() {
  return FOLDER_LIFETIME_MS + Math.floor(Math.random() * 3600);
}

function shuffledFolderPositions() {
  return [...FOLDER_POSITIONS].sort(() => Math.random() - 0.5);
}

function folderPositionKey(position: { left: number; top: number }) {
  return `${position.left}:${position.top}`;
}

function pickFreeFolderPosition(folders: SecondStageFolder[], fallback: { left: number; top: number }) {
  const occupied = new Set(
    folders
      .filter((folder) => folder.state !== "hidden")
      .map((folder) => folderPositionKey(folder))
  );
  const freePositions = FOLDER_POSITIONS.filter((position) => !occupied.has(folderPositionKey(position)));
  if (freePositions.length === 0) return fallback;
  return freePositions[Math.floor(Math.random() * freePositions.length)];
}

function createSecondStageFolders(now = Date.now()): SecondStageFolder[] {
  const positions = shuffledFolderPositions();
  return [...CATEGORY_ORDER].sort(() => Math.random() - 0.5).map((category, index) => {
    const lifetime = randomFolderLifetime();
    const position = positions[index % positions.length];
    const visible = index < MAX_VISIBLE_FOLDERS;
    return {
      id: now + index,
      category,
      state: visible ? "empty" : "hidden",
      expiresAt: visible ? now + lifetime : now + 900 + Math.floor(Math.random() * 900),
      blinkAt: visible ? now + lifetime - FOLDER_BLINK_MS : Number.POSITIVE_INFINITY,
      left: position.left,
      top: position.top,
    };
  });
}

function refreshSecondStageFolder(
  folder: SecondStageFolder,
  now = Date.now(),
  position = FOLDER_POSITIONS[Math.floor(Math.random() * FOLDER_POSITIONS.length)]
): SecondStageFolder {
  const lifetime = randomFolderLifetime();
  return {
    id: now + Math.random(),
    category: randomCardCategory(),
    state: "empty",
    mainCard: undefined,
    addedCard: undefined,
    expiresAt: now + lifetime,
    blinkAt: now + lifetime - FOLDER_BLINK_MS,
    left: position.left,
    top: position.top,
  };
}

function hideSecondStageFolder(folder: SecondStageFolder, now = Date.now()): SecondStageFolder {
  return {
    ...folder,
    state: "hidden",
    mainCard: undefined,
    addedCard: undefined,
    expiresAt: now + 850 + Math.floor(Math.random() * 900),
    blinkAt: Number.POSITIVE_INFINITY,
  };
}

function resolveSecondStageCombo(main: CardCategory, added: CardCategory) {
  if (main === "OTHERWORLDLY" && added === "HOLLOW_EARTH") return { hype: HYPE_GAIN };
  if (main === "OTHERWORLDLY" && added === "GOVERNMENT") return { hype: HYPE_GAIN };
  if (main === "GOVERNMENT" && added === "OTHERWORLDLY") return { card: randomCardCategory() };
  if (main === "GOVERNMENT" && added === "HOLLOW_EARTH") return { hype: HYPE_GAIN };
  if (main === "HOLLOW_EARTH" && added === "GOVERNMENT") return { card: "HOLLOW_EARTH" as CardCategory };
  if (main === "HOLLOW_EARTH" && added === "OTHERWORLDLY") return { card: "HOLLOW_EARTH" as CardCategory };
  return {};
}

function getSecondStageResult(hype: number): Exclude<SecondStageResult, null> {
  return hype > HYPE_WIN_THRESHOLD ? "WIN" : "LOSE";
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

function GameBg() {
  return (
    <div className="absolute h-[544px] left-[13.22px] overflow-clip top-[15px] w-[862px]" data-name="bg">
      <div
        className="absolute h-[544.037px] left-[0.16px] top-[-0.13px] w-[861.617px]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0, 0, 0, 0.11) 0%, rgba(0, 0, 0, 0.11) 100%), linear-gradient(90deg, rgb(237, 235, 223) 0%, rgb(237, 235, 223) 100%)",
        }}
        data-name="color"
      />
      <div className="absolute contents left-[-66.72px] top-[72.16px]" data-name="interface">
        <div
          className="absolute h-[472.253px] left-[-66.72px] opacity-23 top-[72.16px] w-[996.417px]"
          data-name="image 98"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <img alt="" className="absolute h-[112.06%] left-0 max-w-none top-[-12.06%] w-full" src={imgImage98} />
          </div>
        </div>
        <div
          className="-translate-x-1/2 absolute bottom-[-0.41px] h-[68.519px] left-[calc(50%-0.63px)] opacity-67 w-[886.832px]"
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
            <img alt="" className="absolute max-w-none object-bottom opacity-10 size-full" src={imgChatGpt25634Pm1} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Bg({ game }: { game?: boolean }) {
  if (game) return <GameBg />;

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
  className,
  isAlert,
  badgeIn,
  isShaking,
  onEnvClick,
}: {
  className?: string;
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
        className={className || "absolute bottom-[428.06px] h-[52px] left-[67.22px] overflow-clip w-[64px]"}
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
      className={className || "absolute bottom-[431.06px] h-[46px] left-[67.22px] overflow-clip w-[58px]"}
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
      className="absolute h-[223px] top-[597px] w-[152px]"
      data-name={card.name}
      style={{
        animation: "cardDealToTable 620ms cubic-bezier(0.19, 1, 0.22, 1) both",
        left,
        transformOrigin: "50% 100%",
      }}
    >
      <div
        className="absolute inset-0 overflow-clip"
        style={{
          boxShadow: "0 12px 24px rgba(0,0,0,0.35)",
          transform: `rotate(${card.rotate})`,
          transformOrigin: "50% 100%",
        }}
      >
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={card.src} />
      </div>
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

function SecondStageCards({ cards }: { cards: CardCategory[] }) {
  const visibleCards = cards.slice(0, MAX_SELECTED_PHRASES);
  return (
    <>
      {visibleCards.map((category, index) => {
        const card = CARD_IMAGES[category];
        return (
          <div
            className="absolute h-[190px] top-[630px] w-[130px] second-stage-preview-card"
            data-name={card.name}
            key={`second-${category}-${index}`}
            style={{ left: 528.83 + index * SECOND_STAGE_CARD_GAP }}
          >
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={card.src} />
          </div>
        );
      })}
    </>
  );
}

function SecondStageKeyboard({
  onPlayClick,
  onTipClick,
  playEnabled,
}: {
  onPlayClick: (e: React.MouseEvent) => void;
  onTipClick: (e: React.MouseEvent) => void;
  playEnabled: boolean;
}) {
  return (
    <div className="absolute h-[196px] left-[-0.67px] overflow-clip top-[650.82px] w-[438px]" data-name="keyboard">
      <div className="absolute h-[196px] left-0 top-0 w-[438px]" data-name="image 109">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSecondStageKeyboard} />
      </div>
      <button
        aria-label="Start second stage game"
        className="absolute h-[101px] left-[310px] overflow-clip top-[70px] w-[99px]"
        data-name="btns"
        disabled={!playEnabled}
        onClick={onPlayClick}
        style={{ cursor: playEnabled ? "pointer" : "default", opacity: playEnabled ? 1 : 0.84 }}
        type="button"
      >
        <div className="absolute h-[95.347px] left-[2.26px] top-[2.1px] w-[95.229px]">
          <img alt="" className="absolute block inset-0 max-w-none size-full" height="95.347" src={imgEllipse47} width="95.229" />
        </div>
        <div className="absolute h-[104.625px] left-[-4.88px] top-[-2.25px] w-[108.75px]" data-name="ChatGPT Image Apr 6, 2026, 01_19_05 PM 2">
          <img alt="" className="absolute inset-0 max-w-none object-bottom pointer-events-none size-full" src={imgRecMic} />
        </div>
        <div
          className="-translate-y-1/2 [word-break:break-word] absolute flex flex-col justify-center leading-[0] left-[calc(50%-21.5px)] not-italic text-[#171717] text-[24px] top-[24.06px] tracking-[-0.48px] whitespace-nowrap"
          style={{ fontFamily: "'Gagalin', sans-serif" }}
        >
          <p className="leading-none">PLAY</p>
        </div>
      </button>
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

function SecondStageGuide({ onClose }: { onClose: (e: React.MouseEvent) => void }) {
  return (
    <div
      className="absolute h-[573px] left-0 top-0 w-[1185px] z-[30]"
      data-name="guide"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="absolute bg-black/30 h-[558.911px] left-[0.78px] top-0 w-[1184.225px]" />
      <div className="absolute h-[399.491px] left-[202.39px] top-[79.71px] w-[780.217px]">
        <div className="absolute bg-[#d3d1c7] h-[48.181px] left-0 top-0 w-full" />
        <div className="absolute bg-[#d3d1c7] h-[351.31px] left-[1.11px] top-[48.18px] w-[778.112px]" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[106.27%] left-[-1.19%] max-w-none top-0 w-[102.45%]" src={imgSecondStageInterfaceRight} />
        </div>
        <button
          aria-label="Close guide"
          className="absolute flex items-center justify-center right-[22px] size-[32px] top-[8px] z-[4]"
          onClick={onClose}
          style={{ cursor: "pointer" }}
          type="button"
        >
          <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgGuideX} />
        </button>
      </div>

      <div className="absolute h-[224.5px] left-[277.32px] top-[177.75px] w-[179.5px] z-[31]" data-name="guide_stack">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgGuideImage110} />
      </div>
      <div className="absolute h-[191.5px] left-[502.32px] top-[194.25px] w-[248.5px] z-[31]" data-name="guide_slot">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgGuideImage111} />
      </div>
      <div className="absolute h-[136.336px] left-[767.07px] top-[226.63px] w-[92.929px] z-[32]" data-name="HollowEarth_Card">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgCardHollowEarth} />
      </div>
      <div className="absolute h-[136.336px] left-[816.42px] top-[191.93px] w-[92.929px] z-[31]" data-name="OtherWorld_Card">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgCardOtherworldly} />
      </div>
      <div className="absolute h-[39.674px] left-[464.99px] top-[265.28px] w-[48.08px] z-[33]" data-name="arrow_small">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgGuideArrowSmall} />
      </div>
      <div className="absolute flex h-[43.636px] items-center justify-center left-[929.29px] top-[418.18px] w-[90.56px] z-[33]">
        <div className="flex-none rotate-[-92.34deg]">
          <div className="h-[89.002px] relative w-[40.042px]" data-name="arrow_large">
            <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgGuideArrowLarge} />
          </div>
        </div>
      </div>
      <div className="absolute left-[473.17px] size-[57px] top-[208.38px] z-[45]" data-name="first_icon">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgGuideFirst} />
      </div>
      <div className="absolute left-[674.22px] size-[60px] top-[426.78px] z-[45]" data-name="second_icon">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgGuideSecond} />
      </div>
      <div className="absolute h-[39.5px] left-[736.64px] top-[197.5px] w-[65.5px] z-[45]" data-name="plus_card_icon">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgGuidePlusCard} />
      </div>
      <div className="absolute h-[22.5px] left-[754.38px] top-[177.75px] w-[58.5px] z-[45]" data-name="plus_hype_icon">
        <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgGuidePlusHype} />
      </div>

      <div className="absolute contents left-[473.17px] size-[56.899px] top-[208.38px]" data-name="first">
        <div className="absolute flex items-center justify-center left-[473.17px] size-[56.899px] top-[208.38px] z-[33]">
          <div className="flex-none rotate-[21.12deg]">
            <div className="relative size-[44px]">
              <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgGuideEllipse52} />
            </div>
          </div>
        </div>
        <div className="-translate-y-1/2 absolute flex h-[35.074px] items-center justify-center left-[calc(50%-310.24px)] top-[calc(50%-212.27px)] w-[25.632px] z-[34]">
          <div className="flex-none rotate-[21.12deg]">
            <div
              className="[word-break:break-word] flex flex-col h-[31.719px] justify-center leading-[0] not-italic relative text-[#171717] text-[24.771px] tracking-[-0.495px] w-[15.225px]"
              style={{ fontFamily: HANDWRITE_FONT }}
            >
              <p className="leading-none">1</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute contents left-[674.22px] size-[59.824px] top-[426.78px]" data-name="second">
        <div className="absolute flex items-center justify-center left-[674.22px] size-[59.824px] top-[426.78px] z-[33]">
          <div className="flex-none rotate-[-29.03deg]">
            <div className="relative size-[44px]">
              <img alt="" className="absolute inset-0 max-w-none object-contain pointer-events-none size-full" src={imgGuideEllipse53} />
            </div>
          </div>
        </div>
        <div className="-translate-y-1/2 absolute flex h-[28.403px] items-center justify-center left-[calc(50%-108.36px)] top-[calc(50%+7.04px)] w-[25.359px] z-[34]">
          <div className="flex-none rotate-[-29.03deg]">
            <div
              className="[word-break:break-word] flex flex-col h-[23.682px] justify-center leading-[0] not-italic relative text-[#171717] text-[26.213px] tracking-[-0.524px] w-[15.859px]"
              style={{ fontFamily: HANDWRITE_FONT }}
            >
              <p className="leading-none">2</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute flex h-[39.15px] items-center justify-center left-[736.64px] top-[197.5px] w-[65.333px] z-[34]">
        <div className="flex-none rotate-[-20.75deg]">
          <div className="content-stretch flex gap-[3px] items-center relative" data-name="+card">
            <div className="h-[17.972px] relative shrink-0 w-[18.056px]" data-name="plus">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGuidePlus} />
            </div>
            <div
              className="[word-break:break-word] flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[16px] tracking-[-0.32px] whitespace-nowrap"
              style={{ fontFamily: "'Gagalin', sans-serif" }}
            >
              <p className="leading-none">карта</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex h-[22.261px] items-center justify-center left-[754.38px] top-[177.75px] w-[58.258px] z-[34]">
        <div className="flex-none rotate-[4.36deg]">
          <div className="content-stretch flex gap-[3px] items-center relative" data-name="+hype">
            <div className="h-[17.972px] relative shrink-0 w-[18.056px]" data-name="plus">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGuidePlus} />
            </div>
            <div
              className="[word-break:break-word] flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-[#171717] text-[16px] tracking-[-0.32px] whitespace-nowrap"
              style={{ fontFamily: "'Gagalin', sans-serif" }}
            >
              <p className="leading-none">хайп</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CleanSecondStageGuide({ onClose }: { onClose: (e: React.MouseEvent) => void }) {
  return (
    <div
      className="absolute h-[573px] left-0 top-0 w-[1185px] z-[30]"
      data-name="guide_clean"
      onClick={(e) => e.stopPropagation()}
    >
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSecondStageGuideScreen} />
      <button
        aria-label="Close guide"
        className="absolute left-[936.92px] size-[32px] top-[87.85px]"
        onClick={onClose}
        style={{ cursor: "pointer" }}
        type="button"
      />
    </div>
  );
}

function HypeBar({ hype }: { hype: number }) {
  const percent = Math.max(0, Math.min(100, (hype / HYPE_MAX) * 100));
  return (
    <div className="-translate-x-1/2 absolute h-[4px] left-1/2 top-[487px] w-[747px] z-[20]" data-name="hypebar">
      <div className="absolute bg-[#171717] h-[2px] left-0 top-[1px] w-full" />
      <div
        className="absolute bg-[#e23939] h-[4px] left-0 top-0"
        style={{ width: `${percent}%`, transition: "width 260ms ease-out" }}
      />
    </div>
  );
}

function TimerBadge({ seconds }: { seconds: number }) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const rest = String(safeSeconds % 60).padStart(2, "0");
  return (
    <div className="absolute flex h-[46px] items-center justify-center left-[45px] top-[32px] w-[90px] z-[20]">
      <div
        className="text-[#e23939] text-[44px] tracking-[-0.88px]"
        style={{ fontFamily: "'Gagalin', sans-serif" }}
      >
        {minutes}:{rest}
      </div>
    </div>
  );
}

function SecondStageResultScreen({ result }: { result: Exclude<SecondStageResult, null> }) {
  const isWin = result === "WIN";
  return (
    <div className="absolute inset-0 z-[50]" data-name={isWin ? "Win" : "Lose"}>
      <div
        className="-translate-x-1/2 -translate-y-1/2 absolute h-[540.816px] left-1/2 top-1/2 w-[1146.023px]"
        data-name={isWin ? "success_overlay" : "error_overlay"}
        style={{
          backgroundColor: isWin ? "#0adb75" : "#e23939",
          opacity: isWin ? 0.73 : 0.84,
        }}
      />
      <div
        className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col justify-center leading-[0] left-1/2 not-italic text-[#edebdf] text-[64px] top-1/2 tracking-[-1.28px] whitespace-nowrap"
        style={{ fontFamily: "'Gagalin', sans-serif" }}
      >
        <p className="leading-none">{isWin ? "SUCCESS" : "ERROR"}</p>
      </div>
      <div className="absolute left-[1095px] size-[32px] top-[474.39px]" data-name="MouseLeftClick">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g clipPath="url(#clip0_second_stage_result_mouse)" id="MouseLeftClick">
            <path d={svgPaths.p20ec380} fill="var(--fill-0, #171717)" id="Vector" />
            <path d={svgPaths.p20b52f80} fill="var(--fill-0, #171717)" id="Vector_2" />
          </g>
          <defs>
            <clipPath id="clip0_second_stage_result_mouse">
              <rect fill="white" height="32" width="32" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function SecondStageGameLayer({
  folders,
  hype,
  result,
  selectedFolderId,
  secondsLeft,
  onFolderClick,
  onFolderDrop,
  onFolderCardReturn,
}: {
  folders: SecondStageFolder[];
  hype: number;
  result: SecondStageResult;
  selectedFolderId: number | null;
  secondsLeft: number;
  onFolderClick: (folderId: number, e: React.MouseEvent) => void;
  onFolderDrop: (folderId: number, e: React.DragEvent) => void;
  onFolderCardReturn: (folderId: number, slot: "main" | "added", e: React.MouseEvent) => void;
}) {
  const now = Date.now();
  return (
    <div className="absolute inset-0 z-[12]" data-name="second_stage_game">
      <HypeBar hype={hype} />
      <TimerBadge seconds={secondsLeft} />

      <div className="absolute h-[286px] left-[184.97px] top-[92.96px] w-[760px]" data-name="folders">
        {folders.map((folder) => {
          if (folder.state === "hidden") return null;
          const folderImage = FOLDER_IMAGES[folder.category];
          const addSlotImage = folder.addedCard ? FOLDER_IMAGES[folder.addedCard].zone : imgZoneAddEmpty;
          const blinking = now >= folder.blinkAt;
          return (
            <div
              className="absolute h-[308px] top-0 w-[385px]"
              data-name={folderImage.name}
              key={folder.id}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDrop={(e) => onFolderDrop(folder.id, e)}
              style={{
                left: folder.left - 30,
                top: folder.top - 30,
                animation: blinking ? "folderBlink 620ms ease-in-out infinite" : undefined,
              }}
            >
              <button
                aria-label={`Folder ${folderImage.label}`}
                className="absolute h-[248px] left-[30px] top-[30px] w-[167px] z-[1]"
                onClick={(e) => onFolderClick(folder.id, e)}
                style={{ cursor: "pointer" }}
                type="button"
              >
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={folderImage.src} />
              </button>
              {folder.mainCard && (
                <button
                  aria-label={`Return ${CARD_IMAGES[folder.mainCard].name}`}
                  className="absolute h-[190px] left-[49px] top-[72px] w-[130px] z-[4]"
                  data-name={CARD_IMAGES[folder.mainCard].name}
                  onClick={(e) => onFolderCardReturn(folder.id, "main", e)}
                  style={{ cursor: "grab" }}
                  type="button"
                >
                  <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={CARD_IMAGES[folder.mainCard].src} />
                </button>
              )}
              {folder.state === "waiting" && (
                <div className="absolute h-[226px] left-[159px] top-[52px] w-[196px] z-[2]" data-name="ZoneAdd">
                  <img
                    alt=""
                    className="absolute inset-0 max-w-none object-cover pointer-events-none size-full z-[1]"
                    src={addSlotImage}
                  />
                  {folder.addedCard && (
                    <button
                      aria-label={`Return ${CARD_IMAGES[folder.addedCard].name}`}
                      className="absolute h-[190px] left-[44px] top-[18px] w-[130px] z-[5]"
                      data-name={CARD_IMAGES[folder.addedCard].name}
                      onClick={(e) => onFolderCardReturn(folder.id, "added", e)}
                      style={{ cursor: "grab" }}
                      type="button"
                    >
                      <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={CARD_IMAGES[folder.addedCard].src} />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {result && <SecondStageResultScreen result={result} />}
    </div>
  );
}

function SecondStageGameCardsHand({
  cards,
  draggingCardIndex,
  hoveredCardIndex,
  onCardClick,
  onCardDrag,
  onCardDragEnd,
  onCardDragStart,
  onCardHover,
}: {
  cards: CardCategory[];
  draggingCardIndex: number | null;
  hoveredCardIndex: number | null;
  onCardClick: (index: number, e: React.MouseEvent) => void;
  onCardDrag: (index: number, e: React.DragEvent) => void;
  onCardDragEnd: (e: React.DragEvent) => void;
  onCardDragStart: (index: number, e: React.DragEvent) => void;
  onCardHover: (index: number | null) => void;
}) {
  return (
    <div className="absolute h-[190px] left-[528.83px] top-[613px] w-[900px] z-[24]" data-name="cards_hand">
      {cards.slice(0, MAX_SELECTED_PHRASES).map((category, index) => {
        const card = CARD_IMAGES[category];
        const dragging = draggingCardIndex === index;
        const hovered = hoveredCardIndex === index && !dragging;
        return (
          <button
            aria-label={card.name}
            className="absolute h-[190px] top-0 w-[130px]"
            data-name={card.name}
            draggable
            key={`second-game-${category}-${index}`}
            onClick={(e) => onCardClick(index, e)}
            onDrag={(e) => onCardDrag(index, e)}
            onDragEnd={onCardDragEnd}
            onMouseEnter={() => onCardHover(index)}
            onMouseLeave={() => onCardHover(null)}
            onMouseDown={() => onCardHover(null)}
            onDragStart={(e) => onCardDragStart(index, e)}
            style={{
              cursor: dragging ? "grabbing" : "grab",
              left: index * SECOND_STAGE_CARD_GAP,
              transform: hovered ? "translateY(-112px) scale(1.62)" : "translateY(0) scale(1)",
              transformOrigin: "bottom center",
              transition: "transform 180ms ease-out, filter 180ms ease-out",
              opacity: dragging ? 0.22 : 1,
              filter: hovered
                ? "drop-shadow(0 0 24px rgba(10,219,117,0.95))"
                : dragging
                  ? "drop-shadow(0 0 14px rgba(237,235,223,0.72))"
                  : undefined,
              zIndex: dragging ? 600 : hovered ? 500 : index,
            }}
            type="button"
          >
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={card.src} />
          </button>
        );
      })}
    </div>
  );
}

function DraggingSecondStageCard({
  category,
  position,
}: {
  category: CardCategory;
  position: DragPosition;
}) {
  const card = CARD_IMAGES[category];
  return (
    <div
      className="absolute h-[190px] w-[130px]"
      data-name="dragging_card_in_hand"
      style={{
        left: position.x,
        pointerEvents: "none",
        top: position.y,
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
      }}
    >
      <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={card.src} />
    </div>
  );
}

function SecondStageMonitor({
  showMessages,
  envelopeShaking,
  onEnvelopeClick,
  guideOpen,
  onGuideOpen,
  onGuideClose,
  gameActive,
  gameResult,
  folders,
  hype,
  selectedFolderId,
  secondsLeft,
  onGameFolderClick,
  onGameFolderDrop,
  onGameFolderCardReturn,
}: {
  showMessages: boolean;
  envelopeShaking: boolean;
  onEnvelopeClick: (e: React.MouseEvent) => void;
  guideOpen: boolean;
  onGuideOpen: (e: React.MouseEvent) => void;
  onGuideClose: (e: React.MouseEvent) => void;
  gameActive: boolean;
  gameResult: SecondStageResult;
  folders: SecondStageFolder[];
  hype: number;
  selectedFolderId: number | null;
  secondsLeft: number;
  onGameFolderClick: (folderId: number, e: React.MouseEvent) => void;
  onGameFolderDrop: (folderId: number, e: React.DragEvent) => void;
  onGameFolderCardReturn: (folderId: number, slot: "main" | "added", e: React.MouseEvent) => void;
}) {
  return (
    <div
      className="-translate-x-1/2 -translate-y-1/2 absolute h-[573px] left-1/2 overflow-clip top-[calc(50%-99.5px)] w-[1185px]"
      data-name="screen_secondstage"
    >
      <div className="absolute h-[573px] left-0 overflow-clip top-0 w-[1185px]" data-name="bg">
        <div
          className="absolute h-[558.911px] left-[0.78px] top-0 w-[1184.225px]"
          data-name="color"
          style={{
            backgroundImage:
              "linear-gradient(90deg, rgba(0, 0, 0, 0.11) 0%, rgba(0, 0, 0, 0.11) 100%), linear-gradient(90deg, rgb(237, 235, 223) 0%, rgb(237, 235, 223) 100%)",
          }}
        />
        {!gameActive && <div className="absolute contents left-[-192.22px] top-[107.74px]" data-name="interface">
          <div className="absolute h-[308.84px] left-[-192.22px] opacity-28 top-[107.74px] w-[568.546px]" data-name="ChatGPT Image Apr 6, 2026, 02_56_34 PM 2">
            <img alt="" className="absolute inset-0 max-w-none object-bottom pointer-events-none size-full" src={imgSecondStageInterfaceLeft} />
          </div>
          <div className="-translate-x-1/2 absolute h-[288.496px] left-[calc(50%+179.81px)] opacity-32 top-[361.78px] w-[668.164px]" data-name="ChatGPT Image Apr 6, 2026, 02_47_12 PM 1">
            <img alt="" className="absolute inset-0 max-w-none object-bottom pointer-events-none size-full" src={imgSecondStageWaveWindow} />
          </div>
          <div className="absolute h-[374.247px] left-[419.38px] opacity-23 top-[308.97px] w-[687.007px]" data-name="image 98">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img alt="" className="absolute h-[98.81%] left-0 max-w-none top-[1.19%] w-[101.35%]" src={imgSecondStageInterfaceRight} />
            </div>
          </div>
          <div className="-translate-x-1/2 absolute bottom-[14.09px] h-[68.519px] left-[calc(50%-246.53px)] opacity-67 w-[689.829px]" data-name="ChatGPT Image Apr 6, 2026, 02_56_34 PM 4">
            <div aria-hidden className="absolute inset-0 pointer-events-none">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(237, 235, 223) 0%, rgb(237, 235, 223) 100%)",
                }}
              />
              <img alt="" className="absolute max-w-none object-bottom opacity-10 size-full" src={imgSecondStageBottomLeft} />
            </div>
          </div>
          <div className="-translate-x-1/2 absolute bottom-[14.09px] h-[68.519px] left-[calc(50%+345.44px)] opacity-67 w-[494.112px]" data-name="ChatGPT Image Apr 6, 2026, 02_56_34 PM 3">
            <div aria-hidden className="absolute inset-0 pointer-events-none">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 100%), linear-gradient(90deg, rgb(237, 235, 223) 0%, rgb(237, 235, 223) 100%)",
                }}
              />
              <img alt="" className="absolute max-w-none object-bottom opacity-10 size-full" src={imgSecondStageBottomRight} />
            </div>
          </div>
        </div>}
        {gameActive && (
          <div className="absolute bottom-[13px] h-[68.519px] left-[0.78px] opacity-67 w-[1184.225px]" data-name="game_interface">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0.18) 100%), linear-gradient(90deg, rgb(237, 235, 223) 0%, rgb(237, 235, 223) 100%)",
              }}
            />
            <img alt="" className="absolute bottom-0 left-0 max-w-none object-bottom opacity-10 h-full w-[690px]" src={imgSecondStageBottomLeft} />
            <img alt="" className="absolute bottom-0 right-0 max-w-none object-bottom opacity-10 h-full w-[494px]" src={imgSecondStageBottomRight} />
          </div>
        )}
      </div>
      <div className="absolute contents left-[0.78px] top-0" data-name="screen">
        <div className="absolute h-[576.932px] left-[0.78px] pointer-events-none top-0 w-[1184.224px]" data-name="Subtract">
          <img alt="" className="absolute block inset-0 max-w-none size-full" height="576.932" src={imgSecondStageSubtract} width="1184.224" />
        </div>
      </div>
      <div className="absolute left-[1095px] size-[32px] top-[474.39px]" data-name="MouseLeftClick">
        <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
          <g clipPath="url(#clip0_second_stage_mouse)" id="MouseLeftClick">
            <g id="Vector" />
            <path d={svgPaths.p3cc11a70} fill="var(--fill-0, #171717)" id="Vector_2" />
          </g>
          <defs>
            <clipPath id="clip0_second_stage_mouse">
              <rect fill="white" height="32" width="32" />
            </clipPath>
          </defs>
        </svg>
      </div>

      {gameActive && (
        <SecondStageGameLayer
          folders={folders}
          hype={hype}
        onFolderClick={onGameFolderClick}
        onFolderCardReturn={onGameFolderCardReturn}
        onFolderDrop={onGameFolderDrop}
          result={gameResult}
          secondsLeft={secondsLeft}
          selectedFolderId={selectedFolderId}
        />
      )}

      {showMessages && !gameActive && (
        <>
          <div className="absolute bg-white border-2 border-black border-solid content-stretch flex items-center left-[138.83px] overflow-clip px-[20px] py-[16px] top-[81.53px] w-[544px]">
            <div
              className="[word-break:break-word] flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-[#e23939] text-[20px] tracking-[-0.4px] w-[463.913px]"
              style={{ fontFamily: HANDWRITE_FONT }}
            >
              <p>
                <span className="leading-[1.55]">{SECOND_STAGE_MESSAGE_1.redStart}</span>
                <span className="leading-[1.55] text-[#171717]">{SECOND_STAGE_MESSAGE_1.black}</span>
                <span className="leading-[1.55]">{SECOND_STAGE_MESSAGE_1.redMiddle}</span>
                <span className="leading-[1.55]">{SECOND_STAGE_MESSAGE_1.blackEnd}</span>
                <span className="leading-[1.55]">{SECOND_STAGE_MESSAGE_1.redEnd}</span>
              </p>
            </div>
          </div>
          <div className="absolute bg-white border-2 border-black border-solid content-stretch flex items-center left-[138.83px] overflow-clip px-[20px] py-[16px] top-[257.53px] w-[544px]">
            <div
              className="[word-break:break-word] flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-[#e23939] text-[20px] tracking-[-0.4px] w-[452px]"
              style={{ fontFamily: HANDWRITE_FONT }}
            >
              <p className="leading-[1.55]">{SECOND_STAGE_MESSAGE_2}</p>
            </div>
            <button
              aria-label="Open guide"
              className="-translate-y-1/2 absolute right-[16px] size-[37px] top-1/2 z-[2]"
              data-name="FileArrowDown"
              onClick={onGuideOpen}
              style={{ cursor: "pointer" }}
              type="button"
            >
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgSecondStageDownloadIcon} />
            </button>
          </div>
        </>
      )}

      {!gameActive && (
        <MailIconAnimated
          badgeIn
          className="absolute block h-[52px] left-[66.28px] overflow-clip top-[81.53px] w-[64px]"
          isAlert
          isShaking={envelopeShaking}
          onEnvClick={showMessages ? undefined : onEnvelopeClick}
        />
      )}
      {guideOpen && !gameActive && <CleanSecondStageGuide onClose={onGuideClose} />}
    </div>
  );
}

function SecondStageScene({
  cards,
  envelopeShaking,
  gameActive,
  gameCards,
  draggingCardIndex,
  draggingCardPosition,
  hoveredCardIndex,
  gameResult,
  folders,
  hype,
  onTipClick,
  onPlayClick,
  showMessages,
  onEnvelopeClick,
  guideOpen,
  onGuideOpen,
  onGuideClose,
  secondsLeft,
  selectedFolderId,
  onGameCardClick,
  onGameCardDrag,
  onGameCardDragEnd,
  onGameCardDragStart,
  onGameCardHover,
  onGameFolderClick,
  onGameFolderDrop,
  onGameFolderCardReturn,
}: {
  cards: CardCategory[];
  envelopeShaking: boolean;
  gameActive: boolean;
  gameCards: CardCategory[];
  draggingCardIndex: number | null;
  draggingCardPosition: DragPosition | null;
  hoveredCardIndex: number | null;
  gameResult: SecondStageResult;
  folders: SecondStageFolder[];
  hype: number;
  onTipClick: (e: React.MouseEvent) => void;
  onPlayClick: (e: React.MouseEvent) => void;
  showMessages: boolean;
  onEnvelopeClick: (e: React.MouseEvent) => void;
  guideOpen: boolean;
  onGuideOpen: (e: React.MouseEvent) => void;
  onGuideClose: (e: React.MouseEvent) => void;
  secondsLeft: number;
  selectedFolderId: number | null;
  onGameCardClick: (index: number, e: React.MouseEvent) => void;
  onGameCardDrag: (index: number, e: React.DragEvent) => void;
  onGameCardDragEnd: (e: React.DragEvent) => void;
  onGameCardDragStart: (index: number, e: React.DragEvent) => void;
  onGameCardHover: (index: number | null) => void;
  onGameFolderClick: (folderId: number, e: React.MouseEvent) => void;
  onGameFolderDrop: (folderId: number, e: React.DragEvent) => void;
  onGameFolderCardReturn: (folderId: number, slot: "main" | "added", e: React.MouseEvent) => void;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden" data-name="second_stage" style={{ animation: `secondStageFadeIn ${SCENE_FADE_MS}ms ease-out both` }}>
      <div className="absolute inset-0 overflow-clip" data-name="bg">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgSecondStageBackgroundFull} />
      </div>
      <SecondStageKeyboard onPlayClick={onPlayClick} onTipClick={onTipClick} playEnabled={showMessages && !gameActive} />
      <SecondStageMonitor
        envelopeShaking={envelopeShaking}
        folders={folders}
        gameActive={gameActive}
        gameResult={gameResult}
        guideOpen={guideOpen}
        hype={hype}
        onEnvelopeClick={onEnvelopeClick}
        onGameFolderClick={onGameFolderClick}
        onGameFolderCardReturn={onGameFolderCardReturn}
        onGameFolderDrop={onGameFolderDrop}
        onGuideClose={onGuideClose}
        onGuideOpen={onGuideOpen}
        secondsLeft={secondsLeft}
        selectedFolderId={selectedFolderId}
        showMessages={showMessages}
      />
      {gameActive && (
        <SecondStageGameCardsHand
          cards={gameCards}
          draggingCardIndex={draggingCardIndex}
          hoveredCardIndex={hoveredCardIndex}
          onCardClick={onGameCardClick}
          onCardDrag={onGameCardDrag}
          onCardDragEnd={onGameCardDragEnd}
          onCardHover={onGameCardHover}
          onCardDragStart={onGameCardDragStart}
        />
      )}
      {gameActive && draggingCardIndex !== null && draggingCardPosition && gameCards[draggingCardIndex] && (
        <DraggingSecondStageCard category={gameCards[draggingCardIndex]} position={draggingCardPosition} />
      )}
      {!gameActive && <SecondStageCards cards={cards} />}
    </div>
  );
}

function PhraseSelectionScene({
  activePhrases,
  onPhraseClick,
  onPhraseExpired,
}: {
  activePhrases: FallingPhrase[];
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
    </>
  );
}

function TypewriterText({
  lines,
  active,
  className,
}: {
  lines: string[];
  active: boolean;
  className?: string;
}) {
  const text = lines.join("\n");
  const [visibleCount, setVisibleCount] = useState(active ? 0 : text.length);

  useEffect(() => {
    if (!active) {
      setVisibleCount(text.length);
      return;
    }

    setVisibleCount(0);
    if (text.length === 0) return;

    const id = setInterval(() => {
      setVisibleCount((current) => {
        if (current >= text.length) {
          clearInterval(id);
          return current;
        }
        return current + 1;
      });
    }, TYPEWRITER_MS_PER_CHAR);

    return () => clearInterval(id);
  }, [active, text]);

  const visibleText = text.slice(0, visibleCount);
  const visibleLines = visibleText.split("\n");

  return (
    <div className={className} style={{ fontFamily: HANDWRITE_FONT }}>
      {lines.map((line, index) => (
        <p className="leading-[1.55] mb-0" key={`${line}-${index}`}>
          {visibleLines[index] ?? ""}
        </p>
      ))}
    </div>
  );
}

// ─── Character phrase scrim ───────────────────────────────────────────────────
function CharacterPhrase({ phrase, visible }: { phrase: string; visible: boolean }) {
  return (
    <div
      className="-translate-x-1/2 -translate-y-1/2 absolute h-[92px] left-[calc(50%-0.45px)] overflow-clip top-[calc(50%+276px)] w-[1600px]"
      style={{ pointerEvents: "none", visibility: visible ? "visible" : "hidden" }}
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
        <TypewriterText active={visible} lines={[phrase]} />
      </div>
    </div>
  );
}

function GameScrim({
  lines,
  onClick,
}: {
  lines: string[];
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      className="-translate-x-1/2 -translate-y-1/2 absolute h-[92px] left-[calc(50%-0.45px)] overflow-clip top-[calc(50%+276px)] w-[1600px]"
      data-name="scrim"
      onClick={onClick}
      style={{ cursor: "pointer", zIndex: 80 }}
    >
      <div
        className="-translate-x-1/2 -translate-y-1/2 absolute h-[92px] left-1/2 top-1/2 w-[1600px]"
        data-name="monolog_scrim"
        style={{
          filter: "blur(8.25px)",
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 1600 92' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%25' width='100%25' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(80 0 0 73.549 800 46)'><stop stop-color='rgba(0,0,0,1)' offset='0.73097'/><stop stop-color='rgba(6,6,6,0.9375)' offset='0.74779'/><stop stop-color='rgba(13,13,13,0.875)' offset='0.7646'/><stop stop-color='rgba(26,26,26,0.75)' offset='0.79823'/><stop stop-color='rgba(51,51,51,0.5)' offset='0.86549'/><stop stop-color='rgba(102,102,102,0)' offset='1'/></radialGradient></defs></svg>\")",
        }}
      />
      <TypewriterText
        active
        className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute flex flex-col justify-center leading-[0] left-1/2 not-italic text-[#edebdf] text-[24px] text-center top-1/2 tracking-[-0.48px] w-[672px]"
        lines={lines}
      />
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
  const envelopeAudioRef = useRef<HTMLAudioElement | null>(null);

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
  const [guideOpen, setGuideOpen] = useState(false);
  const [sceneTransitioning, setSceneTransitioning] = useState(false);
  const [secondStageCards, setSecondStageCards] = useState<CardCategory[]>([]);
  const [secondStageFolders, setSecondStageFolders] = useState<SecondStageFolder[]>([]);
  const [selectedSecondCardIndex, setSelectedSecondCardIndex] = useState<number | null>(null);
  const [selectedSecondFolderId, setSelectedSecondFolderId] = useState<number | null>(null);
  const [draggingSecondCardIndex, setDraggingSecondCardIndex] = useState<number | null>(null);
  const [draggingSecondCardPosition, setDraggingSecondCardPosition] = useState<DragPosition | null>(null);
  const [hoveredSecondCardIndex, setHoveredSecondCardIndex] = useState<number | null>(null);
  const [secondStageHype, setSecondStageHype] = useState(HYPE_START);
  const [secondStageSecondsLeft, setSecondStageSecondsLeft] = useState(SECOND_STAGE_GAME_SECONDS);
  const [secondStageResult, setSecondStageResult] = useState<SecondStageResult>(null);

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

  useEffect(() => {
    if (!envelopeAudioRef.current) {
      envelopeAudioRef.current = new Audio(audioEnvelopeNotification);
      envelopeAudioRef.current.loop = true;
      envelopeAudioRef.current.volume = 0.55;
    }

    const audio = envelopeAudioRef.current;

    if (envelopeShaking) {
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Browsers may block sound before the first user gesture.
      });
      return;
    }

    audio.pause();
    audio.currentTime = 0;
  }, [envelopeShaking]);

  useEffect(() => {
    return () => {
      const audio = envelopeAudioRef.current;
      if (!audio) return;
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const spawnPhrase = useCallback(() => {
    setActivePhrases((current) => {
      if (current.length >= PHRASE_MAX_ACTIVE) return current;
      const now = Date.now();
      const hasUnsafeGap = current.some((phrase) => now - phrase.startedAt < PHRASE_SAFE_SPAWN_MS);
      if (hasUnsafeGap) return current;

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

      let laneIndex = phraseLaneRef.current % PHRASE_LANES.length;
      phraseLaneRef.current = laneIndex + 1;

      phraseInstanceRef.current += 1;
      return [
        ...current,
        {
          ...next,
          instanceId: phraseInstanceRef.current,
          startedAt: now,
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
  const isGameIntroScrim = phase === "gameIntroScrim";
  const isPhraseSelection = phase === "phraseSelection";
  const isGameOutroScrim = phase === "gameOutroScrim";
  const isGameComplete = phase === "gameComplete";
  const isSecondStageAlert = phase === "secondStageAlert";
  const isSecondStageMessages = phase === "secondStageMessages";
  const isSecondStageGame = phase === "secondStageGame";
  const isSecondStage = isSecondStageAlert || isSecondStageMessages || isSecondStageGame;
  const isGameScene = isGameIntroScrim || isPhraseSelection || isGameOutroScrim || isGameComplete;
  const isGameBackground = isGameIntroScrim || isPhraseSelection;
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
      setPhase("gameOutroScrim");
    }
  }, [phase, selectedPhraseCount]);

  useEffect(() => {
    if (phase !== "secondStageGame" || secondStageResult) return;

    const id = setInterval(() => {
      const now = Date.now();
      setSecondStageHype((hype) => Math.max(0, hype - HYPE_DECAY));
      setSecondStageSecondsLeft((seconds) => {
        const next = Math.max(0, seconds - 1);
        if (next === 0) {
          setSecondStageResult(getSecondStageResult(secondStageHype));
        }
        return next;
      });
      setSecondStageFolders((folders) => {
        const nextFolders: SecondStageFolder[] = [];
        folders.forEach((folder, index) => {
          if (now < folder.expiresAt) {
            nextFolders.push(folder);
            return;
          }
          if (folder.state === "hidden") {
            const foldersStayingVisible = folders
              .slice(index + 1)
              .filter((futureFolder) => futureFolder.state !== "hidden" && now < futureFolder.expiresAt);
            const visibleFolderCount = [...nextFolders, ...foldersStayingVisible].filter(
              (visibleFolder) => visibleFolder.state !== "hidden"
            ).length;
            if (visibleFolderCount >= MAX_VISIBLE_FOLDERS) {
              nextFolders.push({
                ...folder,
                expiresAt: now + 700,
                blinkAt: Number.POSITIVE_INFINITY,
              });
              return;
            }
            const position = pickFreeFolderPosition(
              [...nextFolders, ...foldersStayingVisible],
              { left: folder.left, top: folder.top }
            );
            nextFolders.push(refreshSecondStageFolder(folder, now, position));
            return;
          }
          nextFolders.push(hideSecondStageFolder(folder, now));
        });
        if (!nextFolders.some((folder) => folder.id === selectedSecondFolderId)) {
          setSelectedSecondFolderId(null);
        }
        return nextFolders;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [phase, secondStageHype, secondStageResult, selectedSecondFolderId]);

  const startSecondStageTransition = useCallback(() => {
    if (sceneTransitioning) return;
    setGuideOpen(false);
    setEnvelopeShaking(false);
    setPhase("gameComplete");
    setSceneTransitioning(true);
    after(() => {
      setSceneTransitioning(false);
      setEnvelopeShaking(true);
      setPhase("secondStageAlert");
    }, SCENE_FADE_MS);
  }, [after, sceneTransitioning]);

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

      if (phase === "gameIntroScrim") {
        setPhase("phraseSelection");
        return;
      }

      if (phase === "gameOutroScrim") {
        startSecondStageTransition();
        return;
      }

      switch (phase) {
        case "waitingForAlert":
        case "revealingInitialMessages":
        case "finalIntroState":
        case "phraseSelection":
        case "gameComplete":
        case "secondStageAlert":
        case "secondStageMessages":
        case "secondStageGame":
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
    [phase, startSecondStageTransition]
  );

  // ── Rec button click ───────────────────────────────────────────────────────
  const handleRecClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (
        phase === "testCompleted" ||
        phase === "gameIntroScrim" ||
        phase === "phraseSelection" ||
        phase === "gameOutroScrim" ||
        phase === "gameComplete" ||
        phase === "secondStageAlert" ||
        phase === "secondStageMessages" ||
        phase === "secondStageGame"
      ) return;

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
      setPhase("gameIntroScrim");
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
    [phase, startSecondStageTransition]
  );

  const handleGameIntroScrimClick = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (phase !== "gameIntroScrim") return;
    setPhase("phraseSelection");
  }, [phase]);

  const handleGameOutroScrimClick = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (phase !== "gameOutroScrim") return;
    startSecondStageTransition();
  }, [phase, startSecondStageTransition]);

  const handleSecondStageEnvelopeClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase !== "secondStageAlert") return;
    setEnvelopeShaking(false);
    setPhase("secondStageMessages");
  }, [phase]);

  const handleGuideOpen = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase !== "secondStageMessages") return;
    setGuideOpen(true);
  }, [phase]);

  const handleGuideClose = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setGuideOpen(false);
  }, []);

  const handleSecondStagePlayClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase !== "secondStageMessages") return;
    setGuideOpen(false);
    setSelectedSecondCardIndex(null);
    setSelectedSecondFolderId(null);
    setDraggingSecondCardIndex(null);
    setDraggingSecondCardPosition(null);
    setHoveredSecondCardIndex(null);
    setSecondStageHype(HYPE_START);
    setSecondStageSecondsLeft(SECOND_STAGE_GAME_SECONDS);
    setSecondStageResult(null);
    setSecondStageFolders(createSecondStageFolders());
    setSecondStageCards(awardedCards.length ? awardedCards : CATEGORY_ORDER);
    setPhase("secondStageGame");
  }, [phase, awardedCards]);

  const placeSecondStageCardInFolder = useCallback((cardIndex: number, folderId: number) => {
    if (phase !== "secondStageGame" || secondStageResult) return;

    const selectedCard = secondStageCards[cardIndex];
    const targetFolder = secondStageFolders.find((folder) => folder.id === folderId);
    if (!selectedCard || !targetFolder) return;

    const now = Date.now();

    if (targetFolder.state === "empty") {
      if (targetFolder.category !== selectedCard) return;
      setSecondStageFolders((folders) =>
        folders.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                state: "waiting",
                mainCard: selectedCard,
                addedCard: undefined,
                expiresAt: now + FOLDER_LIFETIME_MS,
                blinkAt: now + ADD_CARD_REPLACE_MS,
              }
            : folder
        )
      );
      setSecondStageCards((cards) => {
        const next = cards.filter((_, index) => index !== cardIndex);
        if (next.length === 0) {
          setSecondStageResult(getSecondStageResult(secondStageHype));
        }
        return next;
      });
      setSelectedSecondCardIndex(null);
      setDraggingSecondCardIndex(null);
      setDraggingSecondCardPosition(null);
      setHoveredSecondCardIndex(null);
      setSelectedSecondFolderId(folderId);
      return;
    }

    if (targetFolder.mainCard && selectedCard !== targetFolder.mainCard) {
      const combo = resolveSecondStageCombo(targetFolder.mainCard, selectedCard);
      const projectedHype = combo.hype ? Math.min(HYPE_MAX, secondStageHype + combo.hype) : secondStageHype;
      setSecondStageCards((cards) => {
        const next = cards.filter((_, index) => index !== cardIndex);
        if (combo.card) next.push(combo.card);
        if (next.length === 0) {
          setSecondStageResult(getSecondStageResult(projectedHype));
        }
        return next;
      });
      if (combo.hype) {
        setSecondStageHype((hype) => Math.min(HYPE_MAX, hype + combo.hype));
      }
      setSecondStageFolders((folders) =>
        folders.map((folder) =>
          folder.id === folderId
            ? {
                ...folder,
                addedCard: selectedCard,
                expiresAt: now + 700,
                blinkAt: Number.POSITIVE_INFINITY,
              }
            : folder
        )
      );
      setSelectedSecondCardIndex(null);
      setDraggingSecondCardIndex(null);
      setDraggingSecondCardPosition(null);
      setHoveredSecondCardIndex(null);
      setSelectedSecondFolderId(null);
    }
  }, [phase, secondStageCards, secondStageFolders, secondStageHype, secondStageResult]);

  const handleSecondStageCardClick = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase !== "secondStageGame" || secondStageResult) return;

    const selectedCard = secondStageCards[index];
    if (!selectedCard) return;

    const activeFolder = secondStageFolders.find((folder) => folder.id === selectedSecondFolderId);
    if (activeFolder?.state === "waiting" && activeFolder.mainCard && selectedCard !== activeFolder.mainCard) {
      placeSecondStageCardInFolder(index, activeFolder.id);
      return;
    }

    setSelectedSecondCardIndex((current) => (current === index ? null : index));
  }, [phase, placeSecondStageCardInFolder, secondStageCards, secondStageFolders, secondStageResult, selectedSecondFolderId]);

  const getCanvasDragPosition = useCallback((e: React.DragEvent): DragPosition => {
    const scaledWidth = 1600 * scale;
    const scaledHeight = 900 * scale;
    return {
      x: (e.clientX - (window.innerWidth - scaledWidth) / 2) / scale,
      y: (e.clientY - (window.innerHeight - scaledHeight) / 2) / scale,
    };
  }, [scale]);

  const handleSecondStageCardDragStart = useCallback((index: number, e: React.DragEvent) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
    const emptyDragImage = document.createElement("canvas");
    emptyDragImage.width = 1;
    emptyDragImage.height = 1;
    e.dataTransfer.setDragImage(emptyDragImage, 0, 0);
    setSelectedSecondCardIndex(index);
    setDraggingSecondCardIndex(index);
    setDraggingSecondCardPosition(getCanvasDragPosition(e));
    setHoveredSecondCardIndex(null);
  }, [getCanvasDragPosition]);

  const handleSecondStageCardDrag = useCallback((index: number, e: React.DragEvent) => {
    e.stopPropagation();
    if (e.clientX === 0 && e.clientY === 0) return;
    setDraggingSecondCardIndex(index);
    setDraggingSecondCardPosition(getCanvasDragPosition(e));
  }, [getCanvasDragPosition]);

  const handleSecondStageCardDragEnd = useCallback((e: React.DragEvent) => {
    e.stopPropagation();
    setDraggingSecondCardIndex(null);
    setDraggingSecondCardPosition(null);
    setHoveredSecondCardIndex(null);
  }, []);

  const handleSecondStageFolderClick = useCallback((folderId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase !== "secondStageGame" || secondStageResult || selectedSecondCardIndex === null) return;

    placeSecondStageCardInFolder(selectedSecondCardIndex, folderId);
  }, [phase, placeSecondStageCardInFolder, secondStageResult, selectedSecondCardIndex]);

  const handleSecondStageFolderDrop = useCallback((folderId: number, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cardIndex = Number(e.dataTransfer.getData("text/plain"));
    if (!Number.isFinite(cardIndex)) return;
    placeSecondStageCardInFolder(cardIndex, folderId);
  }, [placeSecondStageCardInFolder]);

  const handleSecondStageFolderCardReturn = useCallback((folderId: number, slot: "main" | "added", e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase !== "secondStageGame" || secondStageResult) return;

    const folder = secondStageFolders.find((item) => item.id === folderId);
    if (!folder?.mainCard) return;

    const now = Date.now();
    const returnedCards: CardCategory[] = [];
    let comboToUndo: SecondStageCombo | null = null;
    if (folder.addedCard) {
      comboToUndo = resolveSecondStageCombo(folder.mainCard, folder.addedCard);
    }

    if (slot === "added") {
      if (!folder.addedCard) return;
      returnedCards.push(folder.addedCard);
    } else {
      returnedCards.push(folder.mainCard);
      if (folder.addedCard) returnedCards.push(folder.addedCard);
    }

    setSecondStageCards((cards) => {
      let next = [...cards];
      if (comboToUndo?.card) {
        const comboCardIndex = next.lastIndexOf(comboToUndo.card);
        if (comboCardIndex >= 0) {
          next = next.filter((_, index) => index !== comboCardIndex);
        }
      }
      return [...next, ...returnedCards];
    });
    if (comboToUndo?.hype) {
      setSecondStageHype((hype) => Math.max(0, hype - comboToUndo.hype));
    }
    setSecondStageFolders((folders) =>
      folders.map((item) =>
        item.id === folderId
          ? slot === "added"
            ? {
                ...item,
                state: "waiting",
                addedCard: undefined,
                expiresAt: now + FOLDER_LIFETIME_MS,
                blinkAt: now + ADD_CARD_REPLACE_MS,
              }
            : {
                ...item,
                state: "empty",
                mainCard: undefined,
                addedCard: undefined,
                expiresAt: now + FOLDER_LIFETIME_MS,
                blinkAt: now + FOLDER_BLINK_MS,
              }
          : item
      )
    );
    setSelectedSecondCardIndex(null);
    setSelectedSecondFolderId(null);
    setDraggingSecondCardIndex(null);
    setDraggingSecondCardPosition(null);
    setHoveredSecondCardIndex(null);
  }, [phase, secondStageFolders, secondStageResult]);

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
      setGuideOpen(false);
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
    if (guideOpen || sceneTransitioning) return;

    if (phase === "gameIntroScrim") {
      setPhase("phraseSelection");
      return;
    }

    if (phase === "gameOutroScrim") {
      startSecondStageTransition();
      return;
    }

    if (phase === "testCompleted" || showSummary) return;
    setMetrics(prev => ({ ...prev, misclicks: prev.misclicks + 1 }));
  }, [phase, showSummary, guideOpen, sceneTransitioning, startSecondStageTransition]);

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
    setGuideOpen(false);
    setSceneTransitioning(false);
    setSecondStageCards([]);
    setSecondStageFolders([]);
    setSelectedSecondCardIndex(null);
    setSelectedSecondFolderId(null);
    setDraggingSecondCardIndex(null);
    setDraggingSecondCardPosition(null);
    setHoveredSecondCardIndex(null);
    setSecondStageHype(HYPE_START);
    setSecondStageSecondsLeft(SECOND_STAGE_GAME_SECONDS);
    setSecondStageResult(null);
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
        {!isSecondStage && (
          <div
            className="absolute inset-0"
            data-name="first_stage"
            style={{
              animation: sceneTransitioning
                ? `firstStageFadeOut ${SCENE_FADE_MS}ms ease-in both`
                : undefined,
              pointerEvents: sceneTransitioning ? "none" : undefined,
            }}
          >
        {/* Background */}
        <div className="absolute h-[900px] left-[-0.42px] top-0 w-[1600px]" data-name="bg">
          <img
            alt=""
            className="absolute inset-0 max-w-none object-cover pointer-events-none size-full"
            src={imgBg}
          />
        </div>

        {(isGameIntroScrim || isPhraseSelection) && <HeroMushroom />}

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
          <Bg game={isGameBackground} />
          <Screen subtractImg={subtractImg} />

          {!isGameScene && (
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
          {showFinalMessages && !isGameScene && <MonitorMessages3 />}
          {isPhraseSelection && (
            <PhraseSelectionScene
              activePhrases={activePhrases}
              onPhraseClick={handlePhraseClick}
              onPhraseExpired={handlePhraseExpired}
            />
          )}
          {(isGameIntroScrim || isPhraseSelection) && (
            <div className="absolute inset-0 pointer-events-none z-[40]">
              <PhraseCounter value={selectedPhraseCount} active={selectedPhraseCount < MAX_SELECTED_PHRASES} />
            </div>
          )}
        </div>

        {isGameScene && <AwardedCards cards={awardedCards} />}

        {isGameIntroScrim && (
          <GameScrim lines={[GAME_INTRO_SCRIM]} onClick={handleGameIntroScrimClick} />
        )}

        {isGameOutroScrim && (
          <GameScrim lines={GAME_OUTRO_SCRIM_LINES} onClick={handleGameOutroScrimClick} />
        )}
          </div>
        )}

        {isSecondStage && (
          <SecondStageScene
            cards={awardedCards}
            draggingCardIndex={draggingSecondCardIndex}
            draggingCardPosition={draggingSecondCardPosition}
            envelopeShaking={isSecondStageAlert && envelopeShaking}
            folders={secondStageFolders}
            gameActive={isSecondStageGame}
            gameCards={secondStageCards}
            gameResult={secondStageResult}
            guideOpen={guideOpen}
            hoveredCardIndex={hoveredSecondCardIndex}
            hype={secondStageHype}
            onEnvelopeClick={handleSecondStageEnvelopeClick}
            onGameCardClick={handleSecondStageCardClick}
            onGameCardDrag={handleSecondStageCardDrag}
            onGameCardDragEnd={handleSecondStageCardDragEnd}
            onGameCardHover={setHoveredSecondCardIndex}
            onGameCardDragStart={handleSecondStageCardDragStart}
            onGameFolderClick={handleSecondStageFolderClick}
            onGameFolderCardReturn={handleSecondStageFolderCardReturn}
            onGameFolderDrop={handleSecondStageFolderDrop}
            onGuideClose={handleGuideClose}
            onGuideOpen={handleGuideOpen}
            onPlayClick={handleSecondStagePlayClick}
            onTipClick={handleTipClick}
            secondsLeft={secondStageSecondsLeft}
            selectedFolderId={selectedSecondFolderId}
            showMessages={isSecondStageMessages}
          />
        )}

        {/* Character phrase scrim */}
        {!isSecondStage && <CharacterPhrase phrase={PHRASE_READING} visible={phraseVisible} />}

        {/* Test summary */}
        {showSummary && (
          <SummaryOverlay metrics={metrics} onRestart={handleRestart} />
        )}
      </div>
    </div>
  );
}
