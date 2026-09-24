// 実測データ（GA4 / Search Console、2026-09-24 取得）
// 月次ページビュー: 運営サイト合算、2023-08 〜 2026-09
export const PV_START = { year: 2023, month: 8 };
export const PV_MONTHLY = [0, 0, 0, 0, 189713, 412766, 670236, 1216709, 1210999, 1433841, 1388914, 1382761, 1111127, 1083485, 1215387, 988757, 804893, 722079, 581128, 434673, 220481, 326415, 358833, 280629, 379587, 331059, 360447, 339275, 286428, 167326, 134522, 106224, 110093, 95537, 84589, 138520, 291145, 185535];
export const PV_PEAK = { value: 1433841, users: 448208, label: "2024.05" };
export const PV_TOTAL = 19044113;
export const GSC_28D = { clicks: 100669, impressions: 3093611, position: 6.4, asOf: "2026.09" };

// 「使う道具」の力学グラフ。hub は分類、leaf は道具。w は見た目の大きさ
export const SKILLS = [
  { id: "ai",      label: "AI",             hub: true,  w: 1.0 },
  { id: "claude",  label: "Claude Code",    hub: false, w: 0.9, to: ["ai"] },
  { id: "cursor",  label: "Cursor",         hub: false, w: 0.7, to: ["ai"] },
  { id: "antig",   label: "Antigravity",    hub: false, w: 0.7, to: ["ai"] },
  { id: "gemini",  label: "Gemini CLI",     hub: false, w: 0.5, to: ["ai"] },
  { id: "copilot", label: "GitHub Copilot", hub: false, w: 0.5, to: ["ai", "git"] },
  { id: "app",     label: "App",            hub: true,  w: 1.0, to: ["ai"] },
  { id: "swift",   label: "Swift / SwiftUI",hub: false, w: 0.9, to: ["app"] },
  { id: "flutter", label: "Flutter",        hub: false, w: 0.9, to: ["app", "firebase"] },
  { id: "kotlin",  label: "Kotlin",         hub: false, w: 0.5, to: ["app"] },
  { id: "web",     label: "Web",            hub: true,  w: 1.0, to: ["ai"] },
  { id: "wp",      label: "WordPress",      hub: false, w: 0.9, to: ["web", "php", "seo"] },
  { id: "php",     label: "PHP",            hub: false, w: 0.6, to: ["web"] },
  { id: "next",    label: "Next.js / React",hub: false, w: 0.8, to: ["web", "firebase"] },
  { id: "tw",      label: "Tailwind CSS",   hub: false, w: 0.5, to: ["next"] },
  { id: "rails",   label: "Ruby on Rails",  hub: false, w: 0.5, to: ["web"] },
  { id: "infra",   label: "Infra",          hub: true,  w: 0.9, to: ["app", "web"] },
  { id: "firebase",label: "Firebase",       hub: false, w: 0.8, to: ["infra", "swift"] },
  { id: "git",     label: "Git / GitHub",   hub: false, w: 0.7, to: ["infra"] },
  { id: "growth",  label: "Growth",         hub: true,  w: 0.9, to: ["web"] },
  { id: "seo",     label: "SEO",            hub: false, w: 0.8, to: ["growth"] },
  { id: "gsc",     label: "Search Console / GA4", hub: false, w: 0.6, to: ["growth", "seo"] },
];
