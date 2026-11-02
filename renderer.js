const currentEl = document.getElementById('current');
const historyEl = document.getElementById('history');
let current = '0', previous = null, operator = null;
let justEvaluated = false, justPressedOp = false;
const OP_SYMBOL = { '+': '+', '-': '−', '*': '×', '/': '÷' };

function updateDisplay() {
  currentEl.textContent = current;
  historyEl.textContent = (previous !== null && operator)
    ? previous + ' ' + OP_SYMBOL[operator] : '';
}
function inputNumber(n) {
  if (justEvaluated) { current = '0'; justEvaluated = false; }
  if (n === '.') { if (!current.includes('.')) current += '.'; }
  else { current = current === '0' ? n : current + n; }
  justPressedOp = false; updateDisplay();
}
function inputOperator(op) {
  if (justEvaluated) justEvaluated = false;
  if (operator && !justPressedOp) {
    const r = compute(parseFloat(previous), parseFloat(current), operator);
    previous = String(r); current = String(r);
  } else { previous = current; }
  operator = op; justPressedOp = true; updateDisplay();
}
function compute(a, b, op) {
  switch (op) {
    case '+': return a + b; case '-': return a - b;
    case '*': return a * b; case '/': return b === 0 ? 'Error' : a / b;
    default: return b;
  }
}
function equals() {
  if (operator === null || previous === null) return;
  const r = compute(parseFloat(previous), parseFloat(current), operator);
  historyEl.textContent = previous + ' ' + OP_SYMBOL[operator] + ' ' + current + ' =';
  current = String(r); previous = null; operator = null;
  justEvaluated = true; justPressedOp = false;
  currentEl.textContent = current;
}
function clearAll() {
  current = '0'; previous = null; operator = null;
  justEvaluated = false; justPressedOp = false; updateDisplay();
}
function toggleSign() {
  if (current.startsWith('-')) current = current.slice(1);
  else if (current !== '0') current = '-' + current;
  updateDisplay();
}
function percent() { current = String(parseFloat(current) / 100); updateDisplay(); }

document.querySelectorAll('[data-num]').forEach(b =>
  b.addEventListener('click', () => inputNumber(b.dataset.num)));
document.querySelectorAll('[data-op]').forEach(b =>
  b.addEventListener('click', () => inputOperator(b.dataset.op)));
document.querySelectorAll('[data-action]').forEach(b =>
  b.addEventListener('click', () => {
    const a = b.dataset.action;
    if (a === 'clear') clearAll();
    if (a === 'equals') equals();
    if (a === 'sign') toggleSign();
    if (a === 'percent') percent();
  }));
document.addEventListener('keydown', e => {
  if (/^[0-9]$/.test(e.key)) inputNumber(e.key);
  else if (e.key === '.') inputNumber('.');
  else if ('+-*/'.includes(e.key)) inputOperator(e.key);
  else if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); equals(); }
  else if (e.key === 'Escape') clearAll();
  else if (e.key === 'Backspace') {
    current = current.length > 1 ? current.slice(0, -1) : '0';
    updateDisplay();
  }
});
updateDisplay();
