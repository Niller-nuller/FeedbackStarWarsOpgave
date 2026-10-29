const form = document.getElementById('entry-form');
const idInput = document.getElementById('entry-id');
const nameInput = document.getElementById('name');
const roleInput = document.getElementById('role');
const planetInput = document.getElementById('planet');
const saveBtn = document.getElementById('save-btn');
const cancelBtn = document.getElementById('cancel-btn');
const message = document.getElementById('message');
const list = document.getElementById('entries');
const searchInput = document.getElementById('search');
const detail = document.getElementById('detail');
const detailName = document.getElementById('detail-name');
const detailRole = document.getElementById('detail-role');
const detailPlanet = document.getElementById('detail-planet');
const detailId = document.getElementById('detail-id');
const detailClose = document.getElementById('detail-close');

let entries = [];

const getId = (entry) => entry.id;

function showMessage(text, isError = false) {
    message.textContent = text;
    message.className = 'mb-4 min-h-6 text-center text-sm italic ' +
        (isError ? 'text-red-400' : 'text-emerald-400');
}

function makeButton(label, classes, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.className =
        'rounded-md border px-3 py-1 font-display text-xs uppercase tracking-wider transition ' + classes;
    btn.addEventListener('click', onClick);
    return btn;
}

const VIEW_STYLE   = 'border-cyan-400/50 text-cyan-300 hover:bg-cyan-400 hover:text-slate-950 hover:shadow-[0_0_14px_rgba(34,211,238,0.6)]';
const EDIT_STYLE   = 'border-emerald-400/50 text-emerald-300 hover:bg-emerald-400 hover:text-slate-950 hover:shadow-[0_0_14px_rgba(52,211,153,0.6)]';
const DELETE_STYLE = 'border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white hover:shadow-[0_0_14px_rgba(239,68,68,0.6)]';

async function loadEntries() {
    try {
        entries = await api('/archive');
        render();
    } catch (err) {
        showMessage(err.message, true);
    }
}

function render() {
    list.replaceChildren();

    const q = searchInput.value.trim().toLowerCase();
    const visible = entries.filter((e) =>
        [e.name, e.role, e.planet].some((v) => String(v ?? '').toLowerCase().includes(q))
    );

    if (visible.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'rounded-xl border border-slate-700 bg-slate-900/60 p-5 text-center italic text-slate-500';
        empty.textContent = entries.length === 0
            ? 'The archives are empty.'
            : 'No records match your search.';
        list.append(empty);
        return;
    }

    for (const entry of visible) {
        const li = document.createElement('li');
        li.className =
            'flex flex-col gap-3 rounded-xl border border-slate-700 border-l-4 border-l-amber-400/70 ' +
            'bg-slate-900/70 p-4 shadow-lg transition hover:border-amber-400/40 hover:border-l-amber-300 sm:flex-row sm:items-center sm:justify-between';

        const info = document.createElement('div');

        const name = document.createElement('h3');
        name.className = 'font-display text-lg font-bold tracking-wide text-amber-200';
        name.textContent = entry.name;

        const details = document.createElement('p');
        details.className = 'text-sm text-slate-400';
        details.textContent = `${entry.role} · ${entry.planet}`;

        info.append(name, details);

        const actions = document.createElement('div');
        actions.className = 'flex shrink-0 gap-2';
        actions.append(
            makeButton('View', VIEW_STYLE, () => viewEntry(getId(entry))),
            makeButton('Edit', EDIT_STYLE, () => startEdit(entry)),
            makeButton('Delete', DELETE_STYLE, () => deleteEntry(getId(entry)))
        );

        li.append(info, actions);
        list.append(li);
    }
}

async function viewEntry(id) {
    try {
        const entry = await api(`/archive/${id}`);
        detailName.textContent = entry.name;
        detailRole.textContent = entry.role;
        detailPlanet.textContent = entry.planet;
        detailId.textContent = getId(entry);
        detail.hidden = false;
        detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } catch (err) {
        showMessage(err.message, true);
    }
}

detailClose.addEventListener('click', () => { detail.hidden = true; });

searchInput.addEventListener('input', render);

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
        name: nameInput.value.trim(),
        role: roleInput.value.trim(),
        planet: planetInput.value.trim(),
    };
    const id = idInput.value;

    try {
        if (id) {
            await api(`/archive/${id}`, { method: 'PUT', body });
            showMessage('Entry updated successfully.');
        } else {
            await api('/archive', { method: 'POST', body });
            showMessage('Entry added successfully.');
        }
        resetForm();
        await loadEntries();
    } catch (err) {
        showMessage(err.message, true);
    }
});

function startEdit(entry) {
    idInput.value = getId(entry);
    nameInput.value = entry.name;
    roleInput.value = entry.role;
    planetInput.value = entry.planet;
    saveBtn.textContent = 'Save changes';
    cancelBtn.hidden = false;
    nameInput.focus();
}

function resetForm() {
    form.reset();
    idInput.value = '';
    saveBtn.textContent = 'Add entry';
    cancelBtn.hidden = true;
}

cancelBtn.addEventListener('click', resetForm);

async function deleteEntry(id) {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    try {
        await api(`/archive/${id}`, { method: 'DELETE' });
        if (detailId.textContent === String(id)) detail.hidden = true;
        showMessage('Entry deleted successfully.');
        await loadEntries();
    } catch (err) {
        showMessage(err.message, true);
    }
}

loadEntries();