const allTasks = [
    {
        title: "Слишком простой пароль",
        question: "Что здесь небезопасно?",
        mode: "mcq",
        lines: [
            'password = "1234"',
            'if password == input("Пароль"):',
            "    open_panel()"
        ],
        options: [
            "Пароль слишком простой и легко угадывается",
            "Код слишком длинный",
            "Нужно больше пробелов",
            "Плохо, что есть if"
        ],
        answer: 0,
        hint1: "Подумай, легко ли угадать этот секрет.",
        hint2: "Проблема не в коде, а в самом пароле.",
        explanation: "Пароль слишком короткий и предсказуемый. Его можно быстро угадать или подобрать. Лучше использовать длинный уникальный пароль и не повторять его в разных сервисах.",
        vulnType: "Слабая аутентификация"
    },
    {
        title: "Пароль в открытом виде",
        question: "Кликни на строку, где спрятана проблема.",
        mode: "line",
        lines: [
            'login = input("Логин")',
            'password = "Qwerty12"',
            "save_account(login, password)"
        ],
        answerLine: 2,
        hint1: "Секрет не должен лежать прямо в тексте программы.",
        hint2: "Опасная строка выглядит как обычная переменная с паролем.",
        explanation: "Пароль хранится прямо в коде, а это очень рискованно. Любой, кто увидит программу, узнает секрет. Правильно хранить такие данные отдельно и в защищённом виде.",
        vulnType: "Секрет в коде"
    },
    {
        title: "Передача без шифрования",
        question: "Что здесь небезопасно?",
        mode: "mcq",
        lines: [
            'url = "http://shop.local/login"',
            "send_login(url, user, password)",
            "show_message('Готово')"
        ],
        options: [
            "Данные отправляются без защищённого соединения",
            "Слишком много строк",
            "Нужно написать print вместо send_login",
            "Нельзя использовать переменные"
        ],
        answer: 0,
        hint1: "Посмотри на адрес сайта.",
        hint2: "Проблема в том, что соединение выглядит незащищённым.",
        explanation: "Данные идут по обычному, незащищённому адресу. Их проще перехватить. Для логинов, паролей и личной информации нужно использовать защищённый канал.",
        vulnType: "Передача без шифрования"
    },
    {
        title: "Публичный Wi-Fi",
        question: "Что здесь небезопасно?",
        mode: "mcq",
        lines: [
            'network = "Public_Free_WiFi"',
            "connect(network)",
            "send_profile_data()"
        ],
        options: [
            "Подключение к открытой сети без защиты",
            "Нужно убрать кавычки",
            "Слишком простое имя сети",
            "Функция connect всегда запрещена"
        ],
        answer: 0,
        hint1: "Открытая сеть — не лучший выбор для важных данных.",
        hint2: "Проблема в том, что сеть выглядит общей и незащищённой.",
        explanation: "Публичная сеть может быть небезопасной. В ней проще подсмотреть трафик или подменить соединение. Для важных действий лучше использовать защищённую сеть и защиту соединения.",
        vulnType: "Небезопасная сеть"
    },
    {
        title: "Нет проверки ввода",
        question: "Кликни на строку, где пропущена проверка.",
        mode: "line",
        lines: [
            'name = input("Имя")',
            "save_profile(name)",
            "show_ok()"
        ],
        answerLine: 2,
        hint1: "Пользователь может ввести что угодно.",
        hint2: "Опасна строка, где данные сразу принимаются без проверки.",
        explanation: "Ввод пользователя сразу отправляется дальше без проверки. Это может привести к ошибкам, мусорным данным и уязвимостям. Надо проверять формат и допустимые значения.",
        vulnType: "Нет проверки ввода"
    },
    {
        title: "Подозрительный запрос к базе",
        question: "Что здесь небезопасно?",
        mode: "mcq",
        lines: [
            'query = "SELECT * FROM users WHERE name = \'" + user + "\'"',
            "db.run(query)",
            "show_users()"
        ],
        options: [
            "Запрос собирается из текста пользователя",
            "Нужно заменить users на file",
            "Проблема в слове SELECT",
            "Нельзя использовать базу данных"
        ],
        answer: 0,
        hint1: "Посмотри, откуда берётся кусок запроса.",
        hint2: "Опасно, когда пользователь может повлиять на сам запрос.",
        explanation: "Запрос собирается вручную из пользовательского ввода. Это опасно: ввод может изменить смысл запроса. Правильно — использовать безопасные параметры и не склеивать запрос строками.",
        vulnType: "SQL-инъекция"
    },
    {
        title: "Нет второго шага входа",
        question: "Что здесь небезопасно?",
        mode: "mcq",
        lines: [
            'login = input("Логин")',
            'password = input("Пароль")',
            "open_account(login, password)"
        ],
        options: [
            "Нет двухфакторной проверки",
            "Нужно убрать логин",
            "Пароль не должен быть строкой",
            "Открывать аккаунт нельзя никогда"
        ],
        answer: 0,
        hint1: "Вход подтверждается только одним способом.",
        hint2: "Подумай, чего не хватает после пароля.",
        explanation: "Здесь есть только логин и пароль. Если они окажутся у злоумышленника, он сразу войдёт. Дополнительный шаг входа делает аккаунт заметно безопаснее.",
        vulnType: "Нет второго шага входа"
    },
    {
        title: "Открытая админка",
        question: "Кликни на строку, где забыли про защиту доступа.",
        mode: "line",
        lines: [
            'admin_url = "/admin"',
            "open_page(admin_url)",
            "log_access()"
        ],
        answerLine: 2,
        hint1: "Публичный доступ к админке — плохая идея.",
        hint2: "Опасна строка, которая открывает админскую часть без проверки.",
        explanation: "Административная часть открывается без проверки прав. Это опасно: любой может попробовать зайти туда. Нужно сначала убедиться, что пользователь имеет нужные права.",
        vulnType: "Открытая админка"
    },
    {
        title: "Системная ошибка наружу",
        question: "Что здесь небезопасно?",
        mode: "mcq",
        lines: [
            "try:",
            "    load_config()",
            "except Exception as e:",
            "    print(e)"
        ],
        options: [
            "Показываются внутренние ошибки пользователю",
            "Нужно убрать try",
            "Ошибки полезно всегда печатать на экран",
            "Проблема только в названии load_config"
        ],
        answer: 0,
        hint1: "Лишняя информация в ошибке — это лишняя помощь для атакующего.",
        hint2: "Посмотри, что происходит после исключения.",
        explanation: "Пользователю показывается внутренняя ошибка системы. Это может раскрыть детали работы программы и помочь найти слабые места. Лучше показывать короткое понятное сообщение, а детали хранить в журнале.",
        vulnType: "Утечка ошибок"
    },
    {
        title: "Один пароль везде",
        question: "Что здесь небезопасно?",
        mode: "mcq",
        lines: [
            'bank = "same_password_1"',
            'mail = "same_password_1"',
            'game = "same_password_1"'
        ],
        options: [
            "Пароль одинаковый для разных сервисов",
            "Слишком мало переменных",
            "Нужно использовать только цифры",
            "Одинаковый пароль всегда лучше"
        ],
        answer: 0,
        hint1: "Если один пароль утечёт, пострадают все аккаунты.",
        hint2: "Проблема не в самих строках, а в том, что везде одно и то же.",
        explanation: "Одинаковый пароль в нескольких местах очень опасен. Потеря одного доступа может открыть сразу все остальные. Лучше делать отдельный пароль для каждого сервиса.",
        vulnType: "Повторное использование пароля"
    },
    {
        title: "Доверие пользовательским данным",
        question: "Кликни на строку, где программа слишком доверяет вводу.",
        mode: "line",
        lines: [
            'role = input("Роль")',
            'if role == "admin":',
            "    grant_access()"
        ],
        answerLine: 2,
        hint1: "Пользователь сам выбрал себе роль.",
        hint2: "Опасно, когда важное решение зависит только от строки, которую ввели с клавиатуры.",
        explanation: "Программа верит роли, которую ввёл сам пользователь. Так делать нельзя: человек может написать что угодно. Роль должна проверяться по данным системы, а не по словам пользователя.",
        vulnType: "Лишнее доверие к данным"
    },
    {
        title: "Подозрительная ссылка",
        question: "Что здесь небезопасно?",
        mode: "mcq",
        lines: [
            'link = "bit.ly/free-update-now"',
            "open_link(link)",
            "show_banner()"
        ],
        options: [
            "Ссылка выглядит сомнительно и непонятно куда ведёт",
            "Нужно всегда использовать короткие ссылки",
            "Любая ссылка безопасна",
            "Проблема только в названии переменной"
        ],
        answer: 0,
        hint1: "Короткий адрес скрывает настоящий сайт.",
        hint2: "Опасно, когда нельзя заранее понять, куда ведёт ссылка.",
        explanation: "Ссылка выглядит подозрительно и скрывает настоящий адрес. Нельзя слепо открывать такие переходы. Пользователь должен понимать, куда он попадает.",
        vulnType: "Небезопасная ссылка"
    },
    {
        title: "Скачивание без проверки",
        question: "Кликни на строку, где загрузка сделана рискованно.",
        mode: "line",
        lines: [
            'file_url = input("Ссылка")',
            "download(file_url)",
            "save_file()"
        ],
        answerLine: 2,
        hint1: "Сначала подумай: проверяется ли источник файла?",
        hint2: "Опасна строка, которая скачивает всё подряд.",
        explanation: "Файл скачивается без проверки источника и типа. Это может привести к загрузке вредного или ненужного файла. Надо проверять адрес, формат и источник.",
        vulnType: "Скачивание без проверки"
    },
    {
        title: "Нет лимита попыток",
        question: "Что здесь небезопасно?",
        mode: "mcq",
        lines: [
            "while True:",
            '    if check_login():',
            "        open_panel()"
        ],
        options: [
            "Нет ограничения на число попыток входа",
            "Нужно убрать цикл while",
            "Проверка входа всегда плохая",
            "Проблема только в названии check_login"
        ],
        answer: 0,
        hint1: "Подумай о бесконечных попытках.",
        hint2: "Если ошибаться можно сколько угодно, защита быстро слабеет.",
        explanation: "Попытки входа ничем не ограничены. Это облегчает подбор пароля и другие атаки. Лучше ограничить число попыток и делать задержку после ошибок.",
        vulnType: "Нет лимита попыток"
    },
    {
        title: "Устаревший протокол",
        question: "Что здесь небезопасно?",
        mode: "mcq",
        lines: [
            'protocol = "old-ssl"',
            "connect_secure(protocol)",
            "send_data()"
        ],
        options: [
            "Используется устаревший и слабый протокол",
            "Протокол нужно писать с большой буквы",
            "Подключение всегда лишнее",
            "Данные нельзя отправлять вообще"
        ],
        answer: 0,
        hint1: "Старые способы защиты обычно слабее.",
        hint2: "Проблема в том, что выбран старый вариант защиты.",
        explanation: "Используется устаревший протокол. Старые способы защиты часто имеют известные слабые места. Лучше применять современные и поддерживаемые варианты.",
        vulnType: "Устаревший протокол"
    },
    {
        title: "Личные данные в URL",
        question: "Кликни на строку, где данные уходят слишком открыто.",
        mode: "line",
        lines: [
            'url = "/profile?email=" + email',
            "open_page(url)",
            "log_request()"
        ],
        answerLine: 1,
        hint1: "Личные данные не стоит показывать прямо в адресе.",
        hint2: "Опасна строка, где email попадает в URL.",
        explanation: "Личные данные помещаются прямо в адресную строку. Их могут увидеть в истории браузера, журналах и при копировании ссылки. Лучше передавать такие данные более безопасным способом.",
        vulnType: "Личные данные в URL"
    },
    {
        title: "Открытый API-ключ",
        question: "Кликни на строку, где секрет оставили на виду.",
        mode: "line",
        lines: [
            'API_KEY = "sk-test-12345"',
            "send(API_KEY)",
            "show_ready()"
        ],
        answerLine: 1,
        hint1: "Секретный ключ не должен лежать прямо в исходнике.",
        hint2: "Опасная строка выглядит как обычная константа.",
        explanation: "API-ключ открыт прямо в коде. Это опасно, потому что его могут скопировать и использовать без разрешения. Секреты нужно хранить отдельно и не публиковать в коде.",
        vulnType: "Открытый API-ключ"
    },
    {
        title: "Нет прав доступа",
        question: "Что здесь небезопасно?",
        mode: "mcq",
        lines: [
            "open_report(user_id)",
            "show_report()",
            "exit()"
        ],
        options: [
            "Нет проверки прав доступа",
            "Нужно убрать отчёт",
            "Проблема только в имени переменной",
            "Пользователю нельзя ничего показывать"
        ],
        answer: 0,
        hint1: "Не каждый пользователь должен видеть всё.",
        hint2: "Подумай, где должна быть проверка роли или прав.",
        explanation: "Программа открывает отчёт без проверки прав. Это значит, что лишние люди могут увидеть чужие данные. Перед доступом нужно проверять, кому что разрешено.",
        vulnType: "Отсутствие прав доступа"
    },
    {
        title: "Работа с файлами без проверки",
        question: "Что здесь небезопасно?",
        mode: "mcq",
        lines: [
            'path = input("Путь к файлу")',
            "open_file(path)",
            "show_ok()"
        ],
        options: [
            "Прямой доступ к файловой системе без проверки",
            "Нужно всегда открывать файл дважды",
            "Проблема в том, что путь — это строка",
            "Файлы вообще нельзя использовать"
        ],
        answer: 0,
        hint1: "Путь из ввода может быть опасным.",
        hint2: "Подумай, проверяется ли, какой именно файл откроют.",
        explanation: "Программа принимает путь к файлу без проверки. Это опасно: можно открыть не тот файл или попасть куда не нужно. Нужно ограничивать допустимые пути и проверять ввод.",
        vulnType: "Небезопасная работа с файлами"
    },
    {
        title: "Подозрительная библиотека",
        question: "Что здесь небезопасно?",
        mode: "mcq",
        lines: [
            'library = "magic_free_toolkit"',
            "install(library)",
            "run()"
        ],
        options: [
            "Используется подозрительная внешняя библиотека",
            "Нужно ставить библиотеку вручную",
            "Любая библиотека безопасна",
            "Проблема только в слове magic"
        ],
        answer: 0,
        hint1: "Неизвестный пакет без проверки — это риск.",
        hint2: "Посмотри, звучит ли название слишком случайно.",
        explanation: "Подключается подозрительная внешняя библиотека. Если источник неизвестен, она может принести ошибки или лишние риски. Лучше использовать только проверенные пакеты.",
        vulnType: "Подозрительная библиотека"
    }
];

const fileTabsData = [
    {
        name: "main.py",
        preview:
            `def run_game():
    print("SafeCode Lab")
    # проверяй очевидные ошибки
    # не доверяй данным вслепую`
    },
    {
        name: "auth.py",
        preview:
            `def login(user, password):
    if not user or not password:
        return "ошибка"
    # проверка прав должна быть отдельной`
    },
    {
        name: "net.py",
        preview:
            `def send_data(payload):
    # используй защищённое соединение
    # не передавай секреты в адресе`
    }
];

const ui = {
    bgFeed: document.getElementById("bgFeed"),
    fileTabs: document.getElementById("fileTabs"),
    filePreview: document.getElementById("filePreview"),
    scanBtn: document.getElementById("scanBtn"),
    themeBtn: document.getElementById("themeBtn"),
    restartBtn: document.getElementById("restartBtn"),
    taskCounter: document.getElementById("taskCounter"),
    scoreCounter: document.getElementById("scoreCounter"),
    timeCounter: document.getElementById("timeCounter"),
    hintCounter: document.getElementById("hintCounter"),
    levelPill: document.getElementById("levelPill"),
    progressPill: document.getElementById("progressPill"),
    progressFill: document.getElementById("progressFill"),
    progressText: document.getElementById("progressText"),
    taskBadge: document.getElementById("taskBadge"),
    taskTitle: document.getElementById("taskTitle"),
    taskQuestion: document.getElementById("taskQuestion"),
    taskType: document.getElementById("taskType"),
    taskMeta: document.getElementById("taskMeta"),
    codeBlock: document.getElementById("codeBlock"),
    options: document.getElementById("options"),
    hintBtn1: document.getElementById("hintBtn1"),
    hintBtn2: document.getElementById("hintBtn2"),
    checkBtn: document.getElementById("checkBtn"),
    nextBtn: document.getElementById("nextBtn"),
    hintBox: document.getElementById("hintBox"),
    feedbackBox: document.getElementById("feedbackBox"),
    consoleBox: document.getElementById("consoleBox"),
    toast: document.getElementById("toast"),
    taskCard: document.getElementById("taskCard"),
    gameView: document.getElementById("gameView"),
    resultView: document.getElementById("resultView"),
    resultLevel: document.getElementById("resultLevel"),
    resultText: document.getElementById("resultText"),
    finalScore: document.getElementById("finalScore"),
    finalCorrect: document.getElementById("finalCorrect"),
    finalPerfect: document.getElementById("finalPerfect"),
    finalPercent: document.getElementById("finalPercent"),
    againBtn: document.getElementById("againBtn"),
};

let deck = [];
let currentIndex = 0;
let score = 0;
let correctCount = 0;
let hintsTotal = 0;
let currentHints = 0;
let answered = false;
let selectedLine = null;
let selectedAnswer = null;
let startTime = Date.now();
let timerId = null;
let bgTimerId = null;
let strictMode = false;
let completedPerfect = 0;

function escapeHtml(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function shuffle(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function formatTime(ms) {
    const total = Math.floor(ms / 1000);
    const mins = String(Math.floor(total / 60)).padStart(2, "0");
    const secs = String(total % 60).padStart(2, "0");
    return `${mins}:${secs}`;
}

function logConsole(message) {
    const stamp = new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const row = document.createElement("div");
    row.className = "console-line";
    row.textContent = `[${stamp}] ${message}`;
    ui.consoleBox.prepend(row);

    while (ui.consoleBox.children.length > 12) {
        ui.consoleBox.removeChild(ui.consoleBox.lastChild);
    }

    addFeedLine(message);
}

function addFeedLine(message) {
    const stamp = new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit"
    });

    const row = document.createElement("div");
    row.className = "feed-line";
    row.textContent = `[${stamp}] ${message}`;
    ui.bgFeed.prepend(row);

    while (ui.bgFeed.children.length > 18) {
        ui.bgFeed.removeChild(ui.bgFeed.lastChild);
    }
}

function showToast(text, kind = "info") {
    ui.toast.textContent = text;
    ui.toast.className = `toast show ${kind}`;
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
        ui.toast.className = "toast";
    }, 2200);
}

function updateClock() {
    ui.timeCounter.textContent = formatTime(Date.now() - startTime);
}

function setSceneIntensity(step) {
    const value = Math.min(1.38, 1 + step * 0.03);
    document.documentElement.style.setProperty("--bg-sat", value.toFixed(2));
}

function renderTabs() {
    ui.fileTabs.innerHTML = "";
    fileTabsData.forEach((file, index) => {
        const button = document.createElement("button");
        button.className = `tab-btn${index === 0 ? " active" : ""}`;
        button.type = "button";
        button.textContent = file.name;
        button.addEventListener("click", () => {
            document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            ui.filePreview.textContent = file.preview;
            logConsole(`Открыт файл ${file.name}`);
        });
        ui.fileTabs.appendChild(button);
    });

    ui.filePreview.textContent = fileTabsData[0].preview;
}

function pointsForHints(hintsUsed) {
    if (hintsUsed <= 0) return 15;
    if (hintsUsed === 1) return 11;
    return 7;
}

function currentTask() {
    return deck[currentIndex];
}

function updateTopStats() {
    ui.taskCounter.textContent = `${Math.min(currentIndex + 1, deck.length)}/${deck.length}`;
    ui.scoreCounter.textContent = `${score}`;
    ui.hintCounter.textContent = `${hintsTotal}`;
    ui.progressPill.textContent = `${Math.min(currentIndex + 1, deck.length)} / ${deck.length}`;
    const done = answered ? currentIndex + 1 : currentIndex;
    const percent = Math.round((done / deck.length) * 100);
    ui.progressText.textContent = `${percent}%`;
    ui.progressFill.style.width = `${percent}%`;
    ui.levelPill.textContent = answered ? "Проверка" : "Работаем";
}

function renderTask() {
    const task = currentTask();
    answered = false;
    selectedLine = null;
    selectedAnswer = null;
    currentHints = 0;

    ui.gameView.classList.remove("hidden");
    ui.resultView.classList.add("hidden");

    ui.taskBadge.textContent = `Задание ${currentIndex + 1}/${deck.length}`;
    ui.taskTitle.textContent = task.title;
    ui.taskQuestion.textContent = task.question;
    ui.taskType.textContent = task.mode === "line" ? "Клик по строке" : "Тест";
    ui.taskMeta.textContent = task.vulnType;

    ui.hintBox.classList.add("hidden");
    ui.hintBox.innerHTML = "";
    ui.feedbackBox.innerHTML = "";

    ui.nextBtn.disabled = true;
    ui.nextBtn.textContent = currentIndex === deck.length - 1 ? "Финиш" : "Следующее";
    ui.checkBtn.classList.toggle("hidden", task.mode !== "line");
    ui.checkBtn.disabled = true;

    ui.options.innerHTML = "";
    ui.options.style.display = task.mode === "mcq" ? "grid" : "none";

    ui.codeBlock.innerHTML = task.lines
        .map((line, index) => {
            if (task.mode === "line") {
                return `
          <button class="code-line" type="button" data-line="${index + 1}">
            <span class="ln">${index + 1}</span>
            <span class="txt">${escapeHtml(line)}</span>
          </button>`;
            }

            return `
        <div class="code-line static">
          <span class="ln">${index + 1}</span>
          <span class="txt">${escapeHtml(line)}</span>
        </div>`;
        })
        .join("");

    if (task.mode === "mcq") {
        ui.options.innerHTML = task.options
            .map((option, index) => `
        <button class="answer-btn" type="button" data-index="${index}">
          <span class="answer-tag">${String.fromCharCode(65 + index)}</span>
          <span class="answer-text">${escapeHtml(option)}</span>
        </button>
      `)
            .join("");
    }

    setSceneIntensity(currentIndex);
    ui.taskCard.classList.remove("enter");
    void ui.taskCard.offsetWidth;
    ui.taskCard.classList.add("enter");

    logConsole(`Загружено: ${task.title}`);
    updateTopStats();
}

function revealHints() {
    const task = currentTask();
    const blocks = [];
    if (currentHints >= 1) {
        blocks.push(`<strong>Подсказка 1:</strong> ${task.hint1}`);
    }
    if (currentHints >= 2) {
        blocks.push(`<strong>Подсказка 2:</strong> ${task.hint2}`);
    }

    ui.hintBox.innerHTML = blocks.join("<br><br>");
    ui.hintBox.classList.toggle("hidden", blocks.length === 0);
    updateTopStats();
}

function showHint(level) {
    if (answered) return;
    currentHints = Math.max(currentHints, level);
    hintsTotal = Math.max(hintsTotal, currentHints) + (level === 2 && currentHints === 2 ? 0 : 0);
    revealHints();
    logConsole(`Показана подсказка ${level} для задания ${currentIndex + 1}`);
    showToast(level === 1 ? "Подсказка раскрыта" : "Подсказка стала точнее");
    updateTopStats();
}

function lockTaskUI(correctLine = null, wrongLine = null) {
    ui.options.querySelectorAll(".answer-btn").forEach(btn => btn.disabled = true);
    ui.codeBlock.querySelectorAll(".code-line[data-line]").forEach(btn => btn.disabled = true);

    if (correctLine !== null) {
        ui.codeBlock.querySelectorAll(".code-line[data-line]").forEach(btn => {
            if (Number(btn.dataset.line) === correctLine) btn.classList.add("correct");
        });
    }
    if (wrongLine !== null) {
        ui.codeBlock.querySelectorAll(".code-line[data-line]").forEach(btn => {
            if (Number(btn.dataset.line) === wrongLine) btn.classList.add("wrong");
        });
    }
}

function flashCriticalError() {
    document.body.classList.add("error-mode");
    setTimeout(() => document.body.classList.remove("error-mode"), 500);
}

function answerTask(isCorrect, displayValue = "") {
    if (answered) return;
    answered = true;

    const task = currentTask();
    const points = isCorrect ? pointsForHints(currentHints) : 0;
    score += points;
    if (isCorrect) {
        correctCount += 1;
        if (currentHints === 0) completedPerfect += 1;
    }

    const feedback = isCorrect
        ? `
      <div class="ok"><strong>Верно.</strong> +${points} очков</div>
      <div style="margin-top:8px;"><strong>В чем ошибка:</strong> ${task.explanation}</div>
    `
        : `
      <div class="bad"><strong>Неверно.</strong> Ошибка не в этой части логики.</div>
      <div style="margin-top:8px;"><strong>Почему это опасно:</strong> ${task.explanation}</div>
    `;

    ui.feedbackBox.innerHTML = feedback;
    ui.nextBtn.disabled = false;
    updateTopStats();

    if (task.mode === "line") {
        lockTaskUI(task.answerLine, selectedLine);
    } else {
        ui.options.querySelectorAll(".answer-btn").forEach(btn => {
            const idx = Number(btn.dataset.index);
            if (idx === task.answer) btn.classList.add("correct");
            if (idx === selectedAnswer && !isCorrect) btn.classList.add("wrong");
            btn.disabled = true;
        });
    }

    if (isCorrect) {
        ui.levelPill.textContent = "Уязвимость найдена";
        showToast(`Верно: +${points} очков`, "success");
        logConsole(`Верный ответ: ${task.title} (${displayValue || "вариант"})`);
    } else {
        ui.levelPill.textContent = "Критическая ошибка";
        flashCriticalError();
        showToast("Критическая ошибка: это был не тот ответ", "danger");
        logConsole(`Неверный ответ: ${task.title}`);
    }
}

function submitMcq(index) {
    if (answered) return;
    selectedAnswer = index;
    const task = currentTask();
    answerTask(index === task.answer, task.options[index]);
}

function submitLineAnswer() {
    if (answered || selectedLine === null) return;
    const task = currentTask();
    answerTask(selectedLine === task.answerLine, `строка ${selectedLine}`);
}

function nextTask() {
    if (!answered) return;

    if (currentIndex < deck.length - 1) {
        currentIndex += 1;
        renderTask();
    } else {
        finishGame();
    }
}

function levelFromPercent(percent) {
    if (percent >= 85) return "Страж данных";
    if (percent >= 70) return "Кибер-аналитик";
    if (percent >= 50) return "Бдительный разработчик";
    return "Новичок безопасности";
}

function finishGame() {
    const maxScore = deck.length * 15;
    const percent = Math.round((score / maxScore) * 100);
    const level = levelFromPercent(percent);

    ui.gameView.classList.add("hidden");
    ui.resultView.classList.remove("hidden");

    ui.resultLevel.textContent = level;
    ui.resultText.textContent =
        percent >= 85
            ? "Ты очень уверенно замечаешь опасные практики и понимаешь, где код ведёт себя рискованно."
            : percent >= 70
                ? "Ты уже видишь большую часть типичных проблем и умеешь быстро находить слабые места."
                : percent >= 50
                    ? "Ты уверенно замечаешь очевидные риски. Ещё немного практики — и будет отличный уровень."
                    : "Ты только начинаешь, и это нормально. Важно, что ты уже научился замечать логические проблемы.";

    ui.finalScore.textContent = `${score}/${maxScore}`;
    ui.finalCorrect.textContent = `${correctCount}/${deck.length}`;
    ui.finalPerfect.textContent = `${completedPerfect}`;
    ui.finalPercent.textContent = `${percent}%`;
    ui.levelPill.textContent = level;
    ui.progressPill.textContent = "Финиш";

    ui.progressFill.style.width = "100%";
    ui.progressText.textContent = "100%";

    logConsole(`Сессия завершена: ${level}`);
    showToast(`Финиш: ${level}`, "success");
}

function resetGame() {
    deck = shuffle(allTasks).slice(0, 10);
    currentIndex = 0;
    score = 0;
    correctCount = 0;
    hintsTotal = 0;
    currentHints = 0;
    answered = false;
    selectedLine = null;
    selectedAnswer = null;
    completedPerfect = 0;
    startTime = Date.now();

    document.body.classList.remove("error-mode");
    ui.consoleBox.innerHTML = "";
    ui.bgFeed.innerHTML = "";
    ui.taskCard.classList.remove("enter");

    renderTabs();
    renderTask();
    updateClock();

    logConsole("Сессия запущена заново");
    showToast("Новая сессия готова", "success");
}

function addDiagnostics() {
    const messages = [
        "Проверка прав доступа: без критических ошибок",
        "Аудит ввода: найдены слабые места",
        "Фоновый анализ кода: готово",
        "Псевдологирование: активно",
        "Система уведомлений: в норме"
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];
    logConsole(`[DIAG] ${msg}`);
    showToast("Диагностика выполнена");
}

function toggleStrictMode() {
    strictMode = !strictMode;
    document.body.classList.toggle("strict", strictMode);
    ui.themeBtn.textContent = strictMode ? "Нормальный фон" : "Режим фокуса";
    logConsole(strictMode ? "Включён строгий режим" : "Отключён строгий режим");
    showToast(strictMode ? "Строгий режим включён" : "Фон смягчён");
}

ui.codeBlock.addEventListener("click", (event) => {
    const lineBtn = event.target.closest(".code-line[data-line]");
    if (!lineBtn || answered || currentTask().mode !== "line") return;

    ui.codeBlock.querySelectorAll(".code-line[data-line]").forEach(btn => btn.classList.remove("selected"));
    lineBtn.classList.add("selected");
    selectedLine = Number(lineBtn.dataset.line);
    ui.checkBtn.disabled = false;
});

ui.options.addEventListener("click", (event) => {
    const btn = event.target.closest(".answer-btn");
    if (!btn || answered) return;
    submitMcq(Number(btn.dataset.index));
});

ui.hintBtn1.addEventListener("click", () => showHint(1));
ui.hintBtn2.addEventListener("click", () => showHint(2));
ui.checkBtn.addEventListener("click", submitLineAnswer);
ui.nextBtn.addEventListener("click", nextTask);
ui.restartBtn.addEventListener("click", resetGame);
ui.againBtn.addEventListener("click", resetGame);
ui.scanBtn.addEventListener("click", addDiagnostics);
ui.themeBtn.addEventListener("click", toggleStrictMode);

timerId = setInterval(updateClock, 1000);
bgTimerId = setInterval(() => {
    const samples = [
        "log::security scan running",
        "log::pseudo build successful",
        "log::watching input validation",
        "log::admin permissions checked",
        "log::packet trace idle"
    ];
    addFeedLine(samples[Math.floor(Math.random() * samples.length)]);
}, 4200);

renderTabs();
deck = shuffle(allTasks).slice(0, 10);
renderTask();
updateClock();
logConsole("Система готова к проверке");