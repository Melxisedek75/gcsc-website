const pptxgen = require("pptxgenjs");

// Color palette
const C = {
  darkNavy:  "0D1B2A",
  deepBlue:  "1B4F72",
  gold:      "E8B86D",
  offWhite:  "F5F5F5",
  white:     "FFFFFF",
  lightBlue: "AED6F1",
  muted:     "7F8C8D",
  green:     "2C5F2D",
  red:       "C0392B",
  cardBg:    "EBF5FB",
  darkCard:  "1A3A5C",
  textDark:  "1A252F",
  textGrey:  "5D6D7E",
};

const F = {
  title: "Georgia",
  body:  "Calibri",
};

let pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10" x 5.625"
pres.author = "GCSC Project";
pres.title  = "GCSC — Децентрализованный рынок ремонта недвижимости";

// ─────────────────────────────────────────────
// SLIDE 1 — Title
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.darkNavy };

  // Decorative gold bar top
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: C.gold }, line: { color: C.gold },
  });

  // Decorative gold bar bottom
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 5.565, w: 10, h: 0.06,
    fill: { color: C.gold }, line: { color: C.gold },
  });

  // Left accent vertical bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.35, y: 1.2, w: 0.07, h: 3.2,
    fill: { color: C.gold }, line: { color: C.gold },
  });

  // GCSC big title
  s.addText("GCSC", {
    x: 0.6, y: 1.1, w: 9, h: 1.4,
    fontFace: F.title, fontSize: 72, bold: true,
    color: C.gold, align: "left", valign: "middle",
    margin: 0,
  });

  // Subtitle
  s.addText("Децентрализованный рынок ремонта недвижимости", {
    x: 0.6, y: 2.55, w: 8.8, h: 0.7,
    fontFace: F.title, fontSize: 24,
    color: C.white, align: "left", valign: "middle",
    margin: 0,
  });

  // Tagline
  s.addText("Блокчейн решение для рынка строительных услуг", {
    x: 0.6, y: 3.3, w: 8.8, h: 0.5,
    fontFace: F.body, fontSize: 16,
    color: C.lightBlue, align: "left", valign: "middle",
    margin: 0,
  });

  // XPR Network badge
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 4.4, w: 2.6, h: 0.45,
    fill: { color: "1B4F72" }, line: { color: C.gold, pt: 1 },
  });
  s.addText("Powered by XPR Network", {
    x: 0.6, y: 4.4, w: 2.6, h: 0.45,
    fontFace: F.body, fontSize: 11,
    color: C.muted, align: "center", valign: "middle",
    margin: 0,
  });
}

// ─────────────────────────────────────────────
// SLIDE 2 — Problem
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.offWhite };

  // Header bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.85,
    fill: { color: C.darkNavy }, line: { color: C.darkNavy },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.85, w: 10, h: 0.05,
    fill: { color: C.gold }, line: { color: C.gold },
  });

  s.addText("Проблема рынка", {
    x: 0.4, y: 0, w: 9.2, h: 0.85,
    fontFace: F.title, fontSize: 28, bold: true,
    color: C.white, align: "left", valign: "middle", margin: 0,
  });

  const problems = [
    { icon: "✕", title: "Нет доверия",       desc: "Заказчики не знают кому доверять, мастера не получают гарантий оплаты" },
    { icon: "✕", title: "Нет прозрачности",  desc: "Серые схемы, наличные расчёты, никаких гарантий" },
    { icon: "✕", title: "Монополия платформ", desc: "YouDo, Profi.ru берут 15-30% комиссии и контролируют рынок" },
    { icon: "✕", title: "Нет мотивации",     desc: "Ни мастера ни клиенты не заинтересованы в развитии платформы" },
  ];

  // 2x2 grid
  const positions = [
    { col: 0, row: 0 }, { col: 1, row: 0 },
    { col: 0, row: 1 }, { col: 1, row: 1 },
  ];
  const cardW = 4.6, cardH = 1.85;
  const startX = 0.25, startY = 1.1, gapX = 0.3, gapY = 0.2;

  problems.forEach((p, i) => {
    const cx = startX + positions[i].col * (cardW + gapX);
    const cy = startY + positions[i].row * (cardH + gapY);

    // Card background with shadow
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: cardW, h: cardH,
      fill: { color: C.white },
      line: { color: "DDDDDD", pt: 1 },
      shadow: { type: "outer", blur: 5, offset: 2, angle: 135, color: "000000", opacity: 0.1 },
    });

    // Red accent left bar
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: cy, w: 0.07, h: cardH,
      fill: { color: C.red }, line: { color: C.red },
    });

    // Icon
    s.addText(p.icon, {
      x: cx + 0.15, y: cy + 0.15, w: 0.5, h: 0.5,
      fontFace: F.body, fontSize: 20, bold: true,
      color: C.red, align: "center", valign: "middle", margin: 0,
    });

    // Title
    s.addText(p.title, {
      x: cx + 0.15, y: cy + 0.5, w: cardW - 0.2, h: 0.45,
      fontFace: F.title, fontSize: 15, bold: true,
      color: C.textDark, align: "left", valign: "middle", margin: 0,
    });

    // Description
    s.addText(p.desc, {
      x: cx + 0.15, y: cy + 0.95, w: cardW - 0.25, h: 0.8,
      fontFace: F.body, fontSize: 12,
      color: C.textGrey, align: "left", valign: "top",
      wrap: true, margin: 0,
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 3 — Market Analysis
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.offWhite };

  // Header bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.85,
    fill: { color: C.darkNavy }, line: { color: C.darkNavy },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.85, w: 10, h: 0.05,
    fill: { color: C.gold }, line: { color: C.gold },
  });
  s.addText("Анализ рынка — Конкуренты", {
    x: 0.4, y: 0, w: 9.2, h: 0.85,
    fontFace: F.title, fontSize: 28, bold: true,
    color: C.white, align: "left", valign: "middle", margin: 0,
  });

  // Table
  const tableData = [
    [
      { text: "Характеристика", options: { bold: true, color: C.white, fill: { color: C.deepBlue }, fontFace: F.title, fontSize: 13, align: "center" } },
      { text: "YouDo / Profi.ru", options: { bold: true, color: C.white, fill: { color: C.deepBlue }, fontFace: F.title, fontSize: 13, align: "center" } },
      { text: "GCSC", options: { bold: true, color: C.white, fill: { color: C.gold }, fontFace: F.title, fontSize: 13, align: "center" } },
    ],
    [
      { text: "Комиссия", options: { fontFace: F.body, fontSize: 12, bold: true } },
      { text: "15–30%", options: { fontFace: F.body, fontSize: 12, color: C.red, align: "center" } },
      { text: "0–3%", options: { fontFace: F.body, fontSize: 12, color: C.green, bold: true, align: "center" } },
    ],
    [
      { text: "Контроль данных", options: { fontFace: F.body, fontSize: 12, bold: true } },
      { text: "Централизованный", options: { fontFace: F.body, fontSize: 12, align: "center" } },
      { text: "Пользователь владеет", options: { fontFace: F.body, fontSize: 12, color: C.green, bold: true, align: "center" } },
    ],
    [
      { text: "Токен / вознаграждения", options: { fontFace: F.body, fontSize: 12, bold: true } },
      { text: "Нет", options: { fontFace: F.body, fontSize: 12, color: C.red, align: "center" } },
      { text: "GCSCBUILD", options: { fontFace: F.body, fontSize: 12, color: C.green, bold: true, align: "center" } },
    ],
    [
      { text: "Прозрачность", options: { fontFace: F.body, fontSize: 12, bold: true } },
      { text: "Низкая", options: { fontFace: F.body, fontSize: 12, color: C.red, align: "center" } },
      { text: "Блокчейн", options: { fontFace: F.body, fontSize: 12, color: C.green, bold: true, align: "center" } },
    ],
    [
      { text: "Лотерея / бонусы", options: { fontFace: F.body, fontSize: 12, bold: true } },
      { text: "Нет", options: { fontFace: F.body, fontSize: 12, color: C.red, align: "center" } },
      { text: "Да", options: { fontFace: F.body, fontSize: 12, color: C.green, bold: true, align: "center" } },
    ],
  ];

  s.addTable(tableData, {
    x: 0.5, y: 1.05, w: 9, h: 2.8,
    colW: [3.2, 2.8, 3.0],
    rowH: 0.42,
    border: { pt: 1, color: "D5D8DC" },
    fill: { color: C.white },
    autoPage: false,
  });

  // Big stat box
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.05, w: 9, h: 1.0,
    fill: { color: C.darkNavy }, line: { color: C.gold, pt: 2 },
  });
  s.addText([
    { text: "Объём рынка ремонта СНГ: ", options: { color: C.white, fontSize: 20, fontFace: F.body } },
    { text: "$50 млрд+", options: { color: C.gold, fontSize: 24, bold: true, fontFace: F.title } },
  ], {
    x: 0.5, y: 4.05, w: 9, h: 1.0,
    align: "center", valign: "middle", margin: 0,
  });
}

// ─────────────────────────────────────────────
// SLIDE 4 — Solution
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.deepBlue };

  // Gold accent bar top
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: C.gold }, line: { color: C.gold },
  });

  s.addText("GCSC — Наше решение", {
    x: 0.4, y: 0.15, w: 9.2, h: 0.7,
    fontFace: F.title, fontSize: 28, bold: true,
    color: C.white, align: "left", valign: "middle", margin: 0,
  });

  // Divider
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 0.88, w: 9.2, h: 0.04,
    fill: { color: C.gold }, line: { color: C.gold },
  });

  // Left column features
  const features = [
    "Смарт-контракты вместо посредников",
    "GCSCBUILD токен как внутренняя валюта",
    "Прозрачные отзывы на блокчейне",
    "Защита платежей через эскроу",
    "DAO управление платформой",
  ];

  features.forEach((f, i) => {
    const y = 1.1 + i * 0.62;

    // Check icon bg
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y: y, w: 0.38, h: 0.38,
      fill: { color: C.gold }, line: { color: C.gold },
    });
    s.addText("✓", {
      x: 0.4, y: y, w: 0.38, h: 0.38,
      fontFace: F.body, fontSize: 14, bold: true,
      color: C.darkNavy, align: "center", valign: "middle", margin: 0,
    });

    s.addText(f, {
      x: 0.88, y: y + 0.01, w: 4.2, h: 0.38,
      fontFace: F.body, fontSize: 13.5,
      color: C.white, align: "left", valign: "middle", margin: 0,
    });
  });

  // Right column — How it works
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.45, y: 1.0, w: 4.15, h: 4.25,
    fill: { color: "0D3354" }, line: { color: C.gold, pt: 1 },
  });

  s.addText("Как это работает", {
    x: 5.55, y: 1.08, w: 3.95, h: 0.45,
    fontFace: F.title, fontSize: 15, bold: true,
    color: C.gold, align: "center", valign: "middle", margin: 0,
  });

  const steps = [
    "Заказчик создаёт заявку",
    "Мастер откликается",
    "Смарт-контракт блокирует оплату",
    "Работа выполнена — деньги разблокированы",
    "Отзыв записывается в блокчейн",
    "Оба получают GCSCBUILD токены",
  ];

  steps.forEach((st, i) => {
    const sy = 1.62 + i * 0.55;
    // Number circle
    s.addShape(pres.shapes.OVAL, {
      x: 5.6, y: sy, w: 0.32, h: 0.32,
      fill: { color: C.gold }, line: { color: C.gold },
    });
    s.addText(String(i + 1), {
      x: 5.6, y: sy, w: 0.32, h: 0.32,
      fontFace: F.body, fontSize: 10, bold: true,
      color: C.darkNavy, align: "center", valign: "middle", margin: 0,
    });
    s.addText(st, {
      x: 6.02, y: sy + 0.02, w: 3.45, h: 0.32,
      fontFace: F.body, fontSize: 11,
      color: C.white, align: "left", valign: "middle", margin: 0,
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 5 — Unique Features
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.offWhite };

  // Header bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.85,
    fill: { color: C.darkNavy }, line: { color: C.darkNavy },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.85, w: 10, h: 0.05,
    fill: { color: C.gold }, line: { color: C.gold },
  });
  s.addText("Уникальность проекта", {
    x: 0.4, y: 0, w: 9.2, h: 0.85,
    fontFace: F.title, fontSize: 28, bold: true,
    color: C.white, align: "left", valign: "middle", margin: 0,
  });

  const cards = [
    {
      icon: "🎟",
      title: "Еженедельная лотерея",
      desc: "Используй GCSCBUILD токены для участия в розыгрыше. 3 победителя делят призовой фонд: 50 / 30 / 20%",
      accent: C.deepBlue,
    },
    {
      icon: "📣",
      title: "Bounty программа",
      desc: "Зарабатывай GCSCBUILD за продвижение в социальных сетях. Compliance агент проверяет выполненную работу",
      accent: C.green,
    },
    {
      icon: "🏗",
      title: "Токен строителя",
      desc: "GCSCBUILD — внутренняя валюта платформы. Мастера получают его за выполненные работы, тратят на лотерею",
      accent: "C47B2B",
    },
  ];

  const cardW = 2.95, cardH = 3.8;
  const startX = 0.28, startY = 1.1, gap = 0.26;

  cards.forEach((c, i) => {
    const cx = startX + i * (cardW + gap);

    // Card bg
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: startY, w: cardW, h: cardH,
      fill: { color: C.white },
      line: { color: "DDDDDD", pt: 1 },
      shadow: { type: "outer", blur: 6, offset: 3, angle: 135, color: "000000", opacity: 0.1 },
    });

    // Top accent bar
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: startY, w: cardW, h: 0.07,
      fill: { color: c.accent }, line: { color: c.accent },
    });

    // Icon circle
    s.addShape(pres.shapes.OVAL, {
      x: cx + (cardW / 2) - 0.4, y: startY + 0.2, w: 0.8, h: 0.8,
      fill: { color: c.accent }, line: { color: c.accent },
    });
    s.addText(c.icon, {
      x: cx + (cardW / 2) - 0.4, y: startY + 0.2, w: 0.8, h: 0.8,
      fontSize: 22, align: "center", valign: "middle", margin: 0,
    });

    // Number badge
    s.addShape(pres.shapes.OVAL, {
      x: cx + 0.1, y: startY + 0.15, w: 0.32, h: 0.32,
      fill: { color: C.gold }, line: { color: C.gold },
    });
    s.addText(String(i + 1), {
      x: cx + 0.1, y: startY + 0.15, w: 0.32, h: 0.32,
      fontFace: F.body, fontSize: 11, bold: true,
      color: C.darkNavy, align: "center", valign: "middle", margin: 0,
    });

    // Title
    s.addText(c.title, {
      x: cx + 0.1, y: startY + 1.15, w: cardW - 0.2, h: 0.6,
      fontFace: F.title, fontSize: 14, bold: true,
      color: C.textDark, align: "center", valign: "middle", margin: 0,
    });

    // Divider
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx + 0.3, y: startY + 1.8, w: cardW - 0.6, h: 0.04,
      fill: { color: c.accent }, line: { color: c.accent },
    });

    // Description
    s.addText(c.desc, {
      x: cx + 0.12, y: startY + 1.92, w: cardW - 0.24, h: 1.7,
      fontFace: F.body, fontSize: 12,
      color: C.textGrey, align: "center", valign: "top", wrap: true, margin: 0,
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 6 — Token Economy
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.darkNavy };

  // Top gold bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: C.gold }, line: { color: C.gold },
  });

  s.addText("Токеномика", {
    x: 0.4, y: 0.15, w: 9.2, h: 0.65,
    fontFace: F.title, fontSize: 30, bold: true,
    color: C.gold, align: "left", valign: "middle", margin: 0,
  });

  // Gold divider
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 0.83, w: 9.2, h: 0.04,
    fill: { color: C.gold }, line: { color: C.gold },
  });

  // 4 stat boxes
  const stats = [
    { val: "1 ТРЛН",       label: "Максимальный\nвыпуск GCSCBUILD" },
    { val: "0%",           label: "Комиссия за\nпереводы" },
    { val: "50/30/20%",    label: "Распределение\nпризов лотереи" },
    { val: "Еженедельно",  label: "Частота\nрозыгрышей" },
  ];

  const bW = 2.1, bH = 1.6, bY = 1.05;
  const startX = 0.4, gap = 0.27;

  stats.forEach((st, i) => {
    const bx = startX + i * (bW + gap);

    s.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: bY, w: bW, h: bH,
      fill: { color: "1A3A5C" }, line: { color: C.gold, pt: 1 },
    });

    // Gold top accent
    s.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: bY, w: bW, h: 0.07,
      fill: { color: C.gold }, line: { color: C.gold },
    });

    s.addText(st.val, {
      x: bx, y: bY + 0.15, w: bW, h: 0.75,
      fontFace: F.title, fontSize: 24, bold: true,
      color: C.gold, align: "center", valign: "middle", margin: 0,
    });

    s.addText(st.label, {
      x: bx, y: bY + 0.9, w: bW, h: 0.62,
      fontFace: F.body, fontSize: 11,
      color: C.lightBlue, align: "center", valign: "top", margin: 0,
    });
  });

  // Token flow section
  s.addText("Поток токенов", {
    x: 0.4, y: 2.85, w: 9.2, h: 0.4,
    fontFace: F.title, fontSize: 15, bold: true,
    color: C.gold, align: "left", valign: "middle", margin: 0,
  });

  // Flow boxes
  const flow = [
    { label: "Мастера\nи клиенты", color: C.deepBlue },
    { label: "GCSCBUILD\nТокен", color: "2C5F2D" },
    { label: "Еженедельная\nЛотерея", color: "8B6914" },
    { label: "Призы\nGCSC + USDT", color: C.red },
  ];

  const fw = 2.0, fh = 1.0, fy = 3.35, fstartX = 0.4, fgap = 0.53;

  flow.forEach((f, i) => {
    const fx = fstartX + i * (fw + fgap);

    s.addShape(pres.shapes.RECTANGLE, {
      x: fx, y: fy, w: fw, h: fh,
      fill: { color: f.color }, line: { color: C.gold, pt: 1 },
    });
    s.addText(f.label, {
      x: fx, y: fy, w: fw, h: fh,
      fontFace: F.body, fontSize: 12, bold: true,
      color: C.white, align: "center", valign: "middle", margin: 0,
    });

    // Arrow
    if (i < flow.length - 1) {
      const ax = fx + fw + 0.05;
      s.addShape(pres.shapes.RECTANGLE, {
        x: ax, y: fy + fh / 2 - 0.03, w: 0.38, h: 0.06,
        fill: { color: C.gold }, line: { color: C.gold },
      });
      s.addText("▶", {
        x: ax + 0.18, y: fy + fh / 2 - 0.17, w: 0.2, h: 0.35,
        fontSize: 10, color: C.gold, align: "center", valign: "middle", margin: 0,
      });
    }
  });

  // Bounty flow note
  s.addText("Bounty программа → Продвижение → GCSCBUILD вознаграждение", {
    x: 0.4, y: 4.55, w: 9.2, h: 0.45,
    fontFace: F.body, fontSize: 12, italic: true,
    color: C.muted, align: "center", valign: "middle", margin: 0,
  });
}

// ─────────────────────────────────────────────
// SLIDE 7 — 3 Smart Contracts
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.offWhite };

  // Header bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.85,
    fill: { color: C.darkNavy }, line: { color: C.darkNavy },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.85, w: 10, h: 0.05,
    fill: { color: C.gold }, line: { color: C.gold },
  });
  s.addText("Экосистема — 3 смарт-контракта", {
    x: 0.4, y: 0, w: 9.2, h: 0.85,
    fontFace: F.title, fontSize: 28, bold: true,
    color: C.white, align: "left", valign: "middle", margin: 0,
  });

  const contracts = [
    {
      name: "gcscbuild11",
      role: "Токен",
      desc: "Создание, выпуск и перевод токенов GCSCBUILD. Максимальный выпуск 1 трлн токенов. Нулевая комиссия за переводы.",
      color: C.deepBlue,
      features: ["Выпуск токенов", "Переводы между аккаунтами", "Управление балансами"],
    },
    {
      name: "gcscticket1",
      role: "Лотерея",
      desc: "Еженедельные розыгрыши. 1 000 000 GCSCBUILD = 1 билет. 3 победителя получают призы в GCSC и USDT.",
      color: "9B7B2E",
      features: ["Покупка билетов", "Автоматический розыгрыш", "Выплата призов 50/30/20%"],
    },
    {
      name: "gcscbounty1",
      role: "Баунти",
      desc: "Социальные кампании для продвижения GCSC. Compliance агент проверяет выполнение заданий.",
      color: C.green,
      features: ["Создание кампаний", "Проверка заданий", "Выплата вознаграждений"],
    },
  ];

  const cW = 2.9, cH = 4.2, startX = 0.28, startY = 1.05, gap = 0.27;

  contracts.forEach((c, i) => {
    const cx = startX + i * (cW + gap);

    // Card bg
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: startY, w: cW, h: cH,
      fill: { color: C.white },
      line: { color: "DDDDDD", pt: 1 },
      shadow: { type: "outer", blur: 6, offset: 3, angle: 135, color: "000000", opacity: 0.12 },
    });

    // Color header
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx, y: startY, w: cW, h: 1.0,
      fill: { color: c.color }, line: { color: c.color },
    });

    // Contract name
    s.addText(c.name, {
      x: cx + 0.1, y: startY + 0.05, w: cW - 0.2, h: 0.45,
      fontFace: "Courier New", fontSize: 13, bold: true,
      color: C.white, align: "center", valign: "middle", margin: 0,
    });

    // Role badge
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx + (cW / 2) - 0.55, y: startY + 0.58, w: 1.1, h: 0.32,
      fill: { color: C.white }, line: { color: C.white },
    });
    s.addText(c.role, {
      x: cx + (cW / 2) - 0.55, y: startY + 0.58, w: 1.1, h: 0.32,
      fontFace: F.title, fontSize: 13, bold: true,
      color: c.color, align: "center", valign: "middle", margin: 0,
    });

    // Description
    s.addText(c.desc, {
      x: cx + 0.12, y: startY + 1.08, w: cW - 0.24, h: 1.3,
      fontFace: F.body, fontSize: 11,
      color: C.textGrey, align: "left", valign: "top", wrap: true, margin: 0,
    });

    // Features
    s.addShape(pres.shapes.RECTANGLE, {
      x: cx + 0.12, y: startY + 2.45, w: cW - 0.24, h: 0.04,
      fill: { color: c.color }, line: { color: c.color },
    });

    c.features.forEach((f, fi) => {
      const fy = startY + 2.58 + fi * 0.48;
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx + 0.15, y: fy + 0.09, w: 0.1, h: 0.1,
        fill: { color: c.color }, line: { color: c.color },
      });
      s.addText(f, {
        x: cx + 0.32, y: fy, w: cW - 0.5, h: 0.36,
        fontFace: F.body, fontSize: 11,
        color: C.textDark, align: "left", valign: "middle", margin: 0,
      });
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 8 — 6-Month Strategy
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.offWhite };

  // Header bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.85,
    fill: { color: C.darkNavy }, line: { color: C.darkNavy },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.85, w: 10, h: 0.05,
    fill: { color: C.gold }, line: { color: C.gold },
  });
  s.addText("Стратегия на 6 месяцев", {
    x: 0.4, y: 0, w: 9.2, h: 0.85,
    fontFace: F.title, fontSize: 28, bold: true,
    color: C.white, align: "left", valign: "middle", margin: 0,
  });

  // Timeline backbone line
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.6, y: 2.05, w: 8.8, h: 0.06,
    fill: { color: C.deepBlue }, line: { color: C.deepBlue },
  });

  const months = [
    { m: "1", label: "Тестнет",  desc: "Запуск всех 3 контрактов в тестовой сети XPR" },
    { m: "2", label: "Аудит",    desc: "Аудит безопасности смарт-контрактов" },
    { m: "3", label: "Мейннет",  desc: "Деплой в основную сеть. Первый выпуск токенов" },
    { m: "4", label: "Маркетинг",desc: "Bounty кампании. Первые 1000 пользователей" },
    { m: "5", label: "Рост",     desc: "Партнёрства с мастерами. Первые 100 сделок" },
    { m: "6", label: "Листинг",  desc: "Листинг на DEX. Первая лотерея с большим призовым фондом" },
  ];

  const total = months.length;
  const startX = 0.6, endX = 9.4, spanW = endX - startX;
  const step = spanW / (total - 1);

  months.forEach((m, i) => {
    const cx = startX + i * step;
    const isEven = i % 2 === 0;

    // Node circle
    s.addShape(pres.shapes.OVAL, {
      x: cx - 0.22, y: 2.08 - 0.22, w: 0.44, h: 0.44,
      fill: { color: isEven ? C.deepBlue : C.gold },
      line: { color: C.white, pt: 2 },
    });
    s.addText(m.m, {
      x: cx - 0.22, y: 2.08 - 0.22, w: 0.44, h: 0.44,
      fontFace: F.body, fontSize: 11, bold: true,
      color: isEven ? C.white : C.darkNavy,
      align: "center", valign: "middle", margin: 0,
    });

    // Month label (above or below)
    if (isEven) {
      // Above
      s.addText("Мес. " + m.m, {
        x: cx - 0.7, y: 1.0, w: 1.4, h: 0.3,
        fontFace: F.body, fontSize: 10, bold: true,
        color: C.deepBlue, align: "center", valign: "middle", margin: 0,
      });
      s.addText(m.label, {
        x: cx - 0.7, y: 1.28, w: 1.4, h: 0.3,
        fontFace: F.title, fontSize: 12, bold: true,
        color: C.textDark, align: "center", valign: "middle", margin: 0,
      });
      // Connector
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx - 0.02, y: 1.58, w: 0.04, h: 0.5,
        fill: { color: C.deepBlue }, line: { color: C.deepBlue },
      });
      s.addText(m.desc, {
        x: cx - 0.9, y: 2.6, w: 1.8, h: 0.85,
        fontFace: F.body, fontSize: 9.5,
        color: C.textGrey, align: "center", valign: "top", wrap: true, margin: 0,
      });
    } else {
      // Below
      s.addText("Мес. " + m.m, {
        x: cx - 0.7, y: 3.4, w: 1.4, h: 0.3,
        fontFace: F.body, fontSize: 10, bold: true,
        color: "9B7B2E", align: "center", valign: "middle", margin: 0,
      });
      s.addText(m.label, {
        x: cx - 0.7, y: 3.68, w: 1.4, h: 0.3,
        fontFace: F.title, fontSize: 12, bold: true,
        color: C.textDark, align: "center", valign: "middle", margin: 0,
      });
      // Connector
      s.addShape(pres.shapes.RECTANGLE, {
        x: cx - 0.02, y: 2.5, w: 0.04, h: 0.5,
        fill: { color: C.gold }, line: { color: C.gold },
      });
      s.addText(m.desc, {
        x: cx - 0.9, y: 4.0, w: 1.8, h: 0.85,
        fontFace: F.body, fontSize: 9.5,
        color: C.textGrey, align: "center", valign: "top", wrap: true, margin: 0,
      });
    }
  });
}

// ─────────────────────────────────────────────
// SLIDE 9 — Launch Plan
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.deepBlue };

  // Gold accent bar top
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.06,
    fill: { color: C.gold }, line: { color: C.gold },
  });

  s.addText("План запуска токена", {
    x: 0.4, y: 0.15, w: 9.2, h: 0.65,
    fontFace: F.title, fontSize: 28, bold: true,
    color: C.white, align: "left", valign: "middle", margin: 0,
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 0.83, w: 9.2, h: 0.04,
    fill: { color: C.gold }, line: { color: C.gold },
  });

  const steps = [
    { icon: "✓", status: "done",    text: "Смарт-контракты готовы (сейчас)" },
    { icon: "↻", status: "active",  text: "Создание аккаунтов в XPR Testnet (gcscdao@gmail.com)" },
    { icon: "≡", status: "pending", text: "Деплой контрактов командой proton contract:set" },
    { icon: "⚗", status: "pending", text: "Тестирование: выпуск GCSCBUILD, первые тикеты, первые баунти" },
    { icon: "🔒", status: "pending", text: "Аудит безопасности" },
    { icon: "★", status: "pending", text: "Мейннет запуск + маркетинговая кампания" },
  ];

  const statusColor = { done: C.green, active: C.gold, pending: C.muted };

  steps.forEach((st, i) => {
    const y = 1.05 + i * 0.7;
    const sc = statusColor[st.status];

    // Step number box
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.4, y: y, w: 0.38, h: 0.45,
      fill: { color: sc }, line: { color: sc },
    });
    s.addText(String(i + 1), {
      x: 0.4, y: y, w: 0.38, h: 0.45,
      fontFace: F.body, fontSize: 13, bold: true,
      color: C.white, align: "center", valign: "middle", margin: 0,
    });

    // Status icon
    s.addText(st.icon, {
      x: 0.9, y: y + 0.02, w: 0.4, h: 0.4,
      fontSize: 16, color: sc, align: "center", valign: "middle", margin: 0,
    });

    // Text
    s.addText(st.text, {
      x: 1.38, y: y, w: 8.0, h: 0.45,
      fontFace: F.body, fontSize: 14,
      color: st.status === "done" ? C.white : (st.status === "active" ? C.gold : C.lightBlue),
      bold: st.status !== "pending",
      align: "left", valign: "middle", margin: 0,
    });

    // Connector line (not on last)
    if (i < steps.length - 1) {
      s.addShape(pres.shapes.RECTANGLE, {
        x: 0.59, y: y + 0.45, w: 0.04, h: 0.25,
        fill: { color: sc }, line: { color: sc },
      });
    }
  });
}

// ─────────────────────────────────────────────
// SLIDE 10 — Marketing Strategy
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.offWhite };

  // Header bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.85,
    fill: { color: C.darkNavy }, line: { color: C.darkNavy },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.85, w: 10, h: 0.05,
    fill: { color: C.gold }, line: { color: C.gold },
  });
  s.addText("Маркетинговая стратегия", {
    x: 0.4, y: 0, w: 9.2, h: 0.85,
    fontFace: F.title, fontSize: 28, bold: true,
    color: C.white, align: "left", valign: "middle", margin: 0,
  });

  // Vertical divider
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.0, y: 1.0, w: 0.04, h: 4.3,
    fill: { color: C.gold }, line: { color: C.gold },
  });

  // Left column
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 1.0, w: 4.55, h: 0.5,
    fill: { color: C.deepBlue }, line: { color: C.deepBlue },
  });
  s.addText("Когда начинать", {
    x: 0.3, y: 1.0, w: 4.55, h: 0.5,
    fontFace: F.title, fontSize: 16, bold: true,
    color: C.white, align: "center", valign: "middle", margin: 0,
  });

  const leftItems = [
    "Сразу после деплоя в тестнет — bounty кампании",
    "Twitter / X — продвижение и анонсы",
    "Telegram канал GCSC сообщества",
    "YouTube видео о проекте и обучение",
  ];

  leftItems.forEach((item, i) => {
    const y = 1.65 + i * 0.72;
    s.addShape(pres.shapes.RECTANGLE, {
      x: 0.3, y: y, w: 0.06, h: 0.38,
      fill: { color: C.gold }, line: { color: C.gold },
    });
    s.addText(item, {
      x: 0.5, y: y, w: 4.35, h: 0.5,
      fontFace: F.body, fontSize: 13,
      color: C.textDark, align: "left", valign: "middle", wrap: true, margin: 0,
    });
  });

  // Right column
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.18, y: 1.0, w: 4.52, h: 0.5,
    fill: { color: C.green }, line: { color: C.green },
  });
  s.addText("Как привлекать", {
    x: 5.18, y: 1.0, w: 4.52, h: 0.5,
    fontFace: F.title, fontSize: 16, bold: true,
    color: C.white, align: "center", valign: "middle", margin: 0,
  });

  const rightItems = [
    { icon: "📣", text: "Bounty за репосты и обзоры в соцсетях" },
    { icon: "🔗", text: "Реферальная программа для пользователей" },
    { icon: "🎟",  text: "Лотерея как вирусный механизм привлечения" },
    { icon: "📊", text: "Публичная аналитика и отчёты на блокчейне" },
  ];

  rightItems.forEach((item, i) => {
    const y = 1.65 + i * 0.72;
    s.addText(item.icon, {
      x: 5.18, y: y, w: 0.5, h: 0.45,
      fontSize: 18, align: "center", valign: "middle", margin: 0,
    });
    s.addText(item.text, {
      x: 5.72, y: y, w: 3.95, h: 0.5,
      fontFace: F.body, fontSize: 13,
      color: C.textDark, align: "left", valign: "middle", wrap: true, margin: 0,
    });
  });

  // Bottom goal box
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.3, y: 4.75, w: 9.4, h: 0.65,
    fill: { color: C.darkNavy }, line: { color: C.gold, pt: 1 },
  });
  s.addText("Цель: 1 000 пользователей за первые 4 месяца через Bounty + Лотерею", {
    x: 0.3, y: 4.75, w: 9.4, h: 0.65,
    fontFace: F.body, fontSize: 13, bold: true,
    color: C.gold, align: "center", valign: "middle", margin: 0,
  });
}

// ─────────────────────────────────────────────
// SLIDE 11 — Why Unique
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.offWhite };

  // Header bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.85,
    fill: { color: C.darkNavy }, line: { color: C.darkNavy },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0.85, w: 10, h: 0.05,
    fill: { color: C.gold }, line: { color: C.gold },
  });
  s.addText("Почему GCSC изменит рынок", {
    x: 0.4, y: 0, w: 9.2, h: 0.85,
    fontFace: F.title, fontSize: 28, bold: true,
    color: C.white, align: "left", valign: "middle", margin: 0,
  });

  // Big commission comparison
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.4, y: 1.05, w: 9.2, h: 1.55,
    fill: { color: C.darkNavy }, line: { color: C.gold, pt: 2 },
  });

  s.addText([
    { text: "15–30%", options: { color: C.red, fontSize: 36, bold: true, fontFace: F.title } },
    { text: "   →   ", options: { color: C.white, fontSize: 28, fontFace: F.body } },
    { text: "до 3%", options: { color: C.gold, fontSize: 36, bold: true, fontFace: F.title } },
  ], {
    x: 0.4, y: 1.05, w: 9.2, h: 0.85,
    align: "center", valign: "middle", margin: 0,
  });

  s.addText("Снижение комиссии платформы в 5–10 раз", {
    x: 0.4, y: 1.9, w: 9.2, h: 0.45,
    fontFace: F.body, fontSize: 13,
    color: C.lightBlue, align: "center", valign: "middle", margin: 0,
  });

  // Points
  const points = [
    { icon: "🥇", text: "Первый децентрализованный рынок ремонта на XPR Network" },
    { icon: "🎮", text: "Геймификация (лотерея) удерживает пользователей на платформе" },
    { icon: "📣", text: "Bounty создаёт армию амбассадоров с первого дня запуска" },
    { icon: "🏛",  text: "DAO позволяет сообществу управлять платформой и её развитием" },
  ];

  points.forEach((p, i) => {
    const y = 2.75 + i * 0.65;
    const col = i % 2 === 0 ? 0 : 1;
    const row = Math.floor(i / 2);
    const px = 0.4 + col * 4.8;
    const py = 2.75 + row * 0.65;

    // Icon bg
    s.addShape(pres.shapes.OVAL, {
      x: px, y: py + 0.05, w: 0.42, h: 0.42,
      fill: { color: C.deepBlue }, line: { color: C.gold, pt: 1 },
    });
    s.addText(p.icon, {
      x: px, y: py + 0.05, w: 0.42, h: 0.42,
      fontSize: 16, align: "center", valign: "middle", margin: 0,
    });

    s.addText(p.text, {
      x: px + 0.52, y: py, w: 4.2, h: 0.52,
      fontFace: F.body, fontSize: 13,
      color: C.textDark, align: "left", valign: "middle", wrap: true, margin: 0,
    });
  });
}

// ─────────────────────────────────────────────
// SLIDE 12 — Call to Action
// ─────────────────────────────────────────────
{
  let s = pres.addSlide();
  s.background = { color: C.darkNavy };

  // Top gold bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10, h: 0.07,
    fill: { color: C.gold }, line: { color: C.gold },
  });

  // Decorative circles (background feel)
  s.addShape(pres.shapes.OVAL, {
    x: -0.5, y: -0.5, w: 3, h: 3,
    fill: { color: "1B4F72", transparency: 60 }, line: { color: "1B4F72", transparency: 60 },
  });
  s.addShape(pres.shapes.OVAL, {
    x: 8.0, y: 3.0, w: 2.5, h: 2.5,
    fill: { color: "1B4F72", transparency: 60 }, line: { color: "1B4F72", transparency: 60 },
  });

  // Main title
  s.addText("Присоединяйся к GCSC", {
    x: 0.5, y: 0.35, w: 9, h: 0.9,
    fontFace: F.title, fontSize: 42, bold: true,
    color: C.gold, align: "center", valign: "middle", margin: 0,
  });

  // Subtitle
  s.addText("Построим будущее рынка ремонта вместе", {
    x: 0.5, y: 1.28, w: 9, h: 0.5,
    fontFace: F.body, fontSize: 18,
    color: C.white, align: "center", valign: "middle", margin: 0,
  });

  // Gold divider
  s.addShape(pres.shapes.RECTANGLE, {
    x: 3.0, y: 1.9, w: 4.0, h: 0.05,
    fill: { color: C.gold }, line: { color: C.gold },
  });

  // 3 action boxes
  const actions = [
    { icon: "✉", label: "Email",   value: "gcscdao@gmail.com" },
    { icon: "🌐", label: "Network", value: "XPR Network Testnet" },
    { icon: "💻", label: "GitHub",  value: "gcscbuild11" },
  ];

  const bW = 2.7, bH = 1.2, bY = 2.2;
  const bStartX = 0.45, bGap = 0.35;

  actions.forEach((a, i) => {
    const bx = bStartX + i * (bW + bGap);

    s.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: bY, w: bW, h: bH,
      fill: { color: "1A3A5C" }, line: { color: C.gold, pt: 1.5 },
    });

    s.addText(a.icon, {
      x: bx, y: bY + 0.1, w: bW, h: 0.42,
      fontSize: 22, align: "center", valign: "middle", margin: 0,
    });

    s.addText(a.value, {
      x: bx + 0.1, y: bY + 0.6, w: bW - 0.2, h: 0.45,
      fontFace: F.body, fontSize: 12, bold: true,
      color: C.gold, align: "center", valign: "middle", margin: 0,
    });
  });

  // Bottom tagline
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.75, w: 10, h: 0.82,
    fill: { color: "0A1520" }, line: { color: "0A1520" },
  });
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 4.75, w: 10, h: 0.05,
    fill: { color: C.gold }, line: { color: C.gold },
  });
  s.addText("GCSC — Доверие. Прозрачность. Блокчейн.", {
    x: 0.5, y: 4.8, w: 9, h: 0.6,
    fontFace: F.title, fontSize: 18, bold: true, italic: true,
    color: C.gold, align: "center", valign: "middle", margin: 0,
  });
}

// ─────────────────────────────────────────────
// Save
// ─────────────────────────────────────────────
pres.writeFile({ fileName: "C:\\gcsc\\GCSC_Presentation.pptx" })
  .then(() => console.log("✅  Saved: C:\\gcsc\\GCSC_Presentation.pptx"))
  .catch(err => { console.error("ERROR:", err); process.exit(1); });
