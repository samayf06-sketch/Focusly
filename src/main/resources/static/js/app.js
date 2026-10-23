/* Focusly - Smart Task & Deadline Manager (frontend)
 * Plain JavaScript. Talks to the Spring Boot REST API under /api with fetch() + async/await,
 * keeps all tasks in one array, and draws every page from that array. */
'use strict';

const API = ((window.APP_CONFIG && window.APP_CONFIG.apiBase) || '').replace(/\/+$/, '') + '/api';
const NATIVE = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
const BRAND = 'Focusly';
const MIN_PASSWORD = 8;
const TITLE = BRAND + ' - Smart Task & Deadline Manager';
const PAGES = ['dashboard', 'tasks', 'calendar', 'subjects', 'settings'];

const $ = (id) => document.getElementById(id);

/* ---------------- Icons (inline SVG, drawn in one stroke style) ---------------- */

const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/>',
    'check-square': '<path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    'plus-circle': '<circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    pencil: '<path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    alert: '<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    'check-circle': '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m22 4-10 10.01-3-3"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    'log-out': '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
};

function icon(name) {
    return `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;
}

/* ---------------- State ---------------- */

const els = {
    authScreen: $('authScreen'), appRoot: $('appRoot'), view: $('view'),
    authForm: $('authForm'), tabLogin: $('tabLogin'), tabRegister: $('tabRegister'),
    nameRow: $('nameRow'), aName: $('aName'), aEmail: $('aEmail'), aPassword: $('aPassword'),
    authError: $('authError'), authSubmit: $('authSubmit'), authHeading: $('authHeading'), authSub: $('authSub'),
    searchBox: $('searchBox'), loadingBar: $('loadingBar'),
    delDialog: $('deleteDialog'), delForm: $('deleteForm'), delPassword: $('delPassword'), delError: $('delError'),
    bellDot: $('bellDot'), bellMenu: $('bellMenu'), userMenu: $('userMenu'),
    avatar: $('avatar'), userName: $('userName'), ddName: $('ddName'), ddEmail: $('ddEmail'),
    dialog: $('taskDialog'), form: $('taskForm'), dialogTitle: $('dialogTitle'),
    cancel: $('cancelBtn'), error: $('formError'), subjectOptions: $('subjectOptions'),
    toast: $('toast'),
    f: {
        title: $('fTitle'), description: $('fDescription'), subject: $('fSubject'),
        dueDate: $('fDueDate'), priority: $('fPriority'), status: $('fStatus'),
        hours: $('fHours'), reminder: $('fReminder'),
    },
};

let token = null;
let user = null;
let tasks = [];                 // every task of the logged-in user, in "smart" order from the server
let hasLoaded = false;
let loadError = '';
let page = 'dashboard';
let search = '';
let dashFilter = 'all';         // all | pending | done   (My Tasks card on the dashboard)
let taskFilter = 'all';         // same, on the My Tasks page
let filters = { subject: '', sort: 'smart' };
let miniMonth = startOfMonth(new Date());
let calMonth = startOfMonth(new Date());
let selectedDay = isoToday();
let editingId = null;
let refreshTimer = null;

/* Browser storage can be blocked, so every access is wrapped. */
const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } },
    del(k) { try { localStorage.removeItem(k); } catch (e) { /* ignore */ } },
};

/* ---------------- API helper ---------------- */

async function api(path, options = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = 'Bearer ' + token;

    let res;
    try {
        res = await fetch(API + path, { ...options, headers });
    } catch (e) {
        throw new Error('Cannot reach the server. Check that the app is running, then try again.');
    }

    if (res.status === 204) return null;
    let data = null;
    try { data = await res.json(); } catch (e) { /* no body */ }

    if (res.status === 401 && !path.startsWith('/auth/login') && !path.startsWith('/auth/register')) {
        forceLogout('Your session expired. Please log in again.');
        throw new Error('Please log in');
    }
    if (!res.ok) {
        const fieldMsg = data && data.fields ? Object.values(data.fields)[0] : null;
        throw new Error(fieldMsg || (data && data.message) || 'Request failed');
    }
    return data;
}

/* ---------------- Small helpers ---------------- */

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function highlight(text, term) {
    const safe = esc(text);
    if (!term) return safe;
    return safe.replace(new RegExp('(' + escRe(esc(term)) + ')', 'gi'), '<mark>$1</mark>');
}

function toast(msg, isError = false) {
    els.toast.textContent = msg;
    els.toast.classList.toggle('error', isError);
    els.toast.classList.remove('hidden');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => els.toast.classList.add('hidden'), 3200);
}

function ymd(y, m, d) { return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`; }
function isoToday() { const d = new Date(); return ymd(d.getFullYear(), d.getMonth(), d.getDate()); }
function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function parseIso(iso) { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); }
function fmtDate(iso) {
    return parseIso(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}
function dueText(t) {
    if (t.status === 'DONE') return 'Completed';
    if (t.overdue) { const d = Math.abs(t.daysLeft); return `Overdue by ${d} day${d === 1 ? '' : 's'}`; }
    if (t.daysLeft === 0) return 'Due today';
    if (t.daysLeft === 1) return 'Due tomorrow';
    return `Due in ${t.daysLeft} days`;
}
function initials(name) {
    const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    return ((parts[0] || '?')[0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

const PRIORITY_LABEL = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' };
const PRIORITY_RANK = { HIGH: 3, MEDIUM: 2, LOW: 1 };
const PALETTE = ['#25a56f', '#5b5be6', '#f5a524', '#e5484d', '#3b78f0', '#a855f7', '#14b8a6', '#ec4899'];

/* A subject always gets the same colour, picked from its name. */
function subjColor(name) {
    let h = 0;
    for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    return PALETTE[h % PALETTE.length];
}

/* ---------------- Derived data ---------------- */

const isDone = (t) => t.status === 'DONE';
const subjOf = (t) => (t.subject && t.subject.trim()) || 'General';

function counts() {
    const total = tasks.length;
    const done = tasks.filter(isDone).length;
    const overdue = tasks.filter((t) => t.overdue).length;
    return { total, done, overdue, pending: total - done - overdue };
}

function matchesSearch(t) {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return [t.title, t.description, subjOf(t)].some((v) => (v || '').toLowerCase().includes(term));
}

function byTab(list, tab) {
    if (tab === 'pending') return list.filter((t) => !isDone(t));
    if (tab === 'done') return list.filter(isDone);
    return list;
}

function sortTasks(list, mode) {
    const a = [...list];
    let cmp = null;
    if (mode === 'due') cmp = (x, y) => x.dueDate.localeCompare(y.dueDate);
    else if (mode === 'priority') cmp = (x, y) => PRIORITY_RANK[y.priority] - PRIORITY_RANK[x.priority] || x.dueDate.localeCompare(y.dueDate);
    else if (mode === 'title') cmp = (x, y) => x.title.localeCompare(y.title, undefined, { sensitivity: 'base' });
    if (!cmp) return a;                                  // "smart": keep the server's order
    return a.sort((x, y) => (isDone(x) - isDone(y)) || cmp(x, y));
}

function subjectStats() {
    const map = new Map();
    tasks.forEach((t) => {
        const key = subjOf(t);
        const s = map.get(key) || { name: key, total: 0, done: 0 };
        s.total++;
        if (isDone(t)) s.done++;
        map.set(key, s);
    });
    return [...map.values()].sort((a, b) => b.total - a.total || a.name.localeCompare(b.name));
}

function groupByDate(list) {
    const map = new Map();
    list.forEach((t) => {
        if (!map.has(t.dueDate)) map.set(t.dueDate, []);
        map.get(t.dueDate).push(t);
    });
    return map;
}

const reminderList = () => tasks
    .filter((t) => !isDone(t) && (t.overdue || t.reminderDue))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

const topTaskId = () => { const t = tasks.find((x) => !isDone(x)); return t ? t.id : null; };

/* ================= AUTH ================= */

let authMode = 'login';

function setAuthMode(mode) {
    authMode = mode;
    const reg = mode === 'register';
    els.tabLogin.classList.toggle('active', !reg);
    els.tabRegister.classList.toggle('active', reg);
    els.nameRow.classList.toggle('hidden', !reg);
    els.authSubmit.textContent = reg ? 'Create account' : 'Log in';
    els.authHeading.textContent = reg ? 'Create your account' : 'Welcome back';
    els.authSub.textContent = reg ? 'Start organizing your deadlines.' : 'Log in to see your tasks.';
    els.aPassword.autocomplete = reg ? 'new-password' : 'current-password';
    els.aPassword.placeholder = reg ? `At least ${MIN_PASSWORD} characters` : 'Your password';
    els.authError.classList.add('hidden');
}

function showAuthError(msg) {
    els.authError.textContent = msg;
    els.authError.classList.remove('hidden');
}

async function submitAuth(email, password, name) {
    els.authSubmit.disabled = true;
    const label = els.authSubmit.textContent;
    els.authSubmit.textContent = 'Please wait...';
    try {
        const body = authMode === 'register' ? { name, email, password } : { email, password };
        const session = await api(authMode === 'register' ? '/auth/register' : '/auth/login',
            { method: 'POST', body: JSON.stringify(body) });
        token = session.token;
        user = session.user;
        store.set('stm_token', token);
        els.aPassword.value = '';
        showApp();
    } catch (e) {
        showAuthError(e.message);
    } finally {
        els.authSubmit.disabled = false;
        els.authSubmit.textContent = label;
    }
}

els.authForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const email = els.aEmail.value.trim();
    const password = els.aPassword.value;
    const name = els.aName.value.trim();
    if (authMode === 'register' && !name) return showAuthError('Please enter your name.');
    if (!email) return showAuthError('Please enter your email.');
    if (!password) return showAuthError('Please enter your password.');
    if (authMode === 'register' && password.length < MIN_PASSWORD) {
        return showAuthError(`Your password must be at least ${MIN_PASSWORD} characters.`);
    }
    submitAuth(email, password, name);
});
els.tabLogin.addEventListener('click', () => setAuthMode('login'));
els.tabRegister.addEventListener('click', () => setAuthMode('register'));

function showAuthScreen() {
    clearInterval(refreshTimer);
    els.appRoot.classList.add('hidden');
    document.getElementById('tabbar').classList.add('hidden');
    els.authScreen.classList.remove('hidden');
    document.title = TITLE;
    els.aEmail.focus();
}

function forceLogout(message) {
    token = null;
    user = null;
    tasks = [];
    hasLoaded = false;
    loadError = '';
    search = '';
    els.searchBox.value = '';
    store.del('stm_token');
    if (els.dialog.open) els.dialog.close();
    closeMenus();
    closeNav();
    try { history.replaceState(null, '', location.pathname); } catch (e) { /* ignore */ }
    showAuthScreen();
    if (message) showAuthError(message);
}

async function logout() {
    try { await api('/auth/logout', { method: 'POST' }); } catch (e) { /* already logged out */ }
    forceLogout();
    els.authError.classList.add('hidden');
}

function showApp() {
    els.authScreen.classList.add('hidden');
    els.appRoot.classList.remove('hidden');
    document.getElementById('tabbar').classList.remove('hidden');
    selectedDay = isoToday();
    miniMonth = calMonth = startOfMonth(new Date());
    dashFilter = taskFilter = 'all';
    filters = { subject: '', sort: 'smart' };
    renderChrome();
    renderPage();
    loadTasks();
    clearInterval(refreshTimer);
    refreshTimer = setInterval(loadTasks, 5 * 60 * 1000);   // keep "days left" and reminders fresh
}

/* ================= ROUTING ================= */

function currentPage() {
    const h = location.hash.replace(/^#\/?/, '');
    return PAGES.includes(h) ? h : 'dashboard';
}

function go(p) {
    closeMenus();
    closeNav();
    if (location.hash === '#/' + p) renderPage();
    else location.hash = '#/' + p;
}

window.addEventListener('hashchange', () => {
    if (!token) return;
    renderPage();
    window.scrollTo(0, 0);
});

/* ================= LOADING DATA ================= */

function setLoading(on) {
    els.loadingBar.classList.toggle('hidden', !on);
    els.view.setAttribute('aria-busy', on ? 'true' : 'false');
}

async function loadTasks() {
    if (!token) return;
    setLoading(true);
    try {
        tasks = await api('/tasks?sort=smart');
        hasLoaded = true;
        loadError = '';
    } catch (e) {
        if (!token) return;                       // logged out while loading
        loadError = e.message;
        if (hasLoaded) toast(e.message, true);    // keep showing the old data, just warn
    } finally {
        setLoading(false);
    }
    if (!token) return;
    renderChrome();
    renderPage();
    alarmTick();
    scheduleNativeReminders();
    maybeAskPermission();
}

/* ================= RENDERING: shared pieces ================= */

/** Top bar, bell, user menu, tab title and the subject suggestions for the form. */
function renderChrome() {
    if (!user) return;
    els.avatar.textContent = initials(user.name);
    els.userName.textContent = user.name;
    els.ddName.textContent = user.name;
    els.ddEmail.textContent = user.email;

    const reminders = reminderList();
    els.bellDot.classList.toggle('hidden', reminders.length === 0);
    document.title = (reminders.length ? `(${reminders.length}) ` : '') + TITLE;
    renderBell(reminders);

    const subjects = [...new Set(tasks.map((t) => (t.subject || '').trim()).filter(Boolean))].sort();
    els.subjectOptions.innerHTML = subjects.map((s) => `<option value="${esc(s)}">`).join('');
}

function renderBell(reminders) {
    const rows = reminders.slice(0, 6).map((t) => `
        <div class="dd-row" data-action="edit" data-id="${t.id}">
            <i class="${t.overdue ? 'red' : ''}"></i>
            <div><b>${esc(t.title)}</b><small>${dueText(t)} &middot; ${esc(subjOf(t))}</small></div>
        </div>`).join('');
    const more = reminders.length > 6 ? `<div class="dd-empty">and ${reminders.length - 6} more</div>` : '';
    els.bellMenu.innerHTML = `<div class="dd-title">Reminders</div>` +
        (reminders.length ? rows + more : '<div class="dd-empty">You are all caught up. Nothing is due soon.</div>');
}

function taskRow(t, topId) {
    const term = search.trim();
    let sc = 's-pending', sl = 'Pending';
    if (isDone(t)) { sc = 's-done'; sl = 'Completed'; }
    else if (t.overdue) { sc = 's-overdue'; sl = 'Overdue'; }
    else if (t.status === 'IN_PROGRESS') { sc = 's-progress'; sl = 'In progress'; }

    return `
    <article class="trow ${t.status}" data-id="${t.id}">
        <input type="checkbox" ${isDone(t) ? 'checked' : ''} data-action="toggle" aria-label="Mark ${esc(t.title)} as done">
        <div class="tmain" title="${esc(t.description || '')}">
            <div class="ttitle"><span>${highlight(t.title, term)}</span>${t.id === topId ? '<span class="first-tag">Do first</span>' : ''}</div>
            <div class="tsub">${icon('book')}<span>${highlight(subjOf(t), term)} &middot; ${t.estimatedHours}h</span></div>
        </div>
        <div class="tmeta">
            <span class="tdue ${t.overdue ? 'late' : ''}">${icon('calendar')}${fmtDate(t.dueDate)}</span>
            <span class="pill ${sc}">${sl}</span>
            <span class="pill p-${t.priority.toLowerCase()}">${PRIORITY_LABEL[t.priority]}</span>
        </div>
        <div class="tact">
            ${t.status === 'TODO' ? `<button type="button" data-action="start" title="Start" aria-label="Start ${esc(t.title)}">${icon('play')}</button>` : ''}
            <button type="button" data-action="edit" title="Edit" aria-label="Edit ${esc(t.title)}">${icon('pencil')}</button>
            <button type="button" data-action="delete" title="Delete" aria-label="Delete ${esc(t.title)}">${icon('trash')}</button>
        </div>
    </article>`;
}

function emptyState(filtered) {
    if (filtered) return '<div class="empty">No tasks match your search or filters.</div>';
    return `<div class="empty">You have no tasks yet.
        <div class="empty-actions">
            <button type="button" class="btn primary" data-action="new">${icon('plus')} New task</button>
            <button type="button" class="btn" data-action="samples">Add sample tasks</button>
        </div></div>`;
}

function tabsHtml(action, current) {
    const tab = (v, label) => `<button type="button" class="${current === v ? 'active' : ''}" data-action="${action}" data-value="${v}">${label}</button>`;
    return `<div class="tabs" role="tablist">${tab('all', 'All')}${tab('pending', 'Pending')}${tab('done', 'Completed')}</div>`;
}

/* ================= PAGE: Dashboard ================= */

function renderDashboard() {
    const c = counts();
    const now = new Date();
    const h = now.getHours();
    const greeting = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
    const first = (user.name || '').trim().split(/\s+/)[0] || 'there';

    return `
    <div class="dash">
        <div class="dash-main">
            <div class="greet">
                <div class="greet-l">
                    <span class="sun">${icon(h < 18 ? 'sun' : 'moon')}</span>
                    <div>
                        <h1>${greeting}, ${esc(first)}!</h1>
                        <p>Stay organized. Meet your deadlines. Achieve your goals.</p>
                    </div>
                </div>
                <div class="greet-r">${icon('calendar')}<div>${now.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}<br>${now.toLocaleDateString(undefined, { weekday: 'long' })}</div></div>
            </div>

            <section class="stats" aria-label="Task summary">
                <div class="stat blue"><span class="badge">${icon('list')}</span><div class="num">${c.total}</div><div class="lbl">Total Tasks</div></div>
                <div class="stat green"><span class="badge">${icon('check')}</span><div class="num">${c.done}</div><div class="lbl">Completed</div></div>
                <div class="stat amber"><span class="badge">${icon('clock')}</span><div class="num">${c.pending}</div><div class="lbl">Pending</div></div>
                <div class="stat red"><span class="badge">${icon('alert')}</span><div class="num">${c.overdue}</div><div class="lbl">Overdue</div></div>
            </section>

            ${dashTasksCard()}

            <div class="pair">
                ${completionCard(c)}
                <section class="card">
                    <div class="card-title">${icon('zap')} Quick Actions</div>
                    <div class="qa">
                        <button type="button" class="btn primary" data-action="new">${icon('plus')} Add New Task</button>
                        <button type="button" class="btn" data-action="nav" data-page="calendar">${icon('calendar')} View Calendar</button>
                        <button type="button" class="btn" data-action="nav" data-page="subjects">${icon('book')} Manage Subjects</button>
                    </div>
                </section>
            </div>
        </div>

        <aside class="dash-side">
            ${miniCalendarCard()}
            ${upcomingCard()}
            ${subjectsCard()}
        </aside>
    </div>`;
}

function dashTasksCard() {
    const searching = search.trim() !== '';
    const all = tasks.filter(matchesSearch);
    const list = byTab(all, dashFilter);
    const shown = list.slice(0, 6);
    const topId = topTaskId();
    return `
    <section class="card">
        <div class="card-head">
            <div class="card-title">${icon('list')} My Tasks</div>
            ${tabsHtml('dash-filter', dashFilter)}
        </div>
        <div class="tlist">
            ${shown.length ? shown.map((t) => taskRow(t, topId)).join('') : emptyState(searching || tasks.length > 0)}
        </div>
        ${list.length > shown.length ? `<div class="card-foot"><button type="button" class="link" data-action="nav" data-page="tasks">View all ${list.length} tasks</button></div>` : ''}
    </section>`;
}

function donutSvg(c) {
    const R = 42;
    const C = 2 * Math.PI * R;
    let offset = 0;
    const segs = [[c.done, '#25a56f'], [c.pending, '#3b78f0'], [c.overdue, '#e5484d']];
    const arcs = c.total ? segs.filter((s) => s[0] > 0).map(([n, col]) => {
        const len = C * n / c.total;
        const out = `<circle cx="60" cy="60" r="${R}" fill="none" stroke="${col}" stroke-width="14" stroke-dasharray="${len.toFixed(2)} ${(C - len).toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}"/>`;
        offset += len;
        return out;
    }).join('') : '';
    return `<svg viewBox="0 0 120 120" role="img" aria-label="Task completion chart"><circle cx="60" cy="60" r="${R}" fill="none" stroke="#eceefa" stroke-width="14"/>${arcs}</svg>`;
}

function completionCard(c) {
    const pct = c.total ? Math.round(c.done * 100 / c.total) : 0;
    return `
    <section class="card">
        <div class="card-title">Task Completion</div>
        <div class="donut-wrap">
            <div class="donut">${donutSvg(c)}<b>${pct}%</b></div>
            <div class="legend">
                <div><i style="background:#25a56f"></i>Completed<span>${c.done}</span></div>
                <div><i style="background:#3b78f0"></i>Pending<span>${c.pending}</span></div>
                <div><i style="background:#e5484d"></i>Overdue<span>${c.overdue}</span></div>
                <small class="muted">${c.total} total task${c.total === 1 ? '' : 's'}</small>
            </div>
        </div>
    </section>`;
}

function miniCalendarCard() {
    const y = miniMonth.getFullYear();
    const m = miniMonth.getMonth();
    const first = new Date(y, m, 1).getDay();
    const dim = new Date(y, m + 1, 0).getDate();
    const prevDim = new Date(y, m, 0).getDate();
    const cells = Math.ceil((first + dim) / 7) * 7;
    const byDate = groupByDate(tasks);
    const today = isoToday();

    let html = '';
    for (let i = 0; i < cells; i++) {
        const day = i - first + 1;
        let label, iso, out = false;
        if (day < 1) { label = prevDim + day; iso = ymd(m === 0 ? y - 1 : y, (m + 11) % 12, label); out = true; }
        else if (day > dim) { label = day - dim; iso = ymd(m === 11 ? y + 1 : y, (m + 1) % 12, label); out = true; }
        else { label = day; iso = ymd(y, m, day); }

        const items = byDate.get(iso) || [];
        const cls = ['md'];
        if (out) cls.push('out');
        if (iso === today) cls.push('today');
        if (items.length && items.every(isDone)) cls.push('has-done');
        else if (items.some((t) => !isDone(t) && t.overdue)) cls.push('has-late');
        else if (items.some((t) => !isDone(t))) cls.push('has-open');
        html += `<button type="button" class="${cls.join(' ')}" data-action="mini-day" data-date="${iso}" aria-label="${fmtDate(iso)}, ${items.length} task${items.length === 1 ? '' : 's'}">${label}</button>`;
    }

    return `
    <section class="card">
        <div class="cal-head">
            <h3>${miniMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h3>
            <div class="arrows">
                <button type="button" data-action="mini-prev" aria-label="Previous month">${icon('chevron-left')}</button>
                <button type="button" data-action="mini-next" aria-label="Next month">${icon('chevron-right')}</button>
            </div>
        </div>
        <div class="mini-week"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>
        <div class="mini-grid">${html}</div>
    </section>`;
}

function upcomingCard() {
    const list = tasks.filter((t) => !isDone(t))
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate) || b.score - a.score)
        .slice(0, 4);
    const rows = list.map((t) => `
        <div class="up pr-${t.priority}" data-action="edit" data-id="${t.id}" role="button" tabindex="0">
            <b>${fmtDate(t.dueDate)}</b>
            <span>${esc(t.title)}</span>
            <span class="pill p-${t.priority.toLowerCase()}">${PRIORITY_LABEL[t.priority]}</span>
        </div>`).join('');
    return `
    <section class="card">
        <div class="card-title">${icon('clock')} Upcoming Deadlines</div>
        <div class="up-list">${rows || '<div class="empty">No upcoming deadlines.</div>'}</div>
    </section>`;
}

function subjectsCard() {
    const list = subjectStats().slice(0, 5);
    const rows = list.map((s) => `
        <div class="subj-row"><i style="background:${subjColor(s.name)}"></i>${esc(s.name)}<small>${s.total} task${s.total === 1 ? '' : 's'}</small></div>`).join('');
    return `
    <section class="card">
        <div class="card-head">
            <div class="card-title">${icon('book')} Your Subjects</div>
            <button type="button" class="link" data-action="nav" data-page="subjects">Manage</button>
        </div>
        <div class="subj-list">${rows || '<div class="muted">Subjects appear when you add tasks.</div>'}</div>
    </section>`;
}

/* ================= PAGE: My Tasks ================= */

function renderTasksPage() {
    const filtered = filters.subject !== '' || taskFilter !== 'all' || search.trim() !== '';
    let list = tasks.filter(matchesSearch);
    list = byTab(list, taskFilter);
    if (filters.subject) list = list.filter((t) => subjOf(t) === filters.subject);
    list = sortTasks(list, filters.sort);

    const subjects = subjectStats().map((s) => s.name);
    if (filters.subject && !subjects.includes(filters.subject)) filters.subject = '';
    const topId = topTaskId();

    const counter = filtered
        ? `Showing ${list.length} of ${tasks.length} task${tasks.length === 1 ? '' : 's'}`
        : `${tasks.length} task${tasks.length === 1 ? '' : 's'}`;

    return `
    <div class="page-head">
        <div><h1>My Tasks</h1><p class="muted count" aria-live="polite">${counter}</p></div>
        <button type="button" class="btn primary" data-action="new">${icon('plus')} New task</button>
    </div>
    <section class="card">
        <div class="card-head">
            ${tabsHtml('task-filter', taskFilter)}
            <div class="filters">
                <select id="subjectFilter" aria-label="Filter by subject">
                    <option value="">All subjects</option>
                    ${subjects.map((s) => `<option value="${esc(s)}" ${s === filters.subject ? 'selected' : ''}>${esc(s)}</option>`).join('')}
                </select>
                <select id="sortFilter" aria-label="Sort tasks">
                    ${[['smart', 'Smart order'], ['due', 'Due date'], ['priority', 'Priority'], ['title', 'Title']]
                        .map(([v, l]) => `<option value="${v}" ${v === filters.sort ? 'selected' : ''}>${l}</option>`).join('')}
                </select>
                ${filtered ? '<button type="button" class="btn small" data-action="clear-filters">Clear</button>' : ''}
            </div>
        </div>
        <div class="tlist">
            ${list.length ? list.map((t) => taskRow(t, topId)).join('') : emptyState(filtered || tasks.length > 0)}
        </div>
    </section>`;
}

/* ================= PAGE: Calendar ================= */

function renderCalendarPage() {
    const y = calMonth.getFullYear();
    const m = calMonth.getMonth();
    const byDate = groupByDate(tasks);
    const offset = new Date(y, m, 1).getDay();
    const dim = new Date(y, m + 1, 0).getDate();
    const cells = Math.ceil((offset + dim) / 7) * 7;
    const today = isoToday();

    let grid = '';
    for (let i = 0; i < cells; i++) {
        const day = i - offset + 1;
        if (day < 1 || day > dim) { grid += '<div class="cal-cell empty" aria-hidden="true"></div>'; continue; }
        const iso = ymd(y, m, day);
        const items = byDate.get(iso) || [];
        const chips = items.slice(0, 2).map((t) => `<span class="cal-chip ${t.urgency}" title="${esc(t.title)}">${esc(t.title)}</span>`).join('');
        const more = items.length > 2 ? `<span class="cal-more">+${items.length - 2} more</span>` : '';
        const cls = ['cal-cell', iso === today ? 'today' : '', iso === selectedDay ? 'selected' : ''].join(' ');
        grid += `<button type="button" class="${cls}" data-action="day-select" data-date="${iso}" aria-label="${fmtDate(iso)}, ${items.length} task${items.length === 1 ? '' : 's'}"><span class="cal-num">${day}</span>${chips}${more}</button>`;
    }

    const dayTasks = (byDate.get(selectedDay) || []).filter(matchesSearch);
    const topId = topTaskId();
    return `
    <div class="page-head">
        <div><h1>Calendar</h1><p class="muted">Every deadline in one place. Click a day to see or add its tasks.</p></div>
        <button type="button" class="btn primary" data-action="new">${icon('plus')} New task</button>
    </div>
    <section class="card">
        <div class="cal-head">
            <h3>${calMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</h3>
            <div class="arrows">
                <button type="button" data-action="cal-prev" aria-label="Previous month">${icon('chevron-left')}</button>
                <button type="button" class="btn small" data-action="cal-today">Today</button>
                <button type="button" data-action="cal-next" aria-label="Next month">${icon('chevron-right')}</button>
            </div>
        </div>
        <div class="big-week"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>
        <div class="big-grid">${grid}</div>
        <div class="day-detail">
            <div class="card-head">
                <div class="card-title">${fmtDate(selectedDay)}${selectedDay === today ? ' (today)' : ''}</div>
                <button type="button" class="btn small primary" data-action="new-on-day">${icon('plus')} Add task on this day</button>
            </div>
            <div class="tlist">${dayTasks.length ? dayTasks.map((t) => taskRow(t, topId)).join('') : '<div class="empty">Nothing due on this day.</div>'}</div>
        </div>
    </section>`;
}

/* ================= PAGE: Subjects ================= */

function renderSubjectsPage() {
    const term = search.trim().toLowerCase();
    const list = subjectStats().filter((s) => !term || s.name.toLowerCase().includes(term));
    const cards = list.map((s) => {
        const col = subjColor(s.name);
        const pct = s.total ? Math.round(s.done * 100 / s.total) : 0;
        return `
        <section class="card subj-card">
            <h3><i style="background:${col}"></i>${esc(s.name)}</h3>
            <div class="muted">${s.total} task${s.total === 1 ? '' : 's'} &middot; ${s.total - s.done} open &middot; ${s.done} done</div>
            <div class="bar" role="img" aria-label="${pct}% complete"><span style="width:${pct}%;background:${col}"></span></div>
            <div class="actions">
                <button type="button" class="btn small" data-action="subject-view" data-subject="${esc(s.name)}">View tasks</button>
                <button type="button" class="btn small" data-action="subject-add" data-subject="${esc(s.name === 'General' ? '' : s.name)}">${icon('plus')} Add task</button>
            </div>
        </section>`;
    }).join('');

    return `
    <div class="page-head">
        <div><h1>Subjects</h1><p class="muted">Subjects come from your tasks. Type a new subject name when you add a task.</p></div>
        <button type="button" class="btn primary" data-action="new">${icon('plus')} New task</button>
    </div>
    ${cards ? `<div class="subj-grid">${cards}</div>` : `<section class="card">${emptyState(tasks.length > 0)}</section>`}`;
}

/* ================= PAGE: Settings ================= */

const IS_IOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
const IS_STANDALONE = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || window.navigator.standalone === true;
const notifySupported = 'Notification' in window && window.isSecureContext;
const notifyEnabled = () => notifySupported && Notification.permission === 'granted';

/* The reminders are a built-in, automatic feature: two fixed times every day.
 * They cannot be changed or switched off, so a student is always reminded to do the work. */
const REMINDER_SLOTS = [
    { h: 9,  m: 0, label: '9:00 AM' },
    { h: 20, m: 0, label: '8:00 PM' },
];

function renderSettingsPage() {
    let popStatus, popBtn = '';
    if (!notifySupported) popStatus = !window.isSecureContext ? 'Needs https or localhost' : (IS_IOS && !IS_STANDALONE ? 'Add Focusly to your Home Screen first' : 'Not supported by this browser');
    else if (Notification.permission === 'granted') popStatus = 'Allowed';
    else if (Notification.permission === 'denied') { popStatus = 'Blocked in browser'; popBtn = 'How to unblock'; }
    else { popStatus = 'Not allowed yet'; popBtn = 'Allow pop-ups'; }

    return `
    <div class="page-head"><div><h1>Settings</h1><p class="muted">Account and reminders.</p></div></div>
    <div class="settings">
        <section class="card">
            <h3>Account</h3>
            <p class="muted">${esc(user.name)} (${esc(user.email)})</p>
            <div class="setting-row"><span class="muted">Signed in on this device</span>
                <button type="button" class="btn small" data-action="logout">${icon('log-out')} Log out</button></div>
        </section>
        <section class="card">
            <h3>Automatic reminders</h3>
            <p class="muted">Focusly reminds you every day at the two times below about every assignment due within 24 hours and everything overdue. When nothing is urgent it nudges you to start your top task. This is built in, so the times are fixed and the reminders cannot be turned off.</p>
            <div class="setting-row">
                <span><span class="chip on">${REMINDER_SLOTS[0].label}</span> <span class="chip on">${REMINDER_SLOTS[1].label}</span></span>
                <span class="chip on">Always on</span>
            </div>
            <div class="setting-row">
                <span class="chip ${notifyEnabled() ? 'on' : ''}">Pop-ups: ${popStatus}</span>
                ${popBtn ? `<button type="button" class="btn small" data-action="notify-toggle">${popBtn}</button>` : ''}
            </div>
            <p class="muted small-print">${NATIVE ? 'In the phone app the alarms ring even when the app is closed.' : 'On the website the alarm rings while this page is open in a browser tab. The phone app rings even when closed.'} Your browser decides whether pop-up notifications are allowed; the on-screen alarm with sound always works.</p>
            ${IS_IOS && !IS_STANDALONE ? '<p class="muted small-print"><b>iPhone:</b> tap the Share button, choose <b>Add to Home Screen</b>, then open Focusly from your Home Screen and tap <b>Allow pop-ups</b> here.</p>' : ''}
            ${(!IS_IOS && /android/i.test(navigator.userAgent)) ? '<p class="muted small-print"><b>Android:</b> pop-ups appear when this page is open or in the background. For alarms when the app is closed, install the Focusly app.</p>' : ''}
            <div class="setting-row">
                <span class="muted">See what a reminder looks like:</span>
                <button type="button" class="btn small primary" data-action="alarm-test">Preview reminder</button>
            </div>
        </section>
        <section class="card">
            <h3>Privacy &amp; data</h3>
            <p class="muted">Your tasks are private to your account. Read how your data is handled, or delete your account and everything in it.</p>
            <div class="setting-row">
                <a class="btn small" href="privacy.html" target="_blank" rel="noopener">Privacy policy</a>
                <button type="button" class="btn small danger" data-action="delete-account">Delete my account</button>
            </div>
        </section>
    </div>`;
}

/* ================= Page switch ================= */

function renderPage() {
    if (!user) return;
    page = currentPage();
    document.querySelectorAll('.nav-item[data-page], .tab[data-page]').forEach((b) => b.classList.toggle('active', b.dataset.page === page));

    if (!hasLoaded && page !== 'settings') {
        els.view.innerHTML = loadError
            ? `<div class="error-box"><span>Could not load your tasks: ${esc(loadError)}</span>
                <button type="button" class="btn small" data-action="retry">Try again</button></div>`
            : '<div class="card empty">Loading your tasks...</div>';
        return;
    }
    const render = {
        dashboard: renderDashboard, tasks: renderTasksPage, calendar: renderCalendarPage,
        subjects: renderSubjectsPage, settings: renderSettingsPage,
    }[page];
    els.view.innerHTML = render();
}

/* ================= TASK DIALOG ================= */

function openDialog(task, preset = {}) {
    closeMenus();
    editingId = task ? task.id : null;
    els.dialogTitle.textContent = task ? 'Edit task' : 'New task';
    els.error.classList.add('hidden');
    els.f.title.value = task ? task.title : '';
    els.f.description.value = task ? task.description || '' : '';
    els.f.subject.value = task ? task.subject || '' : (preset.subject || '');
    els.f.dueDate.value = task ? task.dueDate : (preset.date || isoToday());
    els.f.priority.value = task ? task.priority : 'MEDIUM';
    els.f.status.value = task ? task.status : 'TODO';
    els.f.hours.value = task ? task.estimatedHours : 1;
    els.f.reminder.value = task ? task.reminderDays : 1;
    els.dialog.showModal();
    els.f.title.focus();
}

function showFormError(msg) {
    els.error.textContent = msg;
    els.error.classList.remove('hidden');
}

els.form.addEventListener('submit', async (ev) => {
    ev.preventDefault();

    const title = els.f.title.value.trim();
    if (!title) return showFormError('Please enter a title.');
    if (!els.f.dueDate.value) return showFormError('Please choose a due date.');
    const hours = parseFloat(els.f.hours.value);
    if (!(hours > 0)) return showFormError('Estimated hours must be greater than 0.');

    const payload = {
        title,
        description: els.f.description.value.trim(),
        subject: els.f.subject.value.trim(),
        dueDate: els.f.dueDate.value,
        priority: els.f.priority.value,
        status: els.f.status.value,
        estimatedHours: hours,
        reminderDays: parseInt(els.f.reminder.value || '1', 10),
    };

    const saveBtn = $('saveBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    try {
        if (editingId) {
            await api(`/tasks/${editingId}`, { method: 'PUT', body: JSON.stringify(payload) });
            toast('Task updated');
        } else {
            await api('/tasks', { method: 'POST', body: JSON.stringify(payload) });
            toast('Task added');
        }
        els.dialog.close();
        await loadTasks();
    } catch (e) {
        showFormError(e.message);
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save task';
    }
});
els.cancel.addEventListener('click', () => els.dialog.close());

/* ================= MENUS & DRAWER ================= */

function closeMenus() {
    els.bellMenu.classList.add('hidden');
    els.userMenu.classList.add('hidden');
}
function closeNav() { document.body.classList.remove('nav-open'); }

document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') { closeMenus(); closeNav(); }
    if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.classList && ev.target.classList.contains('up')) {
        ev.preventDefault();
        ev.target.click();
    }
});

els.searchBox.addEventListener('input', () => {
    search = els.searchBox.value;
    if (!['dashboard', 'tasks', 'subjects'].includes(page)) go('tasks');
    else renderPage();
});

/* ================= CLICKS (one handler for the whole page) ================= */

document.addEventListener('click', async (ev) => {
    if (!ev.target.closest('.menu-wrap')) closeMenus();
    const el = ev.target.closest('[data-action]');
    if (!el) return;

    const action = el.dataset.action;
    const holder = el.closest('[data-id]');
    const id = holder ? Number(holder.dataset.id) : null;
    const task = id !== null ? tasks.find((t) => t.id === id) : null;

    try {
        switch (action) {
            case 'nav':
                if (el.dataset.page === 'tasks') {      // a fresh My Tasks view (or carry over the dashboard tab)
                    taskFilter = (el.classList.contains('nav-item') || el.classList.contains('tab')) ? 'all' : dashFilter;
                    filters.subject = '';
                }
                go(el.dataset.page);
                break;
            case 'new': closeNav(); openDialog(null); break;
            case 'new-on-day': openDialog(null, { date: selectedDay }); break;
            case 'open-nav': document.body.classList.add('nav-open'); break;
            case 'close-nav': closeNav(); break;
            case 'logout': await logout(); break;
            case 'retry': await loadTasks(); break;

            case 'toggle-menu': {
                const menu = $(el.dataset.menu);
                const wasHidden = menu.classList.contains('hidden');
                closeMenus();
                if (wasHidden) menu.classList.remove('hidden');
                break;
            }

            case 'samples':
                el.disabled = true;
                await api('/tasks/samples', { method: 'POST' });
                toast('Sample tasks added. Edit or delete them any time.');
                await loadTasks();
                break;

            case 'toggle': {
                if (!task) break;
                const status = el.checked ? 'DONE' : 'TODO';
                await api(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
                toast(el.checked ? 'Nice work! Task completed' : 'Task reopened');
                await loadTasks();
                break;
            }
            case 'start':
                if (!task) break;
                await api(`/tasks/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'IN_PROGRESS' }) });
                await loadTasks();
                break;
            case 'edit': if (task) openDialog(task); break;
            case 'delete':
                if (task && confirm(`Delete "${task.title}"?`)) {
                    await api(`/tasks/${id}`, { method: 'DELETE' });
                    toast('Task deleted');
                    await loadTasks();
                }
                break;

            case 'dash-filter': dashFilter = el.dataset.value; renderPage(); break;
            case 'task-filter': taskFilter = el.dataset.value; renderPage(); break;
            case 'clear-filters':
                search = ''; els.searchBox.value = '';
                taskFilter = 'all'; filters = { subject: '', sort: filters.sort };
                renderPage();
                break;

            case 'mini-prev': miniMonth = new Date(miniMonth.getFullYear(), miniMonth.getMonth() - 1, 1); renderPage(); break;
            case 'mini-next': miniMonth = new Date(miniMonth.getFullYear(), miniMonth.getMonth() + 1, 1); renderPage(); break;
            case 'mini-day':
                selectedDay = el.dataset.date;
                calMonth = startOfMonth(parseIso(selectedDay));
                go('calendar');
                break;

            case 'cal-prev': calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1); renderPage(); break;
            case 'cal-next': calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1); renderPage(); break;
            case 'cal-today': calMonth = startOfMonth(new Date()); selectedDay = isoToday(); renderPage(); break;
            case 'day-select': selectedDay = el.dataset.date; renderPage(); break;

            case 'subject-view':
                filters.subject = el.dataset.subject;
                taskFilter = 'all';
                go('tasks');
                break;
            case 'subject-add': openDialog(null, { subject: el.dataset.subject }); break;

            case 'notify-toggle': await toggleNotifications(); break;
            case 'delete-account': openDeleteDialog(); break;
            case 'delete-cancel': els.delDialog.close(); break;
            case 'alarm-test': alertUser('Preview: reminder', 'Submit Math Assignment - due tomorrow\nThis is how your 9:00 AM and 8:00 PM reminders look and sound.'); break;
            case 'alarm-snooze': snoozeAlarm(); break;
            case 'alarm-dismiss': document.getElementById('alarmBanner').classList.add('hidden'); break;
            default: break;
        }
    } catch (e) {
        if (token) { toast(e.message, true); loadTasks(); }
    }
});

document.addEventListener('change', async (ev) => {
    const t = ev.target;
    if (t.id === 'subjectFilter') { filters.subject = t.value; renderPage(); }
    else if (t.id === 'sortFilter') { filters.sort = t.value; renderPage(); }

});

/* ================= NOTIFICATIONS ================= */

async function toggleNotifications() {
    if (!notifySupported) return;
    if (Notification.permission === 'denied') {
        toast('Click the lock icon next to the web address and allow Notifications for this site.', true);
        return;
    }
    if (Notification.permission !== 'granted') {
        const result = await Notification.requestPermission();
        if (result === 'granted') {
            document.getElementById('alarmBanner').classList.add('hidden');
            showSystemNotification(BRAND, 'Reminders are on: every day at 9:00 AM and 8:00 PM.');
        } else {
            toast('Pop-ups were not allowed. The on-screen alarm still works.', true);
        }
    }
    renderPage();
}

/* ---- sound: a short three-beep alarm made with the Web Audio API ---- */
let audioCtx = null;
function unlockAudio() {
    try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        if (!audioCtx) audioCtx = new AC();
        if (audioCtx.state === 'suspended') audioCtx.resume();
    } catch (e) { /* ignore */ }
}
document.addEventListener('pointerdown', unlockAudio);
document.addEventListener('keydown', unlockAudio);

function beep() {
    try {
        unlockAudio();
        if (!audioCtx) return;
        for (let i = 0; i < 3; i++) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const t0 = audioCtx.currentTime + i * 0.35;
            osc.type = 'sine';
            osc.frequency.value = 880;
            gain.gain.setValueAtTime(0.0001, t0);
            gain.gain.exponentialRampToValueAtTime(0.3, t0 + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.28);
            osc.connect(gain); gain.connect(audioCtx.destination);
            osc.start(t0); osc.stop(t0 + 0.3);
        }
    } catch (e) { /* ignore */ }
}

/** Pop-up outside the page. Phones (Android Chrome, installed iPhone apps) need the service worker for this. */
async function showSystemNotification(title, body) {
    if (!notifyEnabled()) return;
    const options = { body, tag: 'focusly', renotify: true, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', vibrate: [200, 100, 200] };
    try {
        if ('serviceWorker' in navigator) {
            // `ready` waits until the worker is active; give up after 2.5 s and use the plain way
            const reg = await Promise.race([navigator.serviceWorker.ready, new Promise((r) => setTimeout(() => r(null), 2500))]);
            if (reg) { await reg.showNotification(title, options); return; }
        }
    } catch (e) { /* fall through */ }
    try { new Notification(title, { body, icon: options.icon }); } catch (e) { /* ignore */ }
}

let lastAlarm = null;

function showAlarmBanner(title, body, buttons) {
    const el = document.getElementById('alarmBanner');
    if (!el) return;
    const canAsk = !NATIVE && notifySupported && Notification.permission === 'default';
    const btns = buttons || `<button type="button" class="btn small" data-action="alarm-snooze">Snooze 10 min</button>
        ${canAsk ? '<button type="button" class="btn small" data-action="notify-toggle">Allow pop-ups</button>' : ''}
        <button type="button" class="btn small primary" data-action="alarm-dismiss">Dismiss</button>`;
    el.innerHTML = `<span class="ab-icon">${icon('bell')}</span><div><b>${esc(title)}</b><span>${esc(body).replace(/\n/g, '<br>')}</span></div>
        <div class="ab-btns">${btns}</div>`;
    el.classList.remove('hidden');
}

/** Rings again in 10 minutes (while the page is open). */
function snoozeAlarm() {
    document.getElementById('alarmBanner').classList.add('hidden');
    if (!lastAlarm) return;
    const a = lastAlarm;
    toast('Snoozed for 10 minutes');
    setTimeout(() => { if (user) alertUser(a.title, a.body, true); }, 10 * 60 * 1000);
}

/** One friendly, one-time question so reminders pop up outside the page too. */
function maybeAskPermission() {
    if (NATIVE || !notifySupported || !user || !tasks.length) return;
    if (Notification.permission !== 'default' || store.get('stm_asked') === '1') return;
    if (!document.getElementById('alarmBanner').classList.contains('hidden')) return;   // an alarm is showing
    store.set('stm_asked', '1');
    showAlarmBanner('Get automatic reminders?', 'Allow notifications and Focusly will remind you before every deadline, even when this tab is in the background.',
        `<button type="button" class="btn small" data-action="alarm-dismiss">Not now</button>
         <button type="button" class="btn small primary" data-action="notify-toggle">Allow</button>`);
}

/** Rings the alarm: banner + sound + vibration + system pop-up. */
function alertUser(title, body) {
    lastAlarm = { title, body };
    showAlarmBanner(title, body);
    beep();
    try { if (navigator.vibrate) navigator.vibrate([200, 100, 200]); } catch (e) { /* ignore */ }
    showSystemNotification(title, body);
}

const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };

function relText(diff) {
    if (diff < 0) return `overdue by ${-diff} day${diff === -1 ? '' : 's'}`;
    return diff === 0 ? 'due today' : 'due tomorrow';
}

/** What the reminder says on a given day: tasks due within 24 hours or overdue, else a nudge to start the top task. */
function reminderMessage(date) {
    const day = startOfDay(date);
    const open = tasks.filter((t) => !isDone(t));
    if (!open.length) return null;
    const urgent = open
        .map((t) => ({ t, diff: Math.round((parseIso(t.dueDate) - day) / 86400000) }))
        .filter((x) => x.diff <= 1)
        .sort((a, b) => a.diff - b.diff);
    if (urgent.length) {
        const lines = urgent.slice(0, 4).map((x) => `${x.t.title} - ${relText(x.diff)}`);
        if (urgent.length > 4) lines.push(`and ${urgent.length - 4} more`);
        return { title: urgent[0].diff < 0 ? 'Deadlines need attention' : 'Deadline within 24 hours', body: lines.join('\n') };
    }
    return { title: 'Time to work on your tasks', body: `Start with: ${open[0].title}` };
}

/** Checked every 20 seconds and after every refresh. Rings at each fixed time, once per day,
 *  and rings late (once) if the page was opened after a time had passed. */
function alarmTick() {
    if (!user || !hasLoaded) return;
    const now = new Date();
    const mins = now.getHours() * 60 + now.getMinutes();
    const passed = REMINDER_SLOTS.filter((s) => mins >= s.h * 60 + s.m);
    if (!passed.length) return;

    const key = `stm_slots_${user.id}_${isoToday()}`;
    let fired = [];
    try { fired = JSON.parse(store.get(key) || '[]'); } catch (e) { fired = []; }
    if (passed.every((s) => fired.includes(s.label))) return;
    store.set(key, JSON.stringify(passed.map((s) => s.label)));

    const msg = reminderMessage(now);
    if (msg) alertUser(msg.title, msg.body);
}
setInterval(alarmTick, 20 * 1000);
// Phones pause timers in the background, so check again as soon as the person comes back.
document.addEventListener('visibilitychange', () => { if (!document.hidden) alarmTick(); });
window.addEventListener('focus', alarmTick);
window.addEventListener('pageshow', alarmTick);

/* ================= DELETE ACCOUNT ================= */

function openDeleteDialog() {
    els.delPassword.value = '';
    els.delError.classList.add('hidden');
    els.delDialog.showModal();
    els.delPassword.focus();
}

els.delForm.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const btn = $('delConfirm');
    if (!els.delPassword.value) {
        els.delError.textContent = 'Please type your password to confirm.';
        els.delError.classList.remove('hidden');
        return;
    }
    btn.disabled = true;
    try {
        await api('/auth/me', { method: 'DELETE', body: JSON.stringify({ password: els.delPassword.value }) });
        els.delDialog.close();
        cancelNativeReminders();
        forceLogout();
        toast('Your account and all its data were deleted.');
    } catch (e) {
        els.delError.textContent = e.message;
        els.delError.classList.remove('hidden');
    } finally {
        btn.disabled = false;
    }
});

/* ================= NATIVE (Android / iOS) ALARMS =================
 * Inside the store apps, reminders are scheduled with the phone's own alarm system,
 * so they ring even when the app is closed. In a browser this part does nothing. */

const localNotif = () => (NATIVE && window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications) || null;

async function ensureNativePermission() {
    const ln = localNotif();
    if (!ln) return false;
    try {
        let p = await ln.checkPermissions();
        if (p.display === 'prompt' || p.display === 'prompt-with-rationale') p = await ln.requestPermissions();
        return p.display === 'granted';
    } catch (e) { return false; }
}

async function cancelNativeReminders() {
    const ln = localNotif();
    if (!ln) return;
    try {
        const pending = await ln.getPending();
        if (pending.notifications.length) await ln.cancel({ notifications: pending.notifications });
    } catch (e) { /* ignore */ }
}

/** Plans the next 14 days of reminders (9:00 AM and 8:00 PM) with the phone's alarm system. */
async function scheduleNativeReminders() {
    const ln = localNotif();
    if (!ln || !user) return;
    if (!(await ensureNativePermission())) return;

    const now = Date.now();
    const plan = [];
    for (let d = 0; d < 14; d++) {
        const day = startOfDay(new Date());
        day.setDate(day.getDate() + d);
        const msg = reminderMessage(day);
        if (!msg) continue;
        REMINDER_SLOTS.forEach((slot, i) => {
            const at = new Date(day); at.setHours(slot.h, slot.m, 0, 0);
            if (at.getTime() > now) {
                plan.push({ id: 1000 + d * 2 + i, title: msg.title, body: msg.body, schedule: { at, allowWhileIdle: true } });
            }
        });
    }
    try {
        await cancelNativeReminders();
        if (plan.length) await ln.schedule({ notifications: plan });
    } catch (e) { /* ignore: alarms are a convenience */ }
}

/* ================= INIT ================= */

document.querySelectorAll('[data-icon]').forEach((el) => { el.innerHTML = icon(el.dataset.icon); });

async function init() {
    setAuthMode('login');
    try { if (!NATIVE && 'serviceWorker' in navigator && window.isSecureContext) navigator.serviceWorker.register('/sw.js'); } catch (e) { /* ignore */ }
    token = store.get('stm_token');
    if (!token) { showAuthScreen(); return; }
    try {
        user = await api('/auth/me');
        showApp();
    } catch (e) {
        forceLogout();
    }
}

init();
