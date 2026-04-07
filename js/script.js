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
    currentTaskData: null,

    reset() {
        const alwaysTasks = allTasks.filter(t => t.always);
        const auctionTasks = shuffleArray([...allTasks.filter(t => t.mode === 'auction')]).slice(0, 2);
        const flowchartTasks = shuffleArray([...allTasks.filter(t => t.mode === 'flowchart')]).slice(0, 1);
        const otherTasks = allTasks.filter(t => !t.always && t.mode !== 'auction' && t.mode !== 'flowchart');
        const remainingSlots = Math.max(0, 10 - alwaysTasks.length - auctionTasks.length - flowchartTasks.length);
        const randomOther = shuffleArray([...otherTasks]).slice(0, remainingSlots);
        this.deck = shuffleArray([...alwaysTasks, ...auctionTasks, ...flowchartTasks, ...randomOther]);
        this.currentIndex = 0;
        this.score = 0;
        this.correctCount = 0;
        this.hintsUsed = 0;
        this.perfectStreak = 0;
        this.answered = false;
        this.selectedLine = null;
        this.selectedAnswer = null;
        this.currentHints = 0;
        this.currentTaskData = {};
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
            specialTaskContainer: document.getElementById('specialTaskContainer'),
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
        GameState.currentTaskData = {};

        // Reset code block display
        const codeBlock = UI.get('codeBlock');
        codeBlock.style.display = 'block';

        // Show game view, hide result
        gameView.classList.remove('hidden');
        resultView.classList.add('hidden');

        // Update header
        UI.get('taskBadge').textContent = `Задание ${GameState.currentIndex + 1}/${GameState.deck.length}`;
        UI.get('taskTitle').textContent = task.title;
        UI.get('taskQuestion').textContent = task.question;

        const modeLabels = {
            'line': 'Клик по строке',
            'mcq': 'Тест',
            'flowchart': 'Блок-схема',
            'auction': 'Аукцион мер',
            'matching': 'Соответствие'
        };
        UI.get('taskType').textContent = modeLabels[task.mode] || 'Тест';
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

        // Reset options container
        const options = UI.get('options');
        const codeShell = document.querySelector('.code-shell');
        const specialContainer = UI.get('specialTaskContainer');

        // Clear and hide special container by default
        specialContainer.innerHTML = '';
        specialContainer.classList.remove('active');

        if (task.mode === 'flowchart') {
            codeShell.classList.add('hidden');
            this.renderFlowchart(task, specialContainer);
            options.style.display = 'none';
        } else if (task.mode === 'auction') {
            codeShell.classList.add('hidden');
            this.renderAuction(task, specialContainer);
            options.style.display = 'none';
        } else if (task.mode === 'matching') {
            codeShell.classList.add('hidden');
            this.renderMatching(task, specialContainer);
            options.style.display = 'none';
        } else {
            codeShell.classList.remove('hidden');
            this.renderCode(task);

            if (task.mode === 'mcq') {
                this.renderOptions(task);
                options.style.display = 'grid';
            } else {
                options.style.display = 'none';
                options.innerHTML = '';
            }
        }

        // Add enter animation
        UI.get('taskCard').classList.remove('enter');
        void UI.get('taskCard').offsetWidth;
        UI.get('taskCard').classList.add('enter');

        UI.logConsole(`Загружено: ${task.title}`);
        UI.updateStats();
    },

    renderFlowchart(task, container) {
        container.classList.add('active');
        GameState.currentTaskData = { placed: {} };

        container.innerHTML = `
            <div class="flowchart-container">
                <div class="flowchart-title">${escapeHtml(task.proverb)}</div>
                <div class="flowchart-instruction">🧩 Перетащите блоки из левой колонки в правую. Можно перемещать блоки между зонами и возвращать обратно!</div>
                <div class="flowchart-wrapper">
                    <div class="flowchart-blocks-pool" id="blocksPool"></div>
                    <div class="flowchart-drop-zones" id="dropZones"></div>
                </div>
                <div class="flowchart-actions">
                    <button class="soft-btn primary" id="flowchartCheckBtn" disabled>✓ Проверить схему</button>
                    <button class="soft-btn" id="flowchartResetBtn">↺ Сбросить всё</button>
                </div>
            </div>
        `;

        const pool = container.querySelector('#blocksPool');
        const zones = container.querySelector('#dropZones');
        const checkBtn = container.querySelector('#flowchartCheckBtn');
        const resetBtn = container.querySelector('#flowchartResetBtn');

        // Create blocks in pool
        task.blocks.forEach((block, idx) => {
            const blockEl = document.createElement('div');
            blockEl.className = `flowchart-block ${block.type}`;
            blockEl.textContent = block.text;
            blockEl.draggable = true;
            blockEl.dataset.index = idx;
            blockEl.dataset.correct = block.correctZone;
            pool.appendChild(blockEl);

            this.setupBlockDrag(blockEl, pool, zones, task, container);
        });

        // Create drop zones
        task.zones.forEach((zone, idx) => {
            const zoneEl = document.createElement('div');
            zoneEl.className = 'flowchart-drop-zone';
            zoneEl.dataset.index = idx;
            zoneEl.innerHTML = `
                <span class="flowchart-zone-label">${escapeHtml(zone.label)}</span>
                <div class="flowchart-zone-slot"></div>
            `;
            zones.appendChild(zoneEl);

            this.setupDropZone(zoneEl, pool, zones, task, container);
        });

        // Pool can receive blocks back
        this.setupPoolDrop(pool, zones, container);

        // Check button
        checkBtn.addEventListener('click', () => {
            if (GameState.answered) return;
            this.checkFlowchartAnswer(task, container);
        });

        // Reset button
        resetBtn.addEventListener('click', () => {
            if (GameState.answered) return;
            this.resetFlowchart(pool, zones, container);
        });
    },

    setupBlockDrag(blockEl, pool, zones, task, container) {
        blockEl.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', blockEl.dataset.index);
            e.dataTransfer.effectAllowed = 'move';
            setTimeout(() => blockEl.classList.add('dragging'), 0);
        });

        blockEl.addEventListener('dragend', () => {
            blockEl.classList.remove('dragging');
        });
    },

    setupDropZone(zoneEl, pool, zones, task, container) {
        zoneEl.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            if (!zoneEl.querySelector('.flowchart-block')) {
                zoneEl.classList.add('drag-over');
            }
        });

        zoneEl.addEventListener('dragleave', () => {
            zoneEl.classList.remove('drag-over');
        });

        zoneEl.addEventListener('drop', (e) => {
            e.preventDefault();
            zoneEl.classList.remove('drag-over');

            const blockIdx = e.dataTransfer.getData('text/plain');
            const block = document.querySelector(`.flowchart-block[data-index="${blockIdx}"]`);

            if (!block) return;

            // If zone already has a block, move it back to pool first
            const existingBlock = zoneEl.querySelector('.flowchart-block');
            if (existingBlock) {
                pool.appendChild(existingBlock);
                // Remove from placed data
                Object.keys(GameState.currentTaskData.placed).forEach(key => {
                    if (GameState.currentTaskData.placed[key] === existingBlock.dataset.index) {
                        delete GameState.currentTaskData.placed[key];
                    }
                });
            }

            // Place new block
            zoneEl.querySelector('.flowchart-zone-slot').appendChild(block);
            zoneEl.classList.add('filled');
            GameState.currentTaskData.placed[zoneEl.dataset.index] = blockIdx;

            // Clear result styles
            zoneEl.classList.remove('correct', 'incorrect');

            this.updateFlowchartCheckBtn(container);
        });
    },

    setupPoolDrop(pool, zones, container) {
        pool.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        pool.addEventListener('drop', (e) => {
            e.preventDefault();
            const blockIdx = e.dataTransfer.getData('text/plain');
            const block = document.querySelector(`.flowchart-block[data-index="${blockIdx}"]`);

            if (block) {
                pool.appendChild(block);

                // Remove from placed data and clear zone
                Object.keys(GameState.currentTaskData.placed).forEach(zoneIdx => {
                    if (GameState.currentTaskData.placed[zoneIdx] === blockIdx) {
                        delete GameState.currentTaskData.placed[zoneIdx];
                        const zone = zones.querySelector(`[data-index="${zoneIdx}"]`);
                        if (zone) {
                            zone.classList.remove('filled', 'correct', 'incorrect');
                        }
                    }
                });

                // Clear result styles from all zones
                zones.querySelectorAll('.flowchart-drop-zone').forEach(zone => {
                    if (!zone.querySelector('.flowchart-block')) {
                        zone.classList.remove('filled');
                    }
                });

                this.updateFlowchartCheckBtn(container);
            }
        });
    },

    updateFlowchartCheckBtn(container) {
        const checkBtn = container.querySelector('#flowchartCheckBtn');
        const zones = container.querySelectorAll('.flowchart-drop-zone');
        let filledCount = 0;

        zones.forEach(zone => {
            if (zone.querySelector('.flowchart-block')) filledCount++;
        });

        if (checkBtn) {
            checkBtn.disabled = filledCount === 0;
        }
    },

    resetFlowchart(pool, zones, container) {
        if (GameState.answered) return;

        // Move all blocks back to pool
        zones.querySelectorAll('.flowchart-drop-zone').forEach(zone => {
            const block = zone.querySelector('.flowchart-block');
            if (block) {
                pool.appendChild(block);
            }
            zone.classList.remove('filled', 'correct', 'incorrect');
        });

        GameState.currentTaskData.placed = {};
        this.updateFlowchartCheckBtn(container);
    },

    checkFlowchartAnswer(task, container) {
        const zones = container.querySelectorAll('.flowchart-drop-zone');
        let correctCount = 0;
        let totalPlaced = 0;

        zones.forEach((zone, idx) => {
            const block = zone.querySelector('.flowchart-block');
            if (block) {
                totalPlaced++;
                const blockCorrectZone = block.dataset.correct;
                if (blockCorrectZone === String(idx)) {
                    zone.classList.add('correct');
                    zone.classList.remove('incorrect');
                    correctCount++;
                } else {
                    zone.classList.add('incorrect');
                    zone.classList.remove('correct');
                }
            }
        });

        const isCorrect = correctCount === task.zones.length && totalPlaced === task.zones.length;
        const partialCorrect = correctCount > 0 && totalPlaced > 0;

        // Show detailed feedback
        let feedbackMsg = '';
        if (isCorrect) {
            feedbackMsg = `✅ Отлично! Все ${correctCount} блоков на правильных местах!`;
        } else if (partialCorrect) {
            feedbackMsg = `🤔 Правильно размещено ${correctCount} из ${totalPlaced} блоков. Попробуйте исправить ошибки!`;
        } else {
            feedbackMsg = `❌ Пока нет правильных размещений. Попробуйте ещё раз или сбросьте всё!`;
        }

        UI.logConsole(feedbackMsg);

        // Show feedback in result area
        let resultDiv = container.querySelector('.flowchart-result');
        if (!resultDiv) {
            resultDiv = document.createElement('div');
            resultDiv.className = 'flowchart-result';
            container.querySelector('.flowchart-container').appendChild(resultDiv);
        }
        resultDiv.classList.remove('hidden');
        resultDiv.innerHTML = `
            <div class="flowchart-result-content ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="result-header">
                    <span class="result-emoji">${isCorrect ? '🎉' : (partialCorrect ? '💪' : '🤔')}</span>
                    <span class="result-text">${feedbackMsg}</span>
                </div>
                ${!isCorrect ? `
                <div class="result-details">
                    <span class="detail-correct">✓ Верно: ${correctCount}</span>
                    <span class="detail-wrong">✗ Неверно: ${totalPlaced - correctCount}</span>
                    <span class="detail-empty">○ Не заполнено: ${task.zones.length - totalPlaced}</span>
                </div>
                ` : ''}
            </div>
        `;

        // Mark as answered only if all correct or user placed everything
        if (isCorrect || totalPlaced === task.zones.length) {
            GameState.answered = true;

            if (isCorrect) {
                GameState.correctCount++;
                const points = GameState.calculatePoints(GameState.currentHints || 0);
                GameState.score += points;
                if ((GameState.currentHints || 0) === 0) GameState.perfectStreak++;
                UI.logConsole(`✅ Блок-схема верна! +${points} очков`);
            } else {
                UI.logConsole(`❌ Блок-схема: ${correctCount}/${task.zones.length} верных`);
            }

            container.querySelector('#flowchartCheckBtn').disabled = true;
            container.querySelector('#flowchartResetBtn').disabled = true;
            UI.get('nextBtn').disabled = false;
            UI.get('hintBtn1').disabled = true;
            UI.get('hintBtn2').disabled = true;
        }

        UI.updateStats();
    },

    renderAuction(task, container) {
        container.classList.add('active');
        GameState.currentTaskData = { selected: [], spent: 0 };

        const budget = task.budget;

        container.innerHTML = `
            <div class="auction-container">
                <div class="auction-header">
                    <div class="auction-scenario">${escapeHtml(task.scenario || '')}</div>
                    <div class="auction-budget">
                        <span class="budget-label">Бюджет:</span>
                        <span class="budget-available" id="budgetAvailable">${budget.toLocaleString('ru-RU')}</span>
                        <span class="budget-currency">₽</span>
                    </div>
                </div>
                <div class="auction-spent">
                    <span>Потрачено:</span>
                    <strong id="spentValue">0 ₽</strong>
                    <span class="budget-remain" id="remainValue">Осталось: ${budget.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div class="auction-cards-grid" id="auctionCards"></div>
                <div class="auction-actions">
                    <button class="soft-btn primary" id="auctionCheckBtn" disabled>✓ Проверить выбор</button>
                    <button class="soft-btn" id="auctionClearBtn">✕ Сбросить</button>
                </div>
                <div class="auction-selection-info" id="selectionInfo">
                    Выберите меры защиты, которые укладываются в бюджет
                </div>
                <div class="auction-result hidden" id="auctionResult"></div>
            </div>
        `;

        const cardsContainer = container.querySelector('#auctionCards');
        const checkBtn = container.querySelector('#auctionCheckBtn');
        const clearBtn = container.querySelector('#auctionClearBtn');

        // Shuffle measures for variety
        const shuffledMeasures = shuffleArray([...task.measures]);

        // Store mapping from display index to original measure
        const measureMap = [];

        shuffledMeasures.forEach((measure, idx) => {
            measureMap.push(measure);
            const card = document.createElement('div');
            card.className = 'auction-card';
            card.dataset.correct = measure.correct ? 'true' : 'false';
            card.dataset.index = idx;
            card.dataset.cost = measure.cost;
            card.innerHTML = `
                <div class="auction-card-icon">${measure.icon || '🛡️'}</div>
                <div class="auction-card-content">
                    <div class="auction-card-name">${escapeHtml(measure.name)}</div>
                    <div class="auction-card-desc">${escapeHtml(measure.description || '')}</div>
                </div>
                <div class="auction-card-cost">${measure.cost.toLocaleString('ru-RU')} ₽</div>
                <div class="auction-card-check">
                    <span class="check-icon">✓</span>
                </div>
            `;
            cardsContainer.appendChild(card);

            card.addEventListener('click', () => {
                if (GameState.answered) return;

                const isSelected = card.classList.contains('selected');
                const cost = measure.cost;

                if (isSelected) {
                    card.classList.remove('selected');
                    GameState.currentTaskData.spent -= cost;
                    GameState.currentTaskData.selected = GameState.currentTaskData.selected.filter(i => i !== idx);
                } else {
                    if (GameState.currentTaskData.spent + cost <= budget) {
                        card.classList.add('selected');
                        GameState.currentTaskData.spent += cost;
                        GameState.currentTaskData.selected.push(idx);
                    }
                }

                this.updateAuctionUI(measureMap, budget, container);
            });
        });

        checkBtn.addEventListener('click', () => {
            if (GameState.answered || GameState.currentTaskData.selected.length === 0) return;
            this.checkAuctionAnswer(measureMap, budget, container);
        });

        clearBtn.addEventListener('click', () => {
            if (GameState.answered) return;
            GameState.currentTaskData.selected = [];
            GameState.currentTaskData.spent = 0;
            container.querySelectorAll('.auction-card').forEach(c => c.classList.remove('selected'));
            this.updateAuctionUI(measureMap, budget, container);
            const result = container.querySelector('#auctionResult');
            result.classList.add('hidden');
            result.innerHTML = '';
        });

        // Initial UI update
        this.updateAuctionUI(measureMap, budget, container);
    },

    updateAuctionUI(measureMap, budget, container) {
        const { selected, spent } = GameState.currentTaskData;
        const remain = budget - spent;

        const budgetEl = container.querySelector('#budgetAvailable');
        const spentEl = container.querySelector('#spentValue');
        const remainEl = container.querySelector('#remainValue');
        const selectionInfo = container.querySelector('#selectionInfo');
        const checkBtn = container.querySelector('#auctionCheckBtn');

        if (budgetEl) budgetEl.textContent = remain.toLocaleString('ru-RU');
        if (spentEl) spentEl.textContent = `${spent.toLocaleString('ru-RU')} ₽`;
        if (remainEl) remainEl.textContent = `Осталось: ${remain.toLocaleString('ru-RU')} ₽`;

        if (remain < budget * 0.2) {
            budgetEl?.closest('.auction-budget')?.classList.add('warning');
        } else {
            budgetEl?.closest('.auction-budget')?.classList.remove('warning');
        }

        if (selectionInfo) {
            if (selected.length === 0) {
                selectionInfo.textContent = 'Выберите хотя бы одну меру защиты';
            } else {
                const correctSelected = selected.filter(idx => measureMap[idx]?.correct).length;
                selectionInfo.textContent = `Выбрано мер: ${selected.length} | Из них полезных: ${correctSelected}`;
            }
        }

        if (checkBtn) {
            checkBtn.disabled = selected.length === 0;
        }
    },

    checkAuctionAnswer(measureMap, budget, container) {
        const { selected, spent } = GameState.currentTaskData;

        // Calculate results
        let correctSelected = 0;
        let wrongSelected = 0;
        let correctMissed = 0;

        const cards = container.querySelectorAll('.auction-card');
        cards.forEach((card, idx) => {
            const isSelected = card.classList.contains('selected');
            const isCorrect = card.dataset.correct === 'true';

            if (isSelected && isCorrect) {
                card.classList.add('result-correct');
                correctSelected++;
            } else if (isSelected && !isCorrect) {
                card.classList.add('result-wrong');
                wrongSelected++;
            } else if (!isSelected && isCorrect) {
                card.classList.add('result-missed');
                correctMissed++;
            }
        });

        // Score calculation
        const totalCorrect = measureMap.filter(m => m.correct).length;
        const finalScore = Math.max(0, (correctSelected * 10) - (wrongSelected * 5));

        // Determine result level
        let resultLevel, resultIcon, resultText;
        if (correctSelected >= totalCorrect && wrongSelected === 0) {
            resultLevel = 'excellent';
            resultIcon = '🏆';
            resultText = 'Идеально! Вы выбрали все нужные меры и не потратили лишнего!';
        } else if (correctSelected >= totalCorrect * 0.7 && wrongSelected <= 1) {
            resultLevel = 'good';
            resultIcon = '👍';
            resultText = 'Хороший результат! Почти всё верно.';
        } else if (correctSelected >= totalCorrect * 0.5) {
            resultLevel = 'ok';
            resultIcon = '🤔';
            resultText = 'Неплохо, но можно лучше. Посмотрите, что вы упустили.';
        } else {
            resultLevel = 'poor';
            resultIcon = '😟';
            resultText = 'Нужно лучше изучить меры защиты. Попробуйте ещё раз!';
        }

        const result = container.querySelector('#auctionResult');
        result.classList.remove('hidden');
        result.innerHTML = `
            <div class="auction-result-content ${resultLevel}">
                <div class="result-icon">${resultIcon}</div>
                <div class="result-title">${resultText}</div>
                <div class="result-stats">
                    <div class="stat">
                        <span class="stat-label">Верных мер</span>
                        <span class="stat-value good">${correctSelected}/${totalCorrect}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Лишних мер</span>
                        <span class="stat-value bad">${wrongSelected}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Упущено</span>
                        <span class="stat-value warn">${correctMissed}</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Потрачено</span>
                        <span class="stat-value">${spent.toLocaleString('ru-RU')}/${budget.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">Очки</span>
                        <span class="stat-value primary">+${finalScore}</span>
                    </div>
                </div>
                <div class="result-hints">
                    <strong>Правильные меры защиты:</strong>
                    <ul>
                        ${measureMap.filter(m => m.correct).map(m => `<li>${m.icon || '🛡️'} ${m.name} (${m.cost.toLocaleString('ru-RU')} ₽)</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;

        // Update game state
        const isCorrect = correctSelected >= totalCorrect * 0.7 && wrongSelected === 0;
        GameState.answered = true;

        if (isCorrect) {
            GameState.correctCount++;
            const points = GameState.calculatePoints(GameState.currentHints || 0);
            GameState.score += points;
            if ((GameState.currentHints || 0) === 0) GameState.perfectStreak++;
            UI.logConsole(`✅ Аукцион пройден! +${points} очков`);
        } else {
            UI.logConsole(`❌ Аукцион: ${correctSelected}/${totalCorrect} верных мер`);
        }

        container.querySelector('#auctionCheckBtn').disabled = true;
        container.querySelector('#auctionClearBtn').disabled = true;
        UI.get('nextBtn').disabled = false;
        UI.get('hintBtn1').disabled = true;
        UI.get('hintBtn2').disabled = true;
        UI.updateStats();
    },

    renderMatching(task, container) {
        container.classList.add('active');

        let scenariosHtml = '<div class="matching-scenarios">';
        task.scenarios.forEach((scenario, idx) => {
            scenariosHtml += `
                <div class="matching-scenario" data-scenario="${idx}">
                    <span class="matching-scenario-letter">${String.fromCharCode(65 + idx)}</span>
                    <span class="matching-scenario-text">${escapeHtml(scenario.text)}</span>
                </div>
            `;
        });
        scenariosHtml += '</div>';

        let answersHtml = '<div class="matching-answers">';
        task.answers.forEach((answer, idx) => {
            answersHtml += `
                <button class="matching-answer-btn" data-answer="${idx}">
                    <span class="matching-answer-number">${idx + 1}</span>
                    <span>${escapeHtml(answer.text)}</span>
                </button>
            `;
        });
        answersHtml += '</div>';

        container.innerHTML = `
            <div class="matching-container">
                <p class="task-question">Установите соответствие между ситуациями и угрозами:</p>
                ${scenariosHtml}
                ${answersHtml}
            </div>
        `;

        container.querySelectorAll('.matching-scenario').forEach(scenarioEl => {
            scenarioEl.addEventListener('click', () => {
                if (GameState.answered) return;

                container.querySelectorAll('.matching-scenario').forEach(s => s.classList.remove('selected'));
                scenarioEl.classList.add('selected');

                const scenarioIdx = parseInt(scenarioEl.dataset.scenario);
                GameState.currentTaskData.selectedScenario = scenarioIdx;
            });
        });

        container.querySelectorAll('.matching-answer-btn').forEach(answerEl => {
            answerEl.addEventListener('click', () => {
                if (GameState.answered) return;

                const scenarioIdx = GameState.currentTaskData.selectedScenario;
                if (scenarioIdx === undefined) return;

                const answerIdx = parseInt(answerEl.dataset.answer);

                const scenarioEl = container.querySelector(`[data-scenario="${scenarioIdx}"]`);

                const correctAnswer = task.scenarios[scenarioIdx].correctAnswer;
                const isCorrect = answerIdx === correctAnswer;

                scenarioEl.classList.add(isCorrect ? 'correct' : 'incorrect');
                answerEl.classList.add(isCorrect ? 'correct' : 'incorrect');

                GameState.currentTaskData[`scenario_${scenarioIdx}`] = answerIdx;

                const allAnswered = task.scenarios.every((_, idx) =>
                    GameState.currentTaskData[`scenario_${idx}`] !== undefined
                );

                if (allAnswered) {
                    this.checkMatchingAnswer(task);
                }
            });
        });
    },

    updateMatchingState(task) {
        // Reset answers when new scenario selected
    },

    checkMatchingAnswer(task) {
        let correctCount = 0;

        task.scenarios.forEach((scenario, idx) => {
            const scenarioEl = document.querySelector(`[data-scenario="${idx}"]`);
            const userAnswer = GameState.currentTaskData[`scenario_${idx}`];

            if (userAnswer === scenario.correctAnswer) {
                correctCount++;
            }
        });

        const isCorrect = correctCount === task.scenarios.length;
        this.showFeedback(task, isCorrect);
        GameState.answered = true;

        if (isCorrect) {
            GameState.correctCount++;
            const points = GameState.calculatePoints(GameState.currentHints || 0);
            GameState.score += points;
            if ((GameState.currentHints || 0) === 0) GameState.perfectStreak++;
            UI.logConsole(`✅ Верно! +${points} очков`);
        } else {
            const correctAnswers = task.scenarios.map((s, i) =>
                `${String.fromCharCode(65 + i)} → ${s.correctAnswer + 1}`
            ).join(', ');
            UI.logConsole(`❌ Неверно. Правильные: ${correctAnswers}`);
        }

        UI.get('nextBtn').disabled = false;
        UI.get('hintBtn1').disabled = true;
        UI.get('hintBtn2').disabled = true;
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
        title: 'Слабый пароль',
        question: 'Что не так с паролем в этом коде?',
        mode: 'mcq',
        vulnType: 'Слабый пароль',
        lines: [
            'password = "123456"',
            'username = "admin"'
        ],
        options: [
            'Пароль слишком длинный',
            'Пароль очень простой и его легко угадать',
            'Пароль написан на английском',
            'Всё в порядке, пароль хороший'
        ],
        answer: 1,
        hint1: 'Посмотрите на цифры в пароле - это самая простая комбина',
        hint2: 'Такой пароль стоит на первом месте в списке самых популярных',
        explanation: 'Пароль "123456" - самый слабый. Его можно угадать за 1 секунду. Используйте сложные пароли с буквами, цифрами и символами!'
    },
    {
        title: 'Подозрительная ссылка',
        question: 'В какой строке опасность?',
        mode: 'line',
        vulnType: 'Фишинговая ссылка',
        lines: [
            'Пришло письмо от "банка"',
            'В письме ссылка: http://sberbank-security.tk/login',
            'Нужно ввести данные карты',
            'Это официальный сайт банка'
        ],
        answerLine: 2,
        hint1: 'Внимательно посмотрите на адрес сайта в ссылке',
        hint2: 'Настоящий Сбербанк использует домен sberbank.ru, а не .tk',
        explanation: 'Домен .tk - бесплатный и часто используется мошенниками. Настоящий сайт банка имеет официальный домен .ru или .com.'
    },
    {
        title: 'Публичный Wi-Fi',
        question: 'В чём опасность этой ситуации?',
        mode: 'mcq',
        vulnType: 'Публичный Wi-Fi',
        lines: [
            'Подключился к бесплатному Wi-Fi в кафе',
            'Зашёл в онлайн-банк',
            'Ввёл логин и пароль'
        ],
        options: [
            'Ничего опасного, все так делают',
            'В публичной сети хакеры могут перехватить данные',
            'Wi-Fi в кафе слишком медленный',
            'Нельзя заходить в банк с телефона'
        ],
        answer: 1,
        hint1: 'Публичные сети не шифруют данные',
        hint2: 'Любой человек в этой же сети может видеть ваш трафик',
        explanation: 'В публичных Wi-Fi сетях злоумышленники могут перехватывать данные. Не вводите пароли и данные карт без VPN!'
    },
    {
        title: 'Сообщение о выигрыше',
        question: 'Гдесь здесь обман?',
        mode: 'line',
        vulnType: 'Мошенничество',
        lines: [
            'SMS: "Поздравляем! Вы выиграли iPhone 15!"',
            'Для получения приза перейдите по ссылке',
            'И отправьте код из SMS в ответ',
            'Срок получения - 24 часа'
        ],
        answerLine: 1,
        hint1: 'Вы участвовали в розыгрыше iPhone?',
        hint2: 'Настоящие призы не требуют перехода по подозрительным ссылкам',
        explanation: 'Это классическое мошенничество! Если вы не участвовали в розыгрыше - это обман. Не переходите по ссылкам и не отправляйте коды!'
    },
    {
        title: 'Пароль от друга',
        question: 'Правильно ли поступил Петя?',
        mode: 'mcq',
        vulnType: 'Безопасность аккаунта',
        lines: [
            'Друг попросил пароль от соцсети',
            'Сказал: "Мне нужно проверить что-то"',
            'Петя дал свой пароль'
        ],
        options: [
            'Да, друзьям можно доверять пароли',
            'Нет, пароль нельзя давать никому',
            'Да, если друг обещает не говорить другим',
            'Нет, но только если друг не злоумышленник'
        ],
        answer: 1,
        hint1: 'Пароль - это личная информация',
        hint2: 'Даже друзья могут случайно раскрыть пароль',
        explanation: 'Пароли нельзя давать НИКОМУ! Даже друзьям. Если друг хочет что-то проверить - пусть сделает это при вас.'
    },
    {
        title: 'Странное приложение',
        question: 'Что делать в этой ситуации?',
        mode: 'mcq',
        vulnType: 'Безопасность приложений',
        lines: [
            'Нашёл в интернете "бесплатный Premium Spotify"',
            'Нужно скачать APK файл',
            'И установить его на телефон',
            'Обычный Spotify стоит 199 руб/мес'
        ],
        options: [
            'Скачать, ведь это бесплатно',
            'Не скачивать - это может быть вирус',
            'Скачать, но установить антивирус',
            'Отправить другу, пусть проверит'
        ],
        answer: 1,
        hint1: 'Бесплатный сыр только в мышеловке',
        hint2: 'APK файлы из интернета могут содержать вирусы',
        explanation: 'Не скачивайте модифицированные приложения! Они могут содержать вирусы, ворующие данные. Используйте только официальные приложения.'
    },
    {
        title: 'Данные карты в соцсети',
        question: 'В какой строке опасность?',
        mode: 'line',
        vulnType: 'Утечка данных',
        lines: [
            'Опубликовал фото новой банковской карты',
            'Чтобы все видели, какая красивая',
            'Номер карты виден на фото',
            'Закрыл только срок действия'
        ],
        answerLine: 1,
        hint1: 'Какую информацию содержит банковская карта?',
        hint2: 'Номер карты на фото могут использовать мошенники',
        explanation: 'Никогда не публикуйте данные карты! По номеру карты можно совершать покупки в интернете. Закрывайте все данные карты.'
    },
    {
        title: 'Звонок из "банка"',
        question: 'Как правильно поступить?',
        mode: 'mcq',
        vulnType: 'Социальная инженерия',
        lines: [
            'Звонят: "Сотрудник банка"',
            '"Ваша карта заблокирована, назовите CVV"',
            'CVV - это 3 цифры на обороте карты'
        ],
        options: [
            'Назвать CVV, ведь звонят из банка',
            'Положить трубку и позвонить в банк самому',
            'Назвать только первые 2 цифры',
            'Попросить прислать SMS для подтверждения'
        ],
        answer: 1,
        hint1: 'Настоящий сотрудник банка НИКОГДА не спрашивает CVV',
        hint2: 'Лучше самому перезвонить в банк по официальному номеру',
        explanation: 'Банк НИКОГДА не спрашивает CVV код! Это мошенники. Положите трубку и позвоните в банк сами по номеру на карте.'
    },
    {
        title: 'Пароли везде одинаковые',
        question: 'В чём ошибка этого пользователя?',
        mode: 'mcq',
        vulnType: 'Безопасность паролей',
        lines: [
            'Использует один пароль для всех сайтов',
            '"Так проще запомнить"',
            'Пароль: "МойКот2024"'
        ],
        options: [
            'Ничего страшного, пароль сложный',
            'Если один сайт взломают, получат доступ ко всем',
            'Кот - это ненадёжный пароль',
            '2024 - это старый год'
        ],
        answer: 1,
        hint1: 'Что будет, если один из сайтов утечёт?',
        hint2: 'Одинаковые пароли = все аккаунты под угрозой',
        explanation: 'Используйте разные пароли для разных сайтов! Если один сайт взломают, злоумышленники получат доступ ко всем вашим аккаунтам.'
    },
    {
        title: 'Скачивание реферата',
        question: 'В какой строке опасность?',
        mode: 'line',
        vulnType: 'Вирусы',
        lines: [
            'Нашёл сайт с бесплатными рефератами',
            'Для скачивания нужно отключить антивирус',
            '"Антивирус мешает загрузке"',
            'Файл: "реферат_по_истории.exe"'
        ],
        answerLine: 2,
        hint1: 'Реферат должен быть в формате .doc или .pdf',
        hint2: 'Зачем реферату формат .exe (программа)?',
        explanation: 'Реферат не может быть в формате .exe! Это вирус. Никогда не отключайте антивирус и не скачивайте подозрительные файлы.'
    },
    // ===== FLOWCHART TASKS (5 variants - simple logic for 8-9 grade) =====
    {
        title: 'Блок-схема: Если дождь - бери зонт',
        question: 'Соберите правильную блок-схему',
        mode: 'flowchart',
        vulnType: 'Логика',
        proverb: 'Ситуация: "Если идёт дождь - возьми зонт"',
        always: false,
        blocks: [
            { text: 'Выходим на улицу', type: 'process', correctZone: 0 },
            { text: 'Идёт дождь?', type: 'decision', correctZone: 1 },
            { text: 'Да', type: 'branch-yes', correctZone: 2 },
            { text: 'Нет', type: 'branch-no', correctZone: 3 },
            { text: 'Берём зонт', type: 'process', correctZone: 4 },
            { text: 'Идём без зонта', type: 'process', correctZone: 5 }
        ],
        zones: [
            { label: 'Начало', correctText: 'Выходим на улицу' },
            { label: 'Условие (ромб)', correctText: 'Идёт дождь?' },
            { label: 'Ветка ДА', correctText: 'Да' },
            { label: 'Ветка НЕТ', correctText: 'Нет' },
            { label: 'Действие 1', correctText: 'Берём зонт' },
            { label: 'Действие 2', correctText: 'Идём без зонта' }
        ],
        hint1: 'Сначала мы выходим, потом проверяем погоду',
        hint2: 'Если дождь = берём зонт, если нет = идём без зонта',
        explanation: 'Блок-схема: Начало → Проверка (дождь?) → Если да → берём зонт, если нет → идём без зонта.'
    },
    {
        title: 'Блок-схема: Домашнее задание',
        question: 'Расставьте блоки по порядку',
        mode: 'flowchart',
        vulnType: 'Логика',
        proverb: 'Ситуация: "Сделал уроки - гуляй, нет - сиди дома"',
        always: false,
        blocks: [
            { text: 'Пришёл из школы', type: 'process', correctZone: 0 },
            { text: 'Сделал уроки?', type: 'decision', correctZone: 1 },
            { text: 'Да, сделал', type: 'branch-yes', correctZone: 2 },
            { text: 'Нет, не сделал', type: 'branch-no', correctZone: 3 },
            { text: 'Иди гулять', type: 'process', correctZone: 4 },
            { text: 'Сиди дома, делай уроки', type: 'process', correctZone: 5 }
        ],
        zones: [
            { label: 'Начало', correctText: 'Пришёл из школы' },
            { label: 'Условие (ромб)', correctText: 'Сделал уроки?' },
            { label: 'Ветка ДА', correctText: 'Да, сделал' },
            { label: 'Ветка НЕТ', correctText: 'Нет, не сделал' },
            { label: 'Результат 1', correctText: 'Иди гулять' },
            { label: 'Результат 2', correctText: 'Сиди дома, делай уроки' }
        ],
        hint1: 'Сначала пришёл из школы, потом проверил уроки',
        hint2: 'Сделал = гуляй, не сделал = сиди дома',
        explanation: 'Логика: Пришёл → Проверил уроки → Если сделал = гуляй, если нет = сиди дома.'
    },
    {
        title: 'Блок-схема: Автобус',
        question: 'Постройте правильную схему',
        mode: 'flowchart',
        vulnType: 'Логика',
        proverb: 'Ситуация: "Пришёл на остановку, ждёшь автобус"',
        always: false,
        blocks: [
            { text: 'Пришёл на остановку', type: 'process', correctZone: 0 },
            { text: 'Автобус приехал?', type: 'decision', correctZone: 1 },
            { text: 'Да', type: 'branch-yes', correctZone: 2 },
            { text: 'Нет', type: 'branch-no', correctZone: 3 },
            { text: 'Садись в автобус', type: 'process', correctZone: 4 },
            { text: 'Жди дальше', type: 'process', correctZone: 5 }
        ],
        zones: [
            { label: 'Начало', correctText: 'Пришёл на остановку' },
            { label: 'Условие (ромб)', correctText: 'Автобус приехал?' },
            { label: 'Ветка ДА', correctText: 'Да' },
            { label: 'Ветка НЕТ', correctText: 'Нет' },
            { label: 'Действие 1', correctText: 'Садись в автобус' },
            { label: 'Действие 2', correctText: 'Жди дальше' }
        ],
        hint1: 'Пришёл → Проверил → Ждёшь или садишься',
        hint2: 'Если приехал = садись, нет = жди',
        explanation: 'Блок-схема: Пришёл → Проверил автобус → Если приехал = садись, если нет = жди дальше.'
    },
    {
        title: 'Блок-схема: Холодильник',
        question: 'Расставьте блоки правильно',
        mode: 'flowchart',
        vulnType: 'Логика',
        proverb: 'Ситуация: "Открыл холодильник - есть еда? - есть, поел"',
        always: false,
        blocks: [
            { text: 'Захотел есть', type: 'process', correctZone: 0 },
            { text: 'Есть еда в холодильнике?', type: 'decision', correctZone: 1 },
            { text: 'Да, есть', type: 'branch-yes', correctZone: 2 },
            { text: 'Нет, пусто', type: 'branch-no', correctZone: 3 },
            { text: 'Поешь', type: 'process', correctZone: 4 },
            { text: 'Иди в магазин', type: 'process', correctZone: 5 }
        ],
        zones: [
            { label: 'Начало', correctText: 'Захотел есть' },
            { label: 'Условие (ромб)', correctText: 'Есть еда в холодильнике?' },
            { label: 'Ветка ДА', correctText: 'Да, есть' },
            { label: 'Ветка НЕТ', correctText: 'Нет, пусто' },
            { label: 'Результат 1', correctText: 'Поешь' },
            { label: 'Результат 2', correctText: 'Иди в магазин' }
        ],
        hint1: 'Захотел есть → Проверил холодильник',
        hint2: 'Еда есть = поешь, нет = иди в магазин',
        explanation: 'Логика: Захотел есть → Проверил → Если есть = поешь, если нет = иди в магазин.'
    },
    {
        title: 'Блок-схема: Будильник',
        question: 'Соберите правильную блок-схему',
        mode: 'flowchart',
        vulnType: 'Логика',
        proverb: 'Ситуация: "Прозвенел будильник - вставай или спи дальше"',
        always: false,
        blocks: [
            { text: 'Прозвенел будильник', type: 'process', correctZone: 0 },
            { text: 'Пора вставать?', type: 'decision', correctZone: 1 },
            { text: 'Да, пора', type: 'branch-yes', correctZone: 2 },
            { text: 'Нет, ещё 5 минут', type: 'branch-no', correctZone: 3 },
            { text: 'Вставай', type: 'process', correctZone: 4 },
            { text: 'Выключи будильник и спи', type: 'process', correctZone: 5 }
        ],
        zones: [
            { label: 'Начало', correctText: 'Прозвенел будильник' },
            { label: 'Условие (ромб)', correctText: 'Пора вставать?' },
            { label: 'Ветка ДА', correctText: 'Да, пора' },
            { label: 'Ветка НЕТ', correctText: 'Нет, ещё 5 минут' },
            { label: 'Действие 1', correctText: 'Вставай' },
            { label: 'Действие 2', correctText: 'Выключи будильник и спи' }
        ],
        hint1: 'Будильник прозвенел → решил: вставать или нет',
        hint2: 'Пора = вставай, нет = спи дальше',
        explanation: 'Блок-схема: Будильник → Проверил → Если пора = вставай, если нет = спи дальше.'
    },
    // ===== AUCTION TABLE TASKS (5 variants with different scenarios, budget 1M ₽) =====
    {
        title: 'Аукцион: Защита компьютера',
        question: 'Выберите меры защиты для домашнего компьютера в рамках бюджета',
        mode: 'auction',
        vulnType: 'Управление рисками',
        scenario: '🏠 Вы купили новый компьютер для учёбы и развлечений. Какие меры защиты установите? Бюджет — 1 000 000 ₽.',
        budget: 1000000,
        always: false,
        measures: [
            { name: 'Антивирус (Kaspersky)', cost: 150000, correct: true, icon: '🛡️', description: 'Надёжная защита от вирусов и шпионов' },
            { name: 'Резервное копирование (облако)', cost: 120000, correct: true, icon: '☁️', description: 'Автосохранение файлов в облако' },
            { name: 'Фаервол (брандмауэр)', cost: 80000, correct: true, icon: '🔥', description: 'Блокировка подозрительных подключений' },
            { name: 'Обучение кибербезопасности', cost: 50000, correct: true, icon: '📚', description: 'Курс по распознаванию фишинга' },
            { name: 'Менеджер паролей', cost: 60000, correct: true, icon: '🔑', description: 'Хранение всех паролей в сейфе' },
            { name: 'Золотая рамка монитора', cost: 200000, correct: false, icon: '🖼️', description: 'Красиво, но от вирусов не спасёт' },
            { name: 'RGB подсветка корпуса', cost: 90000, correct: false, icon: '🌈', description: 'Светится красиво, но не защищает' },
            { name: 'Игровая мышка', cost: 70000, correct: false, icon: '🖱️', description: 'Для игр, а не для защиты' },
            { name: 'Стикер "Я хакер"', cost: 30000, correct: false, icon: '😎', description: 'Модный стикер, но бесполезный' },
            { name: 'Вентилятор с LED', cost: 110000, correct: false, icon: '🌀', description: 'Охлаждение, но не защита' },
            { name: 'Подставка под ноутбук', cost: 40000, correct: false, icon: '📐', description: 'Удобно, но не связано с ИБ' },
            { name: 'Беспроводная зарядка', cost: 85000, correct: false, icon: '⚡', description: 'Удобно, но не защищает' }
        ],
        hint1: 'Главные риски: вирусы, потеря файлов, взлом аккаунтов, фишинг',
        hint2: 'Антивирус + бэкап + фаервол + обучение + менеджер паролей = надёжная защита',
        explanation: 'Правильные меры: Антивирус (150К) + Бэкап (120К) + Фаервол (80К) + Обучение (50К) + Менеджер паролей (60К) = 460 000₽. Остальное — лишние траты!'
    },
    {
        title: 'Аукцион: Защита телефона',
        question: 'Выберите меры защиты для смартфона в рамках бюджета',
        mode: 'auction',
        vulnType: 'Мобильная безопасность',
        scenario: '📱 У вас новый флагманский смартфон. Как его защитите от цифровых угроз? Бюджет — 1 000 000 ₽.',
        budget: 1000000,
        always: false,
        measures: [
            { name: 'Мобильный антивирус', cost: 100000, correct: true, icon: '🛡️', description: 'Сканирование приложений и файлов' },
            { name: 'Блокировка экрана (отпечаток/Face ID)', cost: 30000, correct: true, icon: '🔒', description: 'Настройка PIN или биометрии' },
            { name: 'Двухфакторная аутентификация (2FA)', cost: 20000, correct: true, icon: '🔑', description: 'Приложение-аутентификатор' },
            { name: 'VPN для публичных Wi-Fi', cost: 120000, correct: true, icon: '🌐', description: 'Шифрование трафика в общественных сетях' },
            { name: 'Настройки приватности приложений', cost: 25000, correct: true, icon: '👁️', description: 'Ограничение доступа к данным' },
            { name: 'Чехол с бриллиантами', cost: 500000, correct: false, icon: '💎', description: 'Дорого и красиво, но от вирусов не спасёт' },
            { name: 'Защитное стекло Premium', cost: 80000, correct: false, icon: '🪟', description: 'От царапин да, но не от киберугроз' },
            { name: 'Платная тема оформления', cost: 60000, correct: false, icon: '🎭', description: 'Красивые иконки, но не защита' },
            { name: 'Портативная зарядка', cost: 90000, correct: false, icon: '🔋', description: 'Полезно, но не связано с безопасностью' },
            { name: 'Bluetooth трекер для ключей', cost: 70000, correct: false, icon: '📍', description: 'Для ключей, а не для телефона' },
            { name: 'Селфи-палка', cost: 40000, correct: false, icon: '🤳', description: 'Для фото, но не для защиты' },
            { name: 'Страховка телефона', cost: 300000, correct: false, icon: '📋', description: 'От кражи поможет, но не от хакеров' }
        ],
        hint1: 'Главные риски: вирусы в приложениях, кража данных в публичных Wi-Fi, доступ чужих людей к телефону',
        hint2: 'Антивирус + блокировка + 2FA + VPN + приватность = полная защита смартфона',
        explanation: 'Правильные меры: Антивирус (100К) + Блокировка (30К) + 2FA (20К) + VPN (120К) + Приватность (25К) = 295 000₽. Остальное не защищает от цифровых угроз!'
    },
    {
        title: 'Аукцион: Защита соцсетей',
        question: 'Выберите меры защиты для аккаунтов в соцсетях',
        mode: 'auction',
        vulnType: 'Безопасность аккаунтов',
        scenario: '🌐 У вас ВКонтакте, Telegram и Instagram. Как защитите аккаунты от взлома? Бюджет — 1 000 000 ₽.',
        budget: 1000000,
        always: false,
        measures: [
            { name: 'Генератор уникальных паролей', cost: 40000, correct: true, icon: '🔐', description: 'Создание сложных паролей для каждого сайта' },
            { name: 'Двухфакторная аутентификация', cost: 30000, correct: true, icon: '📲', description: 'Код из SMS при каждом входе' },
            { name: 'Настройка приватности', cost: 25000, correct: true, icon: '⚙️', description: 'Кто видит ваши фото и переписки' },
            { name: 'Сервис проверки сессий', cost: 35000, correct: true, icon: '📱', description: 'Контроль устройств, которые вошли в аккаунт' },
            { name: 'Антиспам-фильтр', cost: 80000, correct: true, icon: '🚫', description: 'Блокировка спама и фишинговых ссылок' },
            { name: 'Накрутка подписчиков', cost: 200000, correct: false, icon: '📈', description: 'Фейки, которые не защитят аккаунт' },
            { name: 'Платная верификация', cost: 300000, correct: false, icon: '✅', description: 'Галочка не спасает от взлома' },
            { name: 'Бот для автоответов', cost: 150000, correct: false, icon: '🤖', description: 'Может украсть ваш аккаунт' },
            { name: 'VPN для лайков', cost: 120000, correct: false, icon: '🌍', description: 'Бессмысленно для лайков' },
            { name: 'Дизайн профиля', cost: 100000, correct: false, icon: '🎨', description: 'Красиво, но не защищает' },
            { name: 'Таргетированная реклама', cost: 250000, correct: false, icon: '📢', description: 'Для продвижения, а не защиты' },
            { name: 'Покупка лайков', cost: 50000, correct: false, icon: '❤️', description: 'Бесполезно и опасно' }
        ],
        hint1: 'Главные риски: взлом аккаунта, утечка личных данных, мошенники от вашего имени',
        hint2: 'Пароли + 2FA + приватность + проверка сессий + антиспам = максимальная защита',
        explanation: 'Правильные меры: Пароли (40К) + 2FA (30К) + Приватность (25К) + Сессии (35К) + Антиспам (80К) = 210 000₽.'
    },
    {
        title: 'Аукцион: Защита онлайн-банка',
        question: 'Выберите меры защиты для интернет-банка',
        mode: 'auction',
        vulnType: 'Финансовая безопасность',
        scenario: '🏦 Вы пользуетесь онлайн-банком. Как защитите свои финан от кибермошенников? Бюджет — 1 000 000 ₽.',
        budget: 1000000,
        always: false,
        measures: [
            { name: 'Двухфакторная аутентификация', cost: 40000, correct: true, icon: '🔑', description: 'SMS-код при каждом входе в банк' },
            { name: 'Виртуальная карта для онлайн-покупок', cost: 30000, correct: true, icon: '💳', description: 'Лимитированная карта для интернета' },
            { name: 'Антивирус с защитой платежей', cost: 180000, correct: true, icon: '🛡️', description: 'Специальная защита банковских операций' },
            { name: 'SMS-уведомления об операциях', cost: 20000, correct: true, icon: '🔔', description: 'Мгновенные SMS о списаниях' },
            { name: 'Настройка лимитов на переводы', cost: 15000, correct: true, icon: '📊', description: 'Ограничение суммы перевода в день' },
            { name: 'Золотая банковская карта', cost: 400000, correct: false, icon: '🏅', description: 'Статусная, но не защищает от мошенников' },
            { name: 'Финансовый консультант', cost: 300000, correct: false, icon: '👔', description: 'Советует куда вложить, но не защищает' },
            { name: 'Кешбэк-бонусы', cost: 0, correct: false, icon: '💰', description: 'Приятно, но это не защита' },
            { name: 'Премиум обслуживание', cost: 250000, correct: false, icon: '⭐', description: 'Комфорт, но не безопасность' },
            { name: 'Страховка вклада', cost: 200000, correct: false, icon: '📋', description: 'От банкротства банка, не от хакеров' },
            { name: 'Бонусная программа', cost: 50000, correct: false, icon: '🎁', description: 'Баллы, а не защита' },
            { name: 'Дизайнерская карта', cost: 100000, correct: false, icon: '🎨', description: 'Красивая, но функции те же' }
        ],
        hint1: 'Главные риски: кража данных карты, взлом онлайн-банка, мошеннические переводы',
        hint2: '2FA + виртуальная карта + антивирус + уведомления + лимиты = защита финансов',
        explanation: 'Правильные меры: 2FA (40К) + Вирт. карта (30К) + Антивирус (180К) + Уведомления (20К) + Лимиты (15К) = 285 000₽.'
    },
    {
        title: 'Аукцион: Защита Wi-Fi сети',
        question: 'Выберите меры защиты для домашней Wi-Fi сети',
        mode: 'auction',
        vulnType: 'Сетевая безопасность',
        scenario: '📡 Вы настроили домашнюю Wi-Fi сеть. Как его защитите от злоумышленников? Бюджет — 1 000 000 ₽.',
        budget: 1000000,
        always: false,
        measures: [
            { name: 'Роутер с поддержкой WPA3', cost: 150000, correct: true, icon: '🔐', description: 'Самый надёжный стандарт шифрования Wi-Fi' },
            { name: 'Настройка сложного пароя', cost: 20000, correct: true, icon: '🔑', description: 'Минимум 12 символов с буквами и цифрами' },
            { name: 'Скрытие имени сети (SSID)', cost: 15000, correct: true, icon: '👻', description: 'Сеть не видна в списке доступных' },
            { name: 'Настройка гостевой сети', cost: 30000, correct: true, icon: '👥', description: 'Отдельная сеть без доступа к вашим устройствам' },
            { name: 'Обновление прошивки роутера', cost: 25000, correct: true, icon: '🔄', description: 'Закрытие уязвимостей в ПО роутера' },
            { name: 'Золотой корпус роутера', cost: 300000, correct: false, icon: '🏆', description: 'Выглядит дорого, но сигнал тот же' },
            { name: 'Усилитель сигнала', cost: 150000, correct: false, icon: '📶', description: 'Дальше бьёт, но не защищает' },
            { name: 'RGB подсветка роутера', cost: 80000, correct: false, icon: '🌈', description: 'Красиво светится, но не защищает' },
            { name: 'Антенна-дизайн', cost: 120000, correct: false, icon: '📡', description: 'Стильная антенна, но не ИБ' },
            { name: 'Смарт-розетка', cost: 60000, correct: false, icon: '🔌', description: 'Включать роутер по расписанию, но не защита' },
            { name: 'Подставка под роутер', cost: 30000, correct: false, icon: '📐', description: 'Эстетика, но не безопасность' },
            { name: 'Бесперебойник', cost: 200000, correct: false, icon: '🔋', description: 'От отключения света, не от хакеров' }
        ],
        hint1: 'Главные риски: подключение чужих людей к сети, перехват данных, взлом роутера',
        hint2: 'WPA3 + сложный пароль + скрытие SSID + гостевая сеть + обновление = защита сети',
        explanation: 'Правильные меры: WPA3 (150К) + Пароль (20К) + Скрытие SSID (15К) + Гостевая сеть (30К) + Обновление (25К) = 240 000₽.'
    },
    // ===== MATCHING TASKS (always appear, 3 variants) =====
    {
        title: 'Соответствие угроз',
        question: 'Определите тип угрозы для каждой ситуации',
        mode: 'matching',
        vulnType: 'Классификация угроз',
        always: true,
        scenarios: [
            { text: 'SMS: "Ваш аккаунт заблокирован, перейдите по ссылке"', correctAnswer: 1 },
            { text: 'Звонят: "Я из банка, назовите код с карты"', correctAnswer: 0 },
            { text: 'Файлы зашифрованы, требуют деньги за расшифровку', correctAnswer: 2 }
        ],
        answers: [
            { text: 'Социальная инженерия (обман по телефону)' },
            { text: 'Фишинг (поддельная ссылка)' },
            { text: 'Вирус-шифровальщик (вымогательство)' }
        ],
        hint1: 'Фишинг - это когда вас "ловят" на поддельную ссылку',
        hint2: 'Социальная инженерия - это обман человека по телефону',
        explanation: 'SMS со ссылкой = Фишинг. Звонок из "банка" = Социальная инженерия. Шифрование файлов = Вирус-шифровальщик.'
    },
    {
        title: 'Соответствие угроз #2',
        question: 'Определите тип угрозы',
        mode: 'matching',
        vulnType: 'Классификация угроз',
        always: true,
        scenarios: [
            { text: 'Письмо от "директора": "Переведи деньги срочно!"', correctAnswer: 0 },
            { text: 'Сайт выглядит как ВКонтакте, но адрес странный', correctAnswer: 1 },
            { text: 'Экран заблокирован: "Отправьте SMS для разблокировки"', correctAnswer: 2 }
        ],
        answers: [
            { text: 'Социальная инженерия (манипуляция)' },
            { text: 'Фишинг (поддельный сайт)' },
            { text: 'Вымогательство (требуют деньги)' }
        ],
        hint1: 'Письмо от "начальника" - это манипуляция',
        hint2: 'Поддельный сайт ВКонтакте = фишинг',
        explanation: 'Письмо от "директора" = Социальная инженерия. Поддельный сайт = Фишинг. Блокировка с требованием SMS = Вымогательство.'
    },
    {
        title: 'Соответствие угроз #3',
        question: 'Сопоставьте ситуации с типами угроз',
        mode: 'matching',
        vulnType: 'Классификация угроз',
        always: true,
        scenarios: [
            { text: '"Вы выиграли iPhone! Для получения оплатите доставку"', correctAnswer: 1 },
            { text: 'Друг просит ваш пароль "на минуту"', correctAnswer: 0 },
            { text: 'Появилась реклама: "Ваш компьютер заражён! Скачайте антивирус"', correctAnswer: 2 }
        ],
        answers: [
            { text: 'Социальная инженерия (обман)' },
            { text: 'Фишинг (приманка с "выигрышем")' },
            { text: 'Вирус (фейковый антивирус)' }
        ],
        hint1: '"Выигрыш", в котором не участвовал = приманка',
        hint2: 'Просьба пароля = социальная инженерия',
        explanation: '"Выигрыш" = Фишинг. Просьба пароля = Социальная инженерия. Фейковый антивирус = Вирус.'
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