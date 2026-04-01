/**
 * SafeCode Lab — Interactive Cybersecurity Game
 * Material 3 Expressive Edition
 */

// ===== THEME SYSTEM =====
const THEMES = {
    expressive: { name: 'Expressive', icon: '🎨', description: 'Material 3 Expressive — vibrant & dynamic' },
    ember: { name: 'Ember', icon: '🌙', description: 'Warm dark expressive — calm & readable' },
    paper: { name: 'Paper', icon: '📄', description: 'Warm light theme with ink-like contrast' }
};

class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('safeCodeTheme') || 'expressive';
        this.applyTheme(this.currentTheme);
    }

    applyTheme(themeId) {
        // Migrate removed theme ids to closest match
        if (themeId === 'sunset') themeId = 'ember';
        if (themeId === 'dark-expressive' || themeId === 'cyber' || themeId === 'midnight' || themeId === 'aurora' || themeId === 'forest') {
            themeId = 'ember';
        }
        if (themeId === 'minimal') themeId = 'paper';
        if (!THEMES[themeId]) themeId = 'expressive';
        document.documentElement.setAttribute('data-theme', themeId);
        localStorage.setItem('safeCodeTheme', themeId);
        this.currentTheme = themeId;
        this.updateThemeButton();
        // Логируем только если UI инициализирован
        if (UI.get('toast')) {
            UI.logConsole(`Тема изменена: ${THEMES[themeId].name}`);
            UI.showToast(`Тема: ${THEMES[themeId].name}`, 'info');
        }
    }

    cycleTheme() {
        const themeIds = Object.keys(THEMES);
        const currentIndex = themeIds.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themeIds.length;
        this.applyTheme(themeIds[nextIndex]);
    }

    updateThemeButton() {
        const btn = document.getElementById('themeBtn');
        if (btn) {
            const theme = THEMES[this.currentTheme];
            btn.innerHTML = `<span>${theme.icon}</span> ${theme.name}`;
            btn.setAttribute('aria-label', `Сменить тему (текущая: ${theme.name})`);
        }
    }

    renderThemeSelector() {
        // Можно добавить модальное окно с выбором тем
        return Object.entries(THEMES).map(([id, theme]) => `
      <button class="theme-option ${id === this.currentTheme ? 'active' : ''}" 
              data-theme="${id}"
              aria-pressed="${id === this.currentTheme}">
        <span class="theme-icon">${theme.icon}</span>
        <span class="theme-name">${theme.name}</span>
        <span class="theme-desc">${theme.description}</span>
      </button>
        `).join('');
    }
}

// ===== SECRET DEVELOPER TERMINAL =====
class SecretTerminal {
    static COMMANDS = {
        help: 'Список команд',
        clear: '🧹 Очистить терминал',
        scan: '🔍 Сканирование портов',
        hash: '🔐 Генератор хешей',
        passgen: '🎲 Генератор паролей',
        whois: '🌐 WHOIS (напр. whois google.com)',
        encrypt: '🛡️ Шифровать текст (Base64)',
        decrypt: '🔓 Расшифровать текст (Base64)',
        rot1: '🔀 Шифрование ROT1',
        derot1: '🔓 Расшифровка ROT1',
        tips: '💡 Советы по ИБ',
        matrix: '🟢 Матрица (анимация)',
        exit: 'Выход'
    };

    static cheatUsed = false;
    static cheatActive = false;

    static init() {
        this.setupTriggers();
    }

    static setupTriggers() {
        document.querySelector('.brand')?.addEventListener('click', () => this.open());

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                this.open();
            }
        });

        document.getElementById('terminalClose')?.addEventListener('click', () => this.close());
        document.getElementById('terminalInput')?.addEventListener('keydown', (e) => this.handleInput(e));
    }

    static open() {
        const overlay = document.getElementById('terminalOverlay');
        overlay.classList.add('show');
        overlay.setAttribute('aria-hidden', 'false');
        document.getElementById('terminalInput')?.focus();
        this.printWelcome();
    }

    static close() {
        const overlay = document.getElementById('terminalOverlay');
        overlay.classList.remove('show');
        overlay.setAttribute('aria-hidden', 'true');
    }

    static printWelcome() {
        const output = document.getElementById('terminalOutput');
        output.innerHTML = `<div class="terminal-line info">╔═══════════════════════════════════════════════╗</div>
<div class="terminal-line info">║     🛡️ SafeCode Terminal v2.0                 ║</div>
<div class="terminal-line info">║     Cybersecurity Tools & Utilities            ║</div>
<div class="terminal-line info">╚═══════════════════════════════════════════════╝</div>
<div class="terminal-line info">Введите 'help' для списка команд</div>
<div class="terminal-line"></div>`;
    }

    static handleInput(e) {
        const input = e.target;

        if (e.key === 'Enter') {
            const cmdText = input.value.trim();
            if (cmdText) {
                this.addToHistory(cmdText);
                this.execute(cmdText);
            }
            input.value = '';
        }

        if (e.key === 'Tab') {
            e.preventDefault();
            const partial = input.value.toLowerCase();
            const matches = Object.keys(this.COMMANDS).filter(c => c.startsWith(partial));
            if (matches.length === 1) input.value = matches[0];
        }

        if (e.key === 'ArrowUp') { e.preventDefault(); this.navigateHistory(input, -1); }
        if (e.key === 'ArrowDown') { e.preventDefault(); this.navigateHistory(input, 1); }
        if (e.key === 'Escape') this.close();
    }

    static cmdHistory = [];
    static cmdHistoryIndex = -1;

    static addToHistory(cmd) {
        this.cmdHistory.unshift(cmd);
        if (this.cmdHistory.length > 20) this.cmdHistory.pop();
        this.cmdHistoryIndex = -1;
    }

    static navigateHistory(input, dir) {
        if (!this.cmdHistory.length) return;
        this.cmdHistoryIndex = Math.max(-1, Math.min(this.cmdHistory.length - 1, this.cmdHistoryIndex + dir));
        input.value = this.cmdHistoryIndex >= 0 ? this.cmdHistory[this.cmdHistoryIndex] : '';
    }

    static execute(fullCmd) {
        const output = document.getElementById('terminalOutput');
        output.innerHTML += `<div class="terminal-line cmd">$ ${escapeHtml(fullCmd)}</div>`;

        const parts = fullCmd.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        const handlers = {
            help: () => {
                output.innerHTML += `<div class="terminal-line highlight">📋 Доступные команды:</div>`;
                for (const [c, d] of Object.entries(this.COMMANDS)) {
                    output.innerHTML += `<div class="terminal-line">  <span style="color:var(--md-sys-color-primary);font-weight:700">${c.padEnd(10)}</span> — ${d}</div>`;
                }
            },

            clear: () => {
                this.printWelcome();
            },

            scan: () => {
                this.runPortScan(output);
            },

            hash: () => {
                const hash = this.simpleHash(Date.now().toString());
                output.innerHTML += `<div class="terminal-line success">🔐 SHA-256: ${hash}</div>`;
                output.innerHTML += `<div class="terminal-line info">(симуляция для демонстрации)</div>`;
            },

            passgen: () => {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
                let pass = '';
                for (let i = 0; i < 16; i++) pass += chars[Math.floor(Math.random() * chars.length)];
                output.innerHTML += `<div class="terminal-line success">🎲 Пароль: ${pass}</div>`;
            },

            whois: () => {
                const domain = args[0] || 'safecodelab.ru';
                output.innerHTML += `<div class="terminal-line info">🌐 WHOIS lookup для ${escapeHtml(domain)}:</div>`;
                output.innerHTML += `<div class="terminal-line">Registrar: Domain Registrar</div>`;
                output.innerHTML += `<div class="terminal-line">Created: 2026-01-01</div>`;
                output.innerHTML += `<div class="terminal-line">Expires: 2027-01-01</div>`;
                output.innerHTML += `<div class="terminal-line info">(симуляция)</div>`;
            },

            encrypt: () => {
                const text = args.join(' ');
                if (!text) {
                    output.innerHTML += `<div class="terminal-line error">Использование: encrypt [текст]</div>`;
                    return;
                }
                try {
                    const encrypted = btoa(unescape(encodeURIComponent(text)));
                    output.innerHTML += `<div class="terminal-line success">🛡️ Зашифровано (Base64): ${encrypted}</div>`;
                } catch (e) {
                    output.innerHTML += `<div class="terminal-line error">❌ Ошибка шифрования.</div>`;
                }
            },

            decrypt: () => {
                const text = args.join(' ');
                if (!text) {
                    output.innerHTML += `<div class="terminal-line error">Использование: decrypt [текст]</div>`;
                    return;
                }
                try {
                    const decrypted = decodeURIComponent(escape(atob(text)));
                    output.innerHTML += `<div class="terminal-line success">🔓 Расшифровано (Base64): ${escapeHtml(decrypted)}</div>`;
                } catch (e) {
                    output.innerHTML += `<div class="terminal-line error">❌ Ошибка расшифровки. Неверный формат Base64.</div>`;
                }
            },

            rot1: () => {
                const text = args.join(' ') || 'CYBERSECURITY';
                const encrypted = text.split('').map(c => String.fromCharCode(c.charCodeAt(0) + 1)).join('');
                output.innerHTML += `<div class="terminal-line success">🔀 Зашифровано (ROT1): ${escapeHtml(encrypted)}</div>`;
            },

            derot1: () => {
                const text = args.join(' ') || 'DZCFSTFDVSJUZ';
                const decoded = text.split('').map(c => String.fromCharCode(c.charCodeAt(0) - 1)).join('');
                output.innerHTML += `<div class="terminal-line success">🔓 Расшифровано (ROT1): ${escapeHtml(decoded)}</div>`;
            },

            tips: () => {
                const tips = [
                    '🔐 Используйте разные пароли для каждого аккаунта',
                    '🔄 Включите двухфакторную аутентификацию (2FA)',
                    '📧 Не открывайте подозрительные ссылки в письмах',
                    '🔒 Используйте менеджер паролей',
                    '🛡️ Регулярно обновляйте программное обеспечение',
                    '📱 Не подключайтесь к публичным Wi-Fi без VPN',
                    '☠️ Не скачивайте файлы с ненадёжных источников'
                ];
                output.innerHTML += `<div class="terminal-line highlight">💡 Рекомендации по безопасности:</div>`;
                tips.forEach(tip => output.innerHTML += `<div class="terminal-line">${tip}</div>`);
            },

            matrix: () => {
                this.runMatrixAnimation(output);
            },

            exit: () => this.close()
        };

        const handler = handlers[cmd];
        if (handler) {
            handler();
        } else {
            output.innerHTML += `<div class="terminal-line error">❌ Неизвестная команда: ${escapeHtml(cmd)}</div>`;
        }

        output.scrollTop = output.scrollHeight;
    }

    static simpleHash(str) {
        let hash = '';
        for (let i = 0; i < 64; i++) {
            hash += '0123456789abcdef'[Math.floor(Math.random() * 16)];
        }
        return hash;
    }

    static runPortScan(output) {
        output.innerHTML += `<div class="terminal-line info">🔍 Сканирование портов...</div>`;

        const ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 465, 587, 993, 995, 3306, 3389, 5432, 8080];
        const openPorts = ports.filter(() => Math.random() > 0.7);

        let i = 0;
        const interval = setInterval(() => {
            if (i >= ports.length) {
                clearInterval(interval);
                if (openPorts.length === 0) {
                    output.innerHTML += `<div class="terminal-line">Открытых портов не обнаружено</div>`;
                } else {
                    output.innerHTML += `<div class="terminal-line success">✅ Открытые порты: ${openPorts.join(', ')}</div>`;
                }
                output.scrollTop = output.scrollHeight;
                return;
            }
            output.innerHTML += `<div class="terminal-line" style="opacity:0.5">Проверка порта ${ports[i]}...</div>`;
            output.scrollTop = output.scrollHeight;
            i++;
        }, 100);
    }

    static runMatrixAnimation(output) {
        output.innerHTML += `<div class="terminal-line" style="color:#0f0;text-shadow:0 0 10px #0f0">🟢 Активация матрицы...</div>`;

        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ';
        const lines = [];
        const cols = 20;

        for (let i = 0; i < 30; i++) {
            let line = '';
            for (let j = 0; j < cols; j++) {
                if (Math.random() > 0.3) {
                    line += chars[Math.floor(Math.random() * chars.length)] + ' ';
                } else {
                    line += '   ';
                }
            }
            lines.push(line);
        }

        let i = 0;
        const interval = setInterval(() => {
            if (i >= lines.length) {
                clearInterval(interval);
                output.innerHTML += `<div class="terminal-line success">✅ Матрица завершена</div>`;
                output.scrollTop = output.scrollHeight;
                return;
            }
            output.innerHTML += `<div class="terminal-line matrix-anim" style="color:#0f0;font-family:monospace;font-size:11px">${lines[i]}</div>`;
            output.scrollTop = output.scrollHeight;
            i++;
        }, 80);
    }
}

// ===== SESSION HISTORY =====
class SessionHistory {
    static STORAGE_KEY = 'safeCodeHistory';
    static MAX_SESSIONS = 20;

    static getSessions() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    static save(session) {
        const sessions = this.getSessions();
        sessions.unshift(session);
        if (sessions.length > this.MAX_SESSIONS) {
            sessions.pop();
        }
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessions));
    }

    static clear() {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    static render() {
        const sessions = this.getSessions();
        const list = document.getElementById('historyList');
        const empty = document.getElementById('historyEmpty');

        if (sessions.length === 0) {
            empty.classList.remove('hidden');
            list.innerHTML = '';
            return;
        }

        empty.classList.add('hidden');
        list.innerHTML = sessions.map(session => {
            const date = new Date(session.date);
            const dateStr = date.toLocaleDateString('ru-RU', {
                day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
            });
            const minutes = Math.floor(session.time / 60);
            const seconds = session.time % 60;
            const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            const isAbandoned = session.status === 'abandoned';
            const isCompleted = session.status === 'completed';
            const statusBadge = isAbandoned
                ? '<span class="history-status-failed">❌ Прервано</span>'
                : (isCompleted ? '<span class="history-status-completed">✅ Выполнено</span>' : '');

            return `
            <div class="history-item ${isAbandoned ? 'history-item-abandoned' : ''} ${isCompleted ? 'history-item-completed' : ''}">
                <div class="history-item-header">
                    <span class="history-item-date">${dateStr}</span>
                    <span class="history-item-score">${session.score} очков</span>
                </div>
                <div class="history-item-stats">
                    <span>✓ ${session.correct}/${session.total}</span>
                    <span>🎯 ${session.accuracy}%</span>
                    <span>💡 ${session.hintsUsed}</span>
                    <span>⏱ ${timeStr}</span>
                    ${session.perfectStreak > 0 ? `<span>⭐ ${session.perfectStreak}</span>` : ''}
                    ${statusBadge}
                </div>
            </div>
        `;
        }).join('');
    }
}

// ===== GAME STATE =====
const GameState = {
    deck: [],
    currentIndex: 0,
    score: 0,
    correctCount: 0,
    hintsUsed: 0,
    perfectStreak: 0,
    answered: false,
    selectedLine: null,
    selectedAnswer: null,
    startTime: null,
    timerId: null,
    strictMode: false,

    reset() {
        this.deck = shuffleArray([...allTasks]).slice(0, 10);
        this.currentIndex = 0;
        this.score = 0;
        this.correctCount = 0;
        this.hintsUsed = 0;
        this.perfectStreak = 0;
        this.answered = false;
        this.selectedLine = null;
        this.selectedAnswer = null;
        this.startTime = Date.now();
        this.clearTimer();
    },

    clearTimer() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    },

    startTimer(updateCallback) {
        this.clearTimer();
        this.timerId = setInterval(() => {
            if (updateCallback) updateCallback();
        }, 1000);
    },

    getElapsedTime() {
        return Date.now() - (this.startTime || Date.now());
    },

    calculatePoints(hintsUsed) {
        if (hintsUsed === 0) return 15;
        if (hintsUsed === 1) return 11;
        return 7;
    },

    isComplete() {
        return this.currentIndex >= this.deck.length;
    }
};

// ===== UTILITIES =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
}

function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function formatTime(ms) {
    const total = Math.floor(ms / 1000);
    const mins = String(Math.floor(total / 60)).padStart(2, '0');
    const secs = String(total % 60).padStart(2, '0');
    return `${mins}:${secs}`;
}

// ===== UI HELPERS =====
const UI = {
    elements: {},

    init() {
        // Cache all DOM elements
        this.elements = {
            bgFeed: document.getElementById('bgFeed'),
            fileTabs: document.getElementById('fileTabs'),
            filePreview: document.getElementById('filePreview'),
            scanBtn: document.getElementById('scanBtn'),
            themeBtn: document.getElementById('themeBtn'),
            restartBtn: document.getElementById('restartBtn'),
            taskCounter: document.getElementById('taskCounter'),
            scoreCounter: document.getElementById('scoreCounter'),
            timeCounter: document.getElementById('timeCounter'),
            hintCounter: document.getElementById('hintCounter'),
            levelPill: document.getElementById('levelPill'),
            progressPill: document.getElementById('progressPill'),
            progressFill: document.getElementById('progressFill'),
            progressText: document.getElementById('progressText'),
            taskBadge: document.getElementById('taskBadge'),
            taskTitle: document.getElementById('taskTitle'),
            taskQuestion: document.getElementById('taskQuestion'),
            taskType: document.getElementById('taskType'),
            taskMeta: document.getElementById('taskMeta'),
            codeBlock: document.getElementById('codeBlock'),
            options: document.getElementById('options'),
            hintBtn1: document.getElementById('hintBtn1'),
            hintBtn2: document.getElementById('hintBtn2'),
            checkBtn: document.getElementById('checkBtn'),
            nextBtn: document.getElementById('nextBtn'),
            hintBox: document.getElementById('hintBox'),
            feedbackBox: document.getElementById('feedbackBox'),
            consoleBox: document.getElementById('consoleBox'),
            toast: document.getElementById('toast'),
            taskCard: document.getElementById('taskCard'),
            gameView: document.getElementById('gameView'),
            resultView: document.getElementById('resultView'),
            resultLevel: document.getElementById('resultLevel'),
            resultText: document.getElementById('resultText'),
            finalScore: document.getElementById('finalScore'),
            finalCorrect: document.getElementById('finalCorrect'),
            finalPerfect: document.getElementById('finalPerfect'),
            finalPercent: document.getElementById('finalPercent'),
            againBtn: document.getElementById('againBtn'),
        };
    },

    get(id) {
        return this.elements[id];
    },

    toggleClass(element, className, force) {
        if (typeof force === 'boolean') {
            element.classList.toggle(className, force);
        } else {
            element.classList.toggle(className);
        }
    },

    showToast(message, type = 'info') {
        const toast = this.get('toast');
        toast.textContent = message;
        toast.className = `toast show ${type}`;

        // Auto-hide with proper cleanup
        clearTimeout(this._toastTimer);
        this._toastTimer = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    },

    logConsole(message) {
        const stamp = new Date().toLocaleTimeString('ru-RU', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        });

        const row = document.createElement('div');
        row.className = 'console-line';
        row.innerHTML = `<span style="color:var(--code-comment)">[${stamp}]</span> ${escapeHtml(message)}`;

        const consoleBox = this.get('consoleBox');
        consoleBox.prepend(row);

        // Limit console lines
        while (consoleBox.children.length > 15) {
            consoleBox.removeChild(consoleBox.lastChild);
        }

        // Also add to background feed
        this.addToFeed(message);
    },

    addToFeed(message) {
        const stamp = new Date().toLocaleTimeString('ru-RU', {
            hour: '2-digit', minute: '2-digit'
        });

        const row = document.createElement('div');
        row.className = 'feed-line';
        row.style.setProperty('--i', Math.random() * 20);
        row.textContent = `[${stamp}] ${message}`;

        const feed = this.get('bgFeed');
        feed.prepend(row);

        // Limit feed lines
        while (feed.children.length > 20) {
            feed.removeChild(feed.lastChild);
        }
    },

    updateStats() {
        const { currentIndex, score, hintsUsed, deck } = GameState;
        const total = deck.length;
        const current = Math.min(currentIndex + (GameState.answered ? 1 : 0), total);
        const percent = Math.round((current / total) * 100);

        this.get('taskCounter').textContent = `${current}/${total}`;
        this.get('scoreCounter').textContent = score;
        this.get('hintCounter').textContent = hintsUsed;
        this.get('progressPill').textContent = `${current} / ${total}`;
        this.get('progressText').textContent = `${percent}%`;
        this.get('progressFill').style.width = `${percent}%`;
        this.get('timeCounter').textContent = formatTime(GameState.getElapsedTime());
        this.get('levelPill').textContent = GameState.answered ? 'Проверка' : 'Работаем';
    }
};

// ===== TASK RENDERER =====
const TaskRenderer = {
    render(task) {
        const { gameView, resultView } = UI.elements;

        // Reset state
        GameState.answered = false;
        GameState.selectedLine = null;
        GameState.selectedAnswer = null;
        GameState.currentHints = 0;

        // Show game view, hide result
        gameView.classList.remove('hidden');
        resultView.classList.add('hidden');

        // Update header
        UI.get('taskBadge').textContent = `Задание ${GameState.currentIndex + 1}/${GameState.deck.length}`;
        UI.get('taskTitle').textContent = task.title;
        UI.get('taskQuestion').textContent = task.question;
        UI.get('taskType').textContent = task.mode === 'line' ? 'Клик по строке' : 'Тест';
        UI.get('taskMeta').textContent = task.vulnType;

        // Reset UI elements
        UI.get('hintBox').classList.add('hidden');
        UI.get('hintBox').innerHTML = '';
        delete UI.get('hintBox').dataset.hint1;
        delete UI.get('hintBox').dataset.hint2;
        UI.get('feedbackBox').className = 'feedback-box';
        UI.get('feedbackBox').innerHTML = '';
        UI.get('nextBtn').disabled = true;
        UI.get('nextBtn').textContent = GameState.currentIndex === GameState.deck.length - 1 ? 'Финиш' : 'Следующее';
        UI.get('checkBtn').classList.toggle('hidden', task.mode !== 'line');
        UI.get('checkBtn').disabled = true;
        UI.get('hintBtn1').disabled = false;
        UI.get('hintBtn2').disabled = false;

        // Render code block
        this.renderCode(task);

        // Render options if MCQ mode
        if (task.mode === 'mcq') {
            this.renderOptions(task);
            UI.get('options').style.display = 'grid';
        } else {
            UI.get('options').style.display = 'none';
            UI.get('options').innerHTML = '';
        }

        // Add enter animation
        UI.get('taskCard').classList.remove('enter');
        // Force reflow for animation restart
        void UI.get('taskCard').offsetWidth;
        UI.get('taskCard').classList.add('enter');

        // Log and update
        UI.logConsole(`Загружено: ${task.title}`);
        UI.updateStats();
    },

    renderCode(task) {
        const codeBlock = UI.get('codeBlock');
        codeBlock.innerHTML = task.lines.map((line, index) => {
            const lineNum = index + 1;
            const isSelectable = task.mode === 'line';
            const ariaLabel = isSelectable ? `Строка ${lineNum}: ${escapeHtml(line)}` : '';

            if (isSelectable) {
                return `
        <button class="code-line selectable" type="button"
                data-line="${lineNum}" tabindex="0"
                aria-label="${ariaLabel}">
          <span class="ln">${lineNum}</span>
          <span class="txt">${this.syntaxHighlight(line)}</span>
        </button>
      `;
            }

            return `
        <div class="code-line static" aria-hidden="true">
          <span class="ln">${lineNum}</span>
          <span class="txt">${this.syntaxHighlight(line)}</span>
        </div>
      `;
        }).join('');

        // Add event listeners for line mode
        if (task.mode === 'line') {
            codeBlock.querySelectorAll('.code-line.selectable').forEach(btn => {
                btn.addEventListener('click', () => this.handleLineSelect(btn, task));
                btn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.handleLineSelect(btn, task);
                    }
                });
            });
        }
    },

    syntaxHighlight(code) {
        // Single-pass highlighter (avoids breaking injected HTML)
        const src = escapeHtml(code);
        const re = /(\/\/.*|#.*)|(["'])(?:\\.|(?!\2).)*\2|\b(if|else|while|for|return|def|class|import|from)\b|\b(\w+)(?=\s*\()|\b(\d+)\b|([=+\-*/<>!]=?|&&|\|\|)/g;
        return src.replace(re, (m, comment, _q, kw, fn, num, op) => {
            if (comment) return `<span class="cmt">${comment}</span>`;
            if (m[0] === '"' || m[0] === "'") return `<span class="str">${m}</span>`;
            if (kw) return `<span class="kw">${kw}</span>`;
            if (fn) return `<span class="fn">${fn}</span>`;
            if (num) return `<span class="num">${num}</span>`;
            if (op) return `<span class="op">${op}</span>`;
            return m;
        });
    },

    renderOptions(task) {
        const options = UI.get('options');
        options.innerHTML = task.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index);
            const ariaLabel = `Вариант ${letter}: ${escapeHtml(option)}`;
            return `
        <button class="answer-btn" type="button" data-index="${index}"
                aria-label="${ariaLabel}">
          <span class="answer-tag">${letter}</span>
          <span class="answer-text">${escapeHtml(option)}</span>
        </button>
      `;
        }).join('');

        // Add event listeners
        options.querySelectorAll('.answer-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleAnswerSelect(btn, task));
        });
    },

    handleLineSelect(btn, task) {
        if (GameState.answered) return;

        // Clear previous selection
        btn.parentElement.querySelectorAll('.code-line').forEach(l => l.classList.remove('selected'));
        btn.classList.add('selected');

        const lineNum = parseInt(btn.dataset.line);
        GameState.selectedLine = lineNum;

        // Enable check button
        UI.get('checkBtn').disabled = false;
        UI.logConsole(`Выбрана строка ${lineNum}`);
    },

    handleAnswerSelect(btn, task) {
        if (GameState.answered) return;

        // Clear previous selection
        btn.parentElement.querySelectorAll('.answer-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        const answerIndex = parseInt(btn.dataset.index);
        GameState.selectedAnswer = answerIndex;

        // Auto-check for MCQ mode
        this.checkAnswer(task);
    },

    checkAnswer(task) {
        if (GameState.answered) return;

        let isCorrect = false;

        if (task.mode === 'mcq') {
            isCorrect = GameState.selectedAnswer === task.answer;
        } else if (task.mode === 'line') {
            isCorrect = GameState.selectedLine === task.answerLine;
        }

        this.showFeedback(task, isCorrect);
        GameState.answered = true;

        if (isCorrect) {
            GameState.correctCount++;
            const points = GameState.calculatePoints(GameState.currentHints || 0);
            GameState.score += points;
            if ((GameState.currentHints || 0) === 0) GameState.perfectStreak++;
            UI.logConsole(`✅ Верно! +${points} очков`);
        } else {
            UI.logConsole(`❌ Неверно. Правильный ответ: ${this.getCorrectAnswerText(task)}`);
        }

        // Update UI state
        UI.get('nextBtn').disabled = false;
        UI.get('hintBtn1').disabled = true;
        UI.get('hintBtn2').disabled = true;
        if (task.mode === 'line') {
            UI.get('checkBtn').disabled = true;
        }

        UI.updateStats();
    },

    getCorrectAnswerText(task) {
        if (task.mode === 'mcq') {
            return task.options[task.answer];
        } else if (task.mode === 'line') {
            return `Строка ${task.answerLine}: ${task.lines[task.answerLine - 1]}`;
        }
        return 'Неизвестно';
    },

    showFeedback(task, isCorrect) {
        const feedback = UI.get('feedbackBox');
        feedback.className = `feedback-box ${isCorrect ? 'correct' : 'incorrect'}`;

        const correctIcon = isCorrect ? '✅' : '❌';
        const actionText = isCorrect ? 'Отлично!' : 'Попробуем разобраться:';

        feedback.innerHTML = `
      <strong>${correctIcon} ${actionText}</strong><br>
      ${escapeHtml(task.explanation)}
    `;

        // Scroll feedback into view
        feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
};

// ===== HINT SYSTEM =====
const HintSystem = {
    showHint(level) {
        if (GameState.answered) return;

        const task = GameState.deck[GameState.currentIndex];
        const hintBox = UI.get('hintBox');

        if (level === 1 && !hintBox.dataset.hint1) {
            hintBox.dataset.hint1 = '1';
            GameState.currentHints = (GameState.currentHints || 0) + 1;
            GameState.hintsUsed++;
            UI.get('hintCounter').textContent = GameState.hintsUsed;
            UI.logConsole(`Подсказка #1 использована`);
        }

        if (level === 2 && !hintBox.dataset.hint2) {
            hintBox.dataset.hint2 = '1';
            GameState.currentHints = (GameState.currentHints || 0) + 1;
            GameState.hintsUsed++;
            UI.get('hintCounter').textContent = GameState.hintsUsed;
            UI.logConsole(`Подсказка #2 использована`);
        }

        // Build hint content
        const hints = [];
        if (hintBox.dataset.hint1) hints.push(`<strong>💡 Подсказка 1:</strong> ${escapeHtml(task.hint1)}`);
        if (hintBox.dataset.hint2) hints.push(`<strong>💡 Подсказка 2:</strong> ${escapeHtml(task.hint2)}`);

        hintBox.innerHTML = hints.join('<br><br>');
        hintBox.classList.remove('hidden');

        // Disable used hint buttons
        if (hintBox.dataset.hint1) UI.get('hintBtn1').disabled = true;
        if (hintBox.dataset.hint2) UI.get('hintBtn2').disabled = true;
    }
};

// ===== RESULT SCREEN =====
const ResultScreen = {
    show() {
        const { gameView, resultView } = UI.elements;
        const total = GameState.deck.length;
        const accuracy = Math.round((GameState.correctCount / total) * 100);

        // Save session to history (completed)
        SessionHistory.save({
            date: new Date().toISOString(),
            score: GameState.score,
            correct: GameState.correctCount,
            total: total,
            accuracy: accuracy,
            hintsUsed: GameState.hintsUsed,
            perfectStreak: GameState.perfectStreak,
            time: GameState.startTime ? Math.round((Date.now() - GameState.startTime) / 1000) : 0,
            status: 'completed'
        });

        // Hide game, show result
        gameView.classList.add('hidden');
        resultView.classList.remove('hidden');

        // Calculate level
        let level = 'Новичок';
        let levelDesc = 'Хорошее начало! Продолжай изучать основы ИБ.';

        if (accuracy >= 90 && GameState.hintsUsed <= 2) {
            level = 'Эксперт 🔐';
            levelDesc = 'Впечатляющий результат! Вы отлично разбираетесь в кибербезопасности.';
        } else if (accuracy >= 70) {
            level = 'Продвинутый 🛡️';
            levelDesc = 'Отличная работа! Вы уверенно определяете уязвимости.';
        } else if (accuracy >= 50) {
            level = 'Развивающийся 🔍';
            levelDesc = 'Вы на правильном пути! Практика сделает вас ещё лучше.';
        }

        // Update result content
        UI.get('resultLevel').textContent = level;
        UI.get('resultText').textContent = levelDesc;
        UI.get('finalScore').textContent = GameState.score;
        UI.get('finalCorrect').textContent = `${GameState.correctCount}/${total}`;
        UI.get('finalPerfect').textContent = GameState.perfectStreak;
        UI.get('finalPercent').textContent = `${accuracy}%`;

        // Stop timer
        GameState.clearTimer();

        UI.logConsole(`🏁 Сессия завершена! Результат: ${accuracy}%`);
    }
};

// ===== INITIALIZATION =====
let themeManager;

function initGame() {
    // Initialize UI references
    UI.init();

    // Initialize theme system
    themeManager = new ThemeManager();

    // Initialize diagnostics system
    const diagnostics = new DiagnosticsManager();
    diagnostics.init();

    // Initialize file manager system
    const fileManager = new FileManager();
    fileManager.init();

    // Initialize secret terminal
    SecretTerminal.init();

    // Setup event listeners
    setupEventListeners();

    // Render file tabs
    renderFileTabs();

    // Start new game
    startNewGame();
}

function setupEventListeners() {
    // Theme toggle
    UI.get('themeBtn')?.addEventListener('click', () => {
        themeManager.cycleTheme();
    });

    // Restart buttons
    const restartModal = document.getElementById('restartConfirmModal');
    const restartConfirmBtn = document.getElementById('restartConfirmBtn');
    const restartCancelBtn = document.getElementById('restartCancelBtn');

    UI.get('restartBtn')?.addEventListener('click', () => {
        restartModal.classList.add('show');
        restartModal.setAttribute('aria-hidden', 'false');
    });

    restartCancelBtn?.addEventListener('click', () => {
        restartModal.classList.remove('show');
        restartModal.setAttribute('aria-hidden', 'true');
    });

    restartConfirmBtn?.addEventListener('click', () => {
        const total = GameState.deck.length;
        const accuracy = GameState.currentIndex > 0 ? Math.round((GameState.correctCount / GameState.currentIndex) * 100) : 0;

        SessionHistory.save({
            date: new Date().toISOString(),
            score: GameState.score,
            correct: GameState.correctCount,
            total: GameState.currentIndex,
            accuracy: accuracy,
            hintsUsed: GameState.hintsUsed,
            perfectStreak: GameState.perfectStreak,
            time: GameState.startTime ? Math.round((Date.now() - GameState.startTime) / 1000) : 0,
            status: 'abandoned'
        });

        restartModal.classList.remove('show');
        restartModal.setAttribute('aria-hidden', 'true');
        startNewGame();
    });

    UI.get('againBtn')?.addEventListener('click', () => startNewGame());

    // Hint buttons
    UI.get('hintBtn1')?.addEventListener('click', () => HintSystem.showHint(1));
    UI.get('hintBtn2')?.addEventListener('click', () => HintSystem.showHint(2));

    // Check button (line mode)
    UI.get('checkBtn')?.addEventListener('click', () => {
        const task = GameState.deck[GameState.currentIndex];
        TaskRenderer.checkAnswer(task);
    });

    // Next button
    UI.get('nextBtn')?.addEventListener('click', () => {
        GameState.currentIndex++;

        if (GameState.isComplete()) {
            ResultScreen.show();
        } else {
            const nextTask = GameState.deck[GameState.currentIndex];
            TaskRenderer.render(nextTask);
        }
    });

    // Scan button (demo)
    UI.get('scanBtn')?.addEventListener('click', () => {
        const btn = UI.get('scanBtn');
        if (!btn || btn.classList.contains('scanning')) return;

        btn.classList.add('scanning');
        btn.disabled = true;
        document.documentElement.classList.add('scanning');

        UI.showToast('Диагностика: сканирование...', 'info');
        UI.logConsole('🔎 Диагностика: запуск сканирования...');

        clearTimeout(UI._scanTimer);
        UI._scanTimer = setTimeout(() => {
            btn.classList.remove('scanning');
            btn.disabled = false;
            document.documentElement.classList.remove('scanning');

            UI.showToast('Диагностика: Все системы в норме ✓', 'success');
            UI.logConsole('🔍 Диагностика завершена: уязвимостей не обнаружено');
        }, 1400);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        // Skip if typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        // Next task on Enter (when enabled)
        if (e.key === 'Enter' && !UI.get('nextBtn').disabled) {
            UI.get('nextBtn').click();
        }

        // Hint 1 on Ctrl+1
        if (e.ctrlKey && e.key === '1') {
            e.preventDefault();
            UI.get('hintBtn1')?.click();
        }

        // Hint 2 on Ctrl+2
        if (e.ctrlKey && e.key === '2') {
            e.preventDefault();
            UI.get('hintBtn2')?.click();
        }
    });

    // History modal
    const historyBtn = document.getElementById('historyBtn');
    const historyModal = document.getElementById('historyModal');
    const historyBackdrop = document.getElementById('historyBackdrop');

    historyBtn?.addEventListener('click', () => {
        SessionHistory.render();
        historyModal.classList.add('show');
        historyModal.setAttribute('aria-hidden', 'false');
    });

    const closeHistoryModal = () => {
        historyModal.classList.remove('show');
        historyModal.setAttribute('aria-hidden', 'true');
    };

    document.getElementById('historyClose')?.addEventListener('click', closeHistoryModal);
    document.getElementById('historyCloseBtn')?.addEventListener('click', closeHistoryModal);
    historyBackdrop?.addEventListener('click', closeHistoryModal);

    document.getElementById('historyClear')?.addEventListener('click', () => {
        if (confirm('Очистить всю историю сессий?')) {
            SessionHistory.clear();
            SessionHistory.render();
            UI.showToast('История очищена', 'info');
        }
    });
}

function renderFileTabs() {
    const tabs = UI.get('fileTabs');
    const preview = UI.get('filePreview');

    if (!tabs || !preview) return;

    tabs.innerHTML = fileTabsData.map((file, index) => `
    <button class="tab-btn ${index === 0 ? 'active' : ''}" 
            type="button"
            data-file="${file.name}"
            aria-controls="filePreview">
      ${escapeHtml(file.name)}
    </button>
  `).join('');

    // Set initial info preview
    preview.innerHTML = getFileInfoPanel(fileTabsData[0].name);

    // Add tab click handlers
    tabs.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update info panel
            const fileName = btn.dataset.file;
            preview.innerHTML = getFileInfoPanel(fileName);
            UI.logConsole(`📄 Выбран файл: ${fileName} (кликните для открытия)`);
        });
    });
}

function getFileInfoPanel(fileName) {
    const fileInfo = {
        'auth.py': { lines: 45, size: '1.2 KB', language: 'Python', description: 'Хеширует пароли и управляет сессиями' },
        'api.py': { lines: 52, size: '1.8 KB', language: 'Python', description: 'Проверяет токены и раздает права' },
        'config.py': { lines: 28, size: '0.9 KB', language: 'Python', description: 'Хранит настройки приложения' },
        'database.py': { lines: 38, size: '1.1 KB', language: 'Python', description: 'Работает с базой данных' },
        'middleware.py': { lines: 35, size: '1.0 KB', language: 'Python', description: 'Проверяет данные и пишет логи' },
        'security.py': { lines: 42, size: '1.3 KB', language: 'Python', description: 'Защищает от XSS и CSRF' },
        'utils.py': { lines: 30, size: '0.8 KB', language: 'Python', description: 'Вспомогательные функции' }
    };

    const info = fileInfo[fileName] || { lines: 0, size: '0 KB', language: 'Unknown', description: 'Неизвестный файл' };

    return `<div class="file-info-panel">
        <div class="file-info-header">📋 ${escapeHtml(fileName)}</div>
        <div class="file-info-desc">📝 ${escapeHtml(info.description)}</div>
        <div class="file-info-stats">
            <span>📊 ${info.lines} строк</span>
            <span>💾 ${info.size}</span>
            <span>🔤 ${info.language}</span>
        </div>
        <div class="file-info-hint">👆 Нажмите для просмотра кода</div>
    </div>`;
}

function startNewGame() {
    // Reset game state
    GameState.reset();
    GameState.currentHints = 0;

    // Start timer
    GameState.startTimer(() => UI.updateStats());

    // Animate console on new game
    const consoleBox = UI.get('consoleBox');
    consoleBox.classList.remove('loaded');
    setTimeout(() => consoleBox.classList.add('loaded'), 100);

    // Render first task
    if (GameState.deck.length > 0) {
        TaskRenderer.render(GameState.deck[0]);
        UI.logConsole('🎮 Новая сессия начата');
        UI.showToast('Удачи в поиске уязвимостей! 🛡️', 'success');
    }
}

// ===== DATA =====
const fileTabsData = [
    {
        name: 'auth.py',
        preview: 'def hash_password(password):\n    salt = secrets.token_hex(16)\n    hashed = hashlib.pbkdf2_hmac(...)\n    return f"{salt}${hashed.hex()}"'
    },
    {
        name: 'api.py',
        preview: 'def require_auth(f):\n    @wraps(f)\n    def decorated(*args):\n        token = request.headers.get("Authorization")\n        if not verify_token(token):\n            return 401'
    },
    {
        name: 'config.py',
        preview: 'class Config:\n    SECRET_KEY = os.getenv("SECRET_KEY")\n    DATABASE_URL = os.getenv("DATABASE_URL")\n    JWT_ALGORITHM = "HS256"'
    },
    {
        name: 'database.py',
        preview: 'def execute(self, query, params=()):\n    with self.get_connection() as conn:\n        cursor = conn.cursor()\n        cursor.execute(query, params)'
    },
    {
        name: 'middleware.py',
        preview: 'def validate_input(required_fields):\n    def decorator(f):\n        for field in required_fields:\n            if field not in data:\n                return 400'
    },
    {
        name: 'security.py',
        preview: 'def sanitize_html(text):\n    return html.escape(text)\n\ndef validate_password(password):\n    if len(password) < 12: return False'
    },
    {
        name: 'utils.py',
        preview: 'def get_timestamp():\n    return datetime.utcnow().isoformat()\n\ndef format_date(date_obj):\n    return date_obj.strftime("%d.%m.%Y")'
    }
];

const allTasks = [
    {
        title: 'Уязвимость SQL-инъекции',
        question: 'В какой строке находится уязвимость SQL-инъекции?',
        mode: 'line',
        vulnType: 'SQL Injection',
        lines: [
            'def get_user(user_id):',
            '    # Получение пользователя из БД',
            '    query = "SELECT * FROM users WHERE id = " + user_id',
            '    result = db.execute(query)',
            '    return result'
        ],
        answerLine: 3,
        hint1: 'Обратите внимание на формирование SQL-запроса',
        hint2: 'Конкатенация строк в SQL-запросе позволяет внедрить вредоносный код',
        explanation: 'Строка 3: прямая конкатенация user_id в SQL-запрос позволяет выполнить SQL-инъекцию. Используйте параметризованные запросы.'
    },
    {
        title: 'Слабый пароль',
        question: 'Какая уязвимость присутствует в коде аутентификации?',
        mode: 'mcq',
        vulnType: 'Weak Password',
        lines: [
            'def authenticate(username, password):',
            '    if password == "123456":',
            '        return login_user(username)',
            '    return False'
        ],
        options: [
            'Уязвимость XSS',
            'Слабый хардкод-пароль',
            'Отсутствует валидация ввода',
            'Уязвимость CSRF'
        ],
        answer: 1,
        hint1: 'Посмотрите на значение пароля в коде',
        hint2: 'Пароль слишком простой и зашит в коде',
        explanation: 'В коде используется слабый хардкод-пароль "123456", который легко подобрать.'
    },
    {
        title: 'Отсутствует проверка ввода',
        question: 'В какой строке отсутствует проверка пользовательского ввода?',
        mode: 'line',
        vulnType: 'Input Validation',
        lines: [
            'def process_email(email):',
            '    # Отправка письма',
            '    send_email(email, "Welcome!")',
            '    return True'
        ],
        answerLine: 3,
        hint1: 'Где используется пользовательский ввод без проверки?',
        hint2: 'Email должен валидироваться перед использованием',
        explanation: 'Строка 3: email используется без предварительной валидации формата.'
    },
    {
        title: 'Хардкод секретных ключей',
        question: 'Какая проблема безопасности есть в этом коде?',
        mode: 'mcq',
        vulnType: 'Hardcoded Secrets',
        lines: [
            '# Конфигурация API',
            'API_KEY = "sk-abc123xyz789"',
            'SECRET_TOKEN = "super_secret_token_12345"',
            'DEBUG_MODE = True'
        ],
        options: [
            'Неправильное форматирование кода',
            'Хардкод секретных ключей в коде',
            'Отсутствуют комментарии',
            'Неправильный порядок импортов'
        ],
        answer: 1,
        hint1: 'Обратите внимание на строки с константами',
        hint2: 'Секретные значения не должны храниться в коде',
        explanation: 'Секретные ключи API и токены не должны храниться в исходном коде. Используйте переменные окружения.'
    },
    {
        title: 'XSS уязвимость',
        question: 'В какой строке возможна XSS-атака?',
        mode: 'line',
        vulnType: 'XSS',
        lines: [
            'def render_comment(comment):',
            '    # Отображение комментария',
            '    return f"<div class=\'comment\'>{comment}</div>"',
            '    # Конец функции'
        ],
        answerLine: 3,
        hint1: 'Где пользовательский контент выводится без экранирования?',
        hint2: 'HTML-контекст требует экранирования специального ввода',
        explanation: 'Строка 3: комментарий выводится без HTML-экранирования, что позволяет внедрить вредоносный скрипт.'
    },
    {
        title: 'Небезопасная десериализация',
        question: 'Какая уязвимость присутствует в коде?',
        mode: 'mcq',
        vulnType: 'Insecure Deserialization',
        lines: [
            'import pickle',
            'def load_user_data(data):',
            '    return pickle.loads(data)'
        ],
        options: [
            'Утечка памяти',
            'Небезопасная десериализация через pickle',
            'Отсутствует обработка исключений',
            'Неправильный импорт модуля'
        ],
        answer: 1,
        hint1: 'Модуль pickle небезопасен для ненадёжных данных',
        hint2: 'pickle.loads может выполнить произвольный код',
        explanation: 'pickle.loads() может выполнить произвольный код при десериализации ненадёжных данных. Используйте JSON или другие безопасные форматы.'
    },
    {
        title: 'Отсутствует HTTPS',
        question: 'В какой строке проблема безопасности?',
        mode: 'line',
        vulnType: 'Insecure Transport',
        lines: [
            'def fetch_data(endpoint):',
            '    # Запрос к API',
            '    url = "http://api.example.com/" + endpoint',
            '    response = requests.get(url)',
            '    return response.json()'
        ],
        answerLine: 3,
        hint1: 'Какой протокол используется для соединения?',
        hint2: 'HTTP не шифрует передаваемые данные',
        explanation: 'Строка 3: используется HTTP вместо HTTPS, данные передаются в открытом виде.'
    },
    {
        title: 'Избыточные права доступа',
        question: 'Какая проблема безопасности в этом коде?',
        mode: 'mcq',
        vulnType: 'Excessive Permissions',
        lines: [
            'def create_app_user():',
            '    user = User()',
            '    user.role = "admin"',
            '    user.permissions = ["read", "write", "delete", "admin"]',
            '    return user'
        ],
        options: [
            'Неправильное создание объекта',
            'Пользователю назначены избыточные права',
            'Отсутствует проверка на дубликаты',
            'Неправильное имя класса'
        ],
        answer: 1,
        hint1: 'Какие права получает обычный пользователь?',
        hint2: 'Принцип минимальных привилегий нарушен',
        explanation: 'Обычному пользователю назначаются права администратора. Следует применять принцип минимальных привилегий.'
    },
    {
        title: 'Уязвимость path traversal',
        question: 'В какой строке уязвимость path traversal?',
        mode: 'line',
        vulnType: 'Path Traversal',
        lines: [
            'def read_file(filename):',
            '    # Чтение файла из директории',
            '    filepath = "/var/data/" + filename',
            '    return open(filepath).read()'
        ],
        answerLine: 4,
        hint1: 'Где формируется путь к файлу?',
        hint2: 'Пользователь может указать "../" для доступа к другим директориям',
        explanation: 'Строка 4: пользователь может указать путь с "../" для чтения файлов за пределами разрешённой директории.'
    },
    {
        title: 'Отсутствует rate limiting',
        question: 'Какая проблема безопасности в этом коде?',
        mode: 'mcq',
        vulnType: 'Missing Rate Limiting',
        lines: [
            'def login(request):',
            '    username = request.POST["username"]',
            '    password = request.POST["password"]',
            '    if check_credentials(username, password):',
            '        return redirect("/dashboard")',
            '    return render("login.html")'
        ],
        options: [
            'Неправильная обработка POST-данных',
            'Отсутствует ограничение количества попыток входа',
            'Неправильный редирект',
            'Отсутствует валидация username'
        ],
        answer: 1,
        hint1: 'Что может произойти при множественных попытках входа?',
        hint2: 'Brute force атака возможна без ограничений',
        explanation: 'Отсутствует rate limiting для попыток входа, что позволяет проводить brute force атаки.'
    }
];

// ===== DIAGNOSTICS SYSTEM =====
class DiagnosticsManager {
    constructor() {
        this.modal = document.getElementById('diagnosticsModal');
        this.backdrop = document.getElementById('diagnosticsBackdrop');
        this.progressDiv = document.getElementById('diagnosticsProgress');
        this.resultsDiv = document.getElementById('diagnosticsResults');
        this.scanBtn = document.getElementById('scanBtn');
        this.closeBtn = document.getElementById('diagnosticsClose');
        this.closeResultsBtn = document.getElementById('diagnosticsCloseBtn');
    }

    init() {
        this.scanBtn?.addEventListener('click', () => this.startDiagnostics());
        this.closeBtn?.addEventListener('click', () => this.closeDiagnostics());
        this.closeResultsBtn?.addEventListener('click', () => this.closeDiagnostics());
        this.backdrop?.addEventListener('click', () => this.closeDiagnostics());
    }

    startDiagnostics() {
        this.modal.classList.add('show');
        this.progressDiv.classList.remove('hidden');
        this.resultsDiv.classList.add('hidden');
        UI.logConsole('🔧 Начало диагностики системы...');

        // Симулируем проверку панелей с задержками
        setTimeout(() => this.runDiagnostics(), 500);
    }

    async runDiagnostics() {
        const checks = [
            { name: 'Проверка консоли', delay: 600 },
            { name: 'Проверка прогресса', delay: 400 },
            { name: 'Проверка подсказок', delay: 500 },
            { name: 'Анализ игровых данных', delay: 700 },
            { name: 'Сканирование системы', delay: 800 }
        ];

        for (const check of checks) {
            await this.sleep(check.delay);
            UI.logConsole(`✓ ${check.name}`);
        }

        await this.sleep(500);
        this.showResults();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showResults() {
        this.progressDiv.classList.add('hidden');
        this.resultsDiv.classList.remove('hidden');

        // Генерируем метрики на основе игровой статистики
        const metrics = this.generateMetrics();
        this.animateMetrics(metrics);
        this.updateSummary();

        UI.logConsole('✓ Диагностика завершена');
        UI.showToast('Диагностика завершена', 'success');
    }

    generateMetrics() {
        // Получаем данные из состояния игры
        const totalAnswered = GameState.currentIndex;
        const accuracy = totalAnswered > 0 ? (GameState.correctCount / totalAnswered * 100) : 0;
        const hintPercentage = Math.min(GameState.hintsUsed * 15, 95);

        // Генерируем фейковую статистику на основе игровых данных
        const elapsedTime = GameState.startTime ? (Date.now() - GameState.startTime) / 1000 : 0;
        const networkLoad = Math.min((elapsedTime / 300) * 100, 95);

        return {
            cpu: Math.max(20, Math.min(accuracy * 0.7 + (100 - accuracy) * 0.5, 85)),
            ram: Math.max(15, Math.min(hintPercentage * 0.8, 80)),
            disk: Math.random() * 40 + 45, // Стабильное значение 45-85%
            network: Math.min(networkLoad + Math.random() * 10, 90),
            security: accuracy * 0.9 + 10, // Зависит от правильности ответов
            stability: Math.max(70, 100 - (hintPercentage * 0.3) - ((100 - accuracy) * 0.2))
        };
    }

    animateMetrics(metrics) {
        const metricsMap = [
            { id: 'CPU', key: 'cpu' },
            { id: 'RAM', key: 'ram' },
            { id: 'Disk', key: 'disk' },
            { id: 'Network', key: 'network' },
            { id: 'Security', key: 'security' },
            { id: 'Stability', key: 'stability' }
        ];

        metricsMap.forEach(metric => {
            const value = Math.round(metrics[metric.key]);
            const element = document.getElementById(`metric${metric.id}`);
            const bar = document.getElementById(`metric${metric.id}Bar`);
            const status = document.getElementById(`metric${metric.id}Status`);

            if (element) {
                // Анимируем значение
                this.animateValue(element, value, 1000);
                this.animateBar(bar, value, 1000);

                // Определяем статус
                let statusText = 'Нормально';
                let statusClass = 'normal';
                if (value > 75) {
                    statusText = 'Высокая нагрузка';
                    statusClass = 'warning';
                } else if (value > 90) {
                    statusText = 'Критическое';
                    statusClass = 'critical';
                }

                if (status) {
                    status.textContent = statusText;
                    status.className = `metric-status ${statusClass}`;
                }
            }
        });

        // Обновляем timestamp
        const timestamp = document.getElementById('resultTimestamp');
        if (timestamp) {
            const now = new Date();
            timestamp.textContent = now.toLocaleTimeString('ru-RU');
        }
    }

    animateValue(element, targetValue, duration) {
        const startValue = 0;
        const startTime = Date.now();

        const update = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.round(startValue + (targetValue - startValue) * progress);
            element.textContent = currentValue + '%';

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    }

    animateBar(element, targetValue, duration) {
        const startTime = Date.now();

        const update = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = targetValue * progress;
            element.style.width = currentValue + '%';

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    }

    updateSummary() {
        const totalAnswered = GameState.currentIndex;
        const correct = GameState.correctCount;
        const accuracy = totalAnswered > 0 ? Math.round((correct / totalAnswered) * 100) : 0;
        const elapsedTime = GameState.startTime ? Math.floor((Date.now() - GameState.startTime) / 1000) : 0;
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;

        document.getElementById('summaryCorrect').textContent = `${correct}/${totalAnswered}`;
        document.getElementById('summaryAccuracy').textContent = `${accuracy}%`;
        document.getElementById('summaryHints').textContent = GameState.hintsUsed;
        document.getElementById('summaryTime').textContent =
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    closeDiagnostics() {
        this.modal.classList.remove('show');
        this.progressDiv.classList.remove('hidden');
        this.resultsDiv.classList.add('hidden');
    }
}

// ===== FILE MANAGER SYSTEM =====
class FileManager {
    constructor() {
        this.files = {
            'auth.py': {
                language: 'Python',
                lines: 30,
                description: 'Хеширует пароли и управляет сессиями',
                content: [
                    'import hashlib',
                    'import secrets',
                    'from datetime import datetime, timedelta',
                    '',
                    'class AuthManager:',
                    '    def __init__(self):',
                    '        self.sessions = {}',
                    '',
                    '    def hash_password(self, password: str) -> str:',
                    '        salt = secrets.token_hex(16)',
                    '        hashed = hashlib.pbkdf2_hmac(',
                    '            "sha256", password.encode(),',
                    '            bytes.fromhex(salt), 100000)',
                    '        return f"{salt}${hashed.hex()}"',
                    '',
                    '    def verify_password(self, password: str, hash_val: str):',
                    '        salt, hashed = hash_val.split("$")',
                    '        new_hash = self.hash_password(password)',
                    '        return new_hash[len(salt)+1:] == hashed'
                ]
            },
            'api.py': {
                language: 'Python',
                lines: 24,
                description: 'Проверяет токены и раздает права',
                content: [
                    'from flask import Flask, request, jsonify',
                    'from functools import wraps',
                    '',
                    'app = Flask(__name__)',
                    '',
                    'def require_auth(f):',
                    '    @wraps(f)',
                    '    def decorated(*args, **kwargs):',
                    '        token = request.headers.get("Authorization")',
                    '        if not token or not verify_token(token):',
                    '            return {"error": "Unauthorized"}, 401',
                    '        return f(*args, **kwargs)',
                    '    return decorated',
                    '',
                    '@app.route("/api/login", methods=["POST"])',
                    'def login():',
                    '    data = request.get_json()',
                    '    user = find_user(data.get("username"))',
                    '    if not user: return {"error": "Invalid"}, 401',
                    '    token = create_session(user["id"])',
                    '    return {"token": token}, 200'
                ]
            },
            'config.py': {
                language: 'Python',
                lines: 18,
                description: 'Хранит настройки приложения',
                content: [
                    'import os',
                    'from dotenv import load_dotenv',
                    '',
                    'load_dotenv()',
                    '',
                    'class Config:',
                    '    SECRET_KEY = os.getenv("SECRET_KEY")',
                    '    DATABASE_URL = os.getenv("DATABASE_URL")',
                    '    JWT_ALGORITHM = "HS256"',
                    '',
                    'class DevConfig(Config):',
                    '    DEBUG = True',
                    '',
                    'class ProdConfig(Config):',
                    '    DEBUG = False'
                ]
            },
            'database.py': {
                language: 'Python',
                lines: 20,
                description: 'Работает с базой данных',
                content: [
                    'import sqlite3',
                    'from contextlib import contextmanager',
                    '',
                    'class Database:',
                    '    def __init__(self, db_path):',
                    '        self.db_path = db_path',
                    '',
                    '    @contextmanager',
                    '    def get_connection(self):',
                    '        conn = sqlite3.connect(self.db_path)',
                    '        try:',
                    '            yield conn',
                    '        finally:',
                    '            conn.close()',
                    '',
                    '    def execute(self, query, params=()):',
                    '        with self.get_connection() as conn:',
                    '            cursor = conn.cursor()',
                    '            cursor.execute(query, params)'
                ]
            },
            'middleware.py': {
                language: 'Python',
                lines: 22,
                description: 'Проверяет данные и пишет логи',
                content: [
                    'import time',
                    'from functools import wraps',
                    '',
                    'def validate_input(required_fields):',
                    '    def decorator(f):',
                    '        @wraps(f)',
                    '        def wrapper(*args, **kwargs):',
                    '            data = request.get_json()',
                    '            for field in required_fields:',
                    '                if field not in data:',
                    '                    return {"error": f"Missing {field}"}, 400',
                    '            return f(*args, **kwargs)',
                    '        return wrapper',
                    '    return decorator',
                    '',
                    'def log_request(f):',
                    '    @wraps(f)',
                    '    def wrapper(*args, **kwargs):',
                    '        start = time.time()',
                    '        result = f(*args, **kwargs)',
                    '        return result'
                ]
            },
            'security.py': {
                language: 'Python',
                lines: 26,
                description: 'Защищает от XSS и CSRF',
                content: [
                    'import html',
                    'import re',
                    '',
                    'class SecurityUtils:',
                    '    @staticmethod',
                    '    def sanitize_html(text):',
                    '        return html.escape(text)',
                    '',
                    '    @staticmethod',
                    '    def validate_email(email):',
                    '        pattern = r"^[\\w\\.-]+@[\\w\\.-]+\\.\\w+$"',
                    '        return re.match(pattern, email)',
                    '',
                    '    @staticmethod',
                    '    def validate_password(password):',
                    '        if len(password) < 12: return False',
                    '        if not re.search(r"\\d", password): return False',
                    '        if not re.search(r"[!@#$%^&*]", password):',
                    '            return False',
                    '        return True'
                ]
            },
            'utils.py': {
                language: 'Python',
                lines: 20,
                description: 'Вспомогательные функции',
                content: [
                    'from datetime import datetime, timedelta',
                    'import json',
                    '',
                    'def get_timestamp():',
                    '    return datetime.utcnow().isoformat()',
                    '',
                    'def format_date(date_obj):',
                    '    return date_obj.strftime("%d.%m.%Y")',
                    '',
                    'def get_expiry_time(hours=24):',
                    '    return datetime.utcnow() + timedelta(hours=hours)',
                    '',
                    'def safe_json_loads(json_str):',
                    '    try:',
                    '        return json.loads(json_str)',
                    '    except json.JSONDecodeError:',
                    '        return None'
                ]
            }
        };

        this.modal = document.getElementById('fileModal');
        this.backdrop = document.getElementById('fileBackdrop');
        this.closeBtn = document.getElementById('fileModalClose');
        this.closeResultsBtn = document.getElementById('fileModalCloseBtn');
    }

    init() {
        this.closeBtn?.addEventListener('click', () => this.closeFile());
        this.closeResultsBtn?.addEventListener('click', () => this.closeFile());
        this.backdrop?.addEventListener('click', () => this.closeFile());

        // Make file tabs clickable
        this.setupFileTabs();
    }

    setupFileTabs() {
        const fileTabs = document.getElementById('fileTabs');
        if (!fileTabs) return;

        // Make existing tabs clickable
        setTimeout(() => {
            const tabs = fileTabs.querySelectorAll('button');
            tabs.forEach(tab => {
                tab.style.cursor = 'pointer';
                tab.addEventListener('click', (e) => {
                    const filename = tab.textContent.trim();
                    this.openFile(filename);
                });
            });
        }, 100);
    }

    openFile(filename) {
        const file = this.files[filename];
        if (!file) return;

        this.modal.classList.add('show');
        this.modal.setAttribute('aria-hidden', 'false');

        document.getElementById('fileModalTitle').textContent = filename;
        document.getElementById('fileModalFilename').textContent = filename;
        document.getElementById('fileModalInfo').textContent =
            `${file.language} • ${file.lines} строк`;

        // Display file description
        const descriptionDiv = document.getElementById('fileDescription');
        if (descriptionDiv) {
            descriptionDiv.textContent = file.description || 'Описание недоступно';
        }

        this.displayCode(file.content);
    }

    displayCode(codeLines) {
        const codeBlock = document.getElementById('fileModalCode');
        codeBlock.innerHTML = codeLines.map((line, index) => {
            const lineNum = index + 1;
            const highlighted = TaskRenderer.syntaxHighlight(line);
            const displayLine = line || '&nbsp;';
            return `<div class="code-line" data-line="${lineNum}">
                <span class="ln">${lineNum}</span>
                <span class="txt">${highlighted}</span>
            </div>`;
        }).join('');
    }

    closeFile() {
        this.modal.classList.remove('show');
        this.modal.setAttribute('aria-hidden', 'true');
    }
}

// ===== START =====
document.addEventListener('DOMContentLoaded', initGame);