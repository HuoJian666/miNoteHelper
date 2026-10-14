// Run with: node content.test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync(`${__dirname}/content.js`, 'utf8');

async function check() {
  let folders = [], clicks = [], retry, onClick, timer, saved;
  const context = vm.createContext({
    console: { log() {}, error() {} },
    window: { addEventListener() {} },
    document: {
      body: {}, querySelectorAll: () => folders,
      addEventListener: (_, callback) => { onClick = callback; },
      removeEventListener: () => { onClick = null; },
    },
    chrome: { storage: { sync: {
      get: (_, callback) => callback({ miNoteSettings: saved }),
      set: (value, callback) => { saved = value.miNoteSettings; callback(); },
    } } },
    setInterval: callback => { retry = callback; return 2; },
    clearInterval: () => { retry = null; },
    setTimeout: callback => { timer = callback; return 1; },
    clearTimeout: () => { timer = null; },
  });
  vm.runInContext(source, context);
  const folder = name => ({ textContent: name, classList: [], click: () => clicks.push(name) });
  assert.equal((await context.loadSettings()).defaultActiveFolder, 'a-work');
  await context.saveSettings({ defaultActiveFolder: '', customFolderVisibility: { blog: false } });
  assert.equal((await context.loadSettings()).defaultActiveFolder, '');
  context.activateDefaultFolder('');
  assert.equal(retry, undefined);

  folders = [folder('a-work-copy')];
  context.activateDefaultFolder(' a-work ');
  assert.deepEqual(clicks, []);
  assert.equal(typeof retry, 'function');
  folders.push(folder('a-work'));
  retry();
  assert.deepEqual(clicks, ['a-work']);
  // First click is ignored while Xiaomi initializes. Keep trying until selected.
  assert.equal(typeof retry, 'function');
  retry();
  assert.deepEqual(clicks, ['a-work', 'a-work']);
  folders[1].classList = ['sidebar-item-123', 'active-123'];
  retry();
  assert.equal(retry, null);
  assert.equal(timer, null);
  assert.equal(onClick, null);

  folders = [];
  context.activateDefaultFolder('missing');
  timer();
  assert.equal(retry, null);
  assert.equal(onClick, null);
  context.activateDefaultFolder('a-work');
  onClick({ isTrusted: true, target: { closest: () => ({}) } });
  assert.equal(retry, null);
  assert.equal(timer, null);
  console.log('PASS: default/storage, empty, exact match, delayed load, ignored startup click/retry/confirmation, cleanup, timeout, manual selection');
}
check().catch(error => { console.error(error); process.exitCode = 1; });
