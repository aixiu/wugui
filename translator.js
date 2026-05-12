/**
 * 纯静态站点多语言翻译引擎
 * 适用于 Next.js 静态导出 (output: 'export') 环境
 * 自动拦截失效的 Server Action，实现客户端语言切换
 */
(function() {
  // 🔹 完整翻译字典（已包含 enUS, zhCN, esES, ptPT, deDE, ruRU）
  const i18n = {
    enUS: {
      "general.language": "Change language",
      "general.select_language": "Select your preferred language.",
      "calculator.title": "Talent calculator",
      "calculator.level": "Level: {lvl}",
      "calculator.points_left": "Points left: {points}",
      "calculator.share.button": "Share",
      "calculator.clear_points": "Clear points",
      "footer.created_by": "Created by Haaxor1689",
      "footer.report_bug": "Report a bug",
      "general.back_to_main_site": "Back to main site",
      "calculator.pick_class": "Choose a class"
    },
    zhCN: {
      "general.language": "切换语言",
      "general.select_language": "选择您的首选语言。",
      "calculator.title": "天赋模拟器",
      "calculator.level": "等级：{lvl}",
      "calculator.points_left": "剩余点数：{points}",
      "calculator.share.button": "分享",
      "calculator.clear_points": "清空点数",
      "footer.created_by": "由 Haaxor1689 制作",
      "footer.report_bug": "反馈 BUG",
      "general.back_to_main_site": "返回主站",
      "calculator.pick_class": "选择职业"
    },
    esES: {
      "general.language": "Cambiar idioma",
      "general.select_language": "Selecciona tu idioma preferido.",
      "calculator.title": "Calculadora de talentos",
      "calculator.level": "Nivel: {lvl}",
      "calculator.points_left": "Puntos restantes: {points}",
      "calculator.share.button": "Compartir",
      "calculator.clear_points": "Limpiar puntos",
      "footer.created_by": "Creado por Haaxor1689",
      "footer.report_bug": "Reportar error",
      "general.back_to_main_site": "Volver al sitio principal",
      "calculator.pick_class": "Elige una clase"
    },
    ptPT: {
      "general.language": "Alterar idioma",
      "general.select_language": "Selecione seu idioma preferido.",
      "calculator.title": "Calculadora de talentos",
      "calculator.level": "Nível: {lvl}",
      "calculator.points_left": "Pontos restantes: {points}",
      "calculator.share.button": "Compartilhar",
      "calculator.clear_points": "Limpar pontos",
      "footer.created_by": "Criado por Haaxor1689",
      "footer.report_bug": "Reportar bug",
      "general.back_to_main_site": "Voltar ao site principal",
      "calculator.pick_class": "Escolha uma classe"
    },
    deDE: {
      "general.language": "Sprache ändern",
      "general.select_language": "Wählen Sie Ihre bevorzugte Sprache.",
      "calculator.title": "Talentrechner",
      "calculator.level": "Stufe: {lvl}",
      "calculator.points_left": "Verbleibende Punkte: {points}",
      "calculator.share.button": "Teilen",
      "calculator.clear_points": "Punkte löschen",
      "footer.created_by": "Erstellt von Haaxor1689",
      "footer.report_bug": "Fehler melden",
      "general.back_to_main_site": "Zurück zur Hauptseite",
      "calculator.pick_class": "Wähle eine Klasse"
    },
    ruRU: {
      "general.language": "Сменить язык",
      "general.select_language": "Выберите предпочитаемый язык.",
      "calculator.title": "Калькулятор талантов",
      "calculator.level": "Уровень: {lvl}",
      "calculator.points_left": "Осталось очков: {points}",
      "calculator.share.button": "Поделиться",
      "calculator.clear_points": "Очистить очки",
      "footer.created_by": "Создано Haaxor1689",
      "footer.report_bug": "Сообщить об ошибке",
      "general.back_to_main_site": "Вернуться на главную",
      "calculator.pick_class": "Выберите класс"
    }
  };

  // 🔹 获取当前语言（优先 localStorage，其次默认 enUS）
  function getLocale() {
    return localStorage.getItem('tw_locale') || 'enUS';
  }

  // 🔹 设置语言并应用
  function setLocale(locale) {
    if (!i18n[locale]) locale = 'enUS';
    localStorage.setItem('tw_locale', locale);
    applyTranslations();
    document.documentElement.lang = locale;
  }

  // 🔹 核心翻译函数
  function applyTranslations() {
    const locale = getLocale();
    const dict = i18n[locale];

    // 1. 翻译带 data-i18n 的元素
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        let text = dict[key];
        // 动态填充占位符 {points}, {lvl}
        const ptsEl = document.querySelector('[data-i18n="calculator.points_left"]');
        if (ptsEl) {
          const match = ptsEl.textContent.match(/\d+/);
          text = text.replace('{points}', match ? match[0] : '51');
        }
        const lvlEl = document.querySelector('[data-i18n="calculator.level"]');
        if (lvlEl) {
          const match = lvlEl.textContent.match(/\d+/);
          text = text.replace('{lvl}', match ? match[0] : '60');
        }
        el.textContent = text;
      }
    });

    // 2. 高亮当前语言按钮
    document.querySelectorAll('.lang-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.locale === locale);
    });
  }

  // 🔹 拦截并绑定语言切换按钮
  function bindLangSwitcher() {
    const langMap = {
      'English': 'enUS', 'Chinese': 'zhCN', 'Spanish': 'esES',
      'Portuguese': 'ptPT', 'German': 'deDE', 'Russian': 'ruRU'
    };

    // 使用事件委托，兼容 Next.js 静态导出后的 DOM 结构
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;

      const text = btn.textContent.trim();
      if (langMap[text]) {
        e.preventDefault();
        e.stopPropagation();
        setLocale(langMap[text]);
        // 关闭可能弹出的语言选择框
        const dialog = document.querySelector('dialog[open], [role="dialog"][style*="display"]');
        if (dialog) dialog.style.display = 'none';
      }
    });
  }

  // 🔹 初始化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      bindLangSwitcher();
      applyTranslations();
    });
  } else {
    bindLangSwitcher();
    applyTranslations();
  }
})();