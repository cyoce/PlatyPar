"use strict";
window.location.reload(true);
Array.prototype.remove = function (){
  for (var i = 0; i < arguments.length; i++){
    let index = this.indexOf(arguments[i]);
    if(~index) this.splice(index, 1);
  }
  return this;
}
const last_obj = {
  get () {
    return this[this.length-1];
  }, set (v){
    this[this.length-1] = v;
  }
}
Object.defineProperty(Array.prototype, 'last', last_obj);
Object.defineProperty(String.prototype, 'last', last_obj);
var raw_digits = " \"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"
.split('');
//raw_digits = "0123456789".split('');
//raw_digits = "`1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?`¡™£¢∞§¶•ªº–≠œ∑´®†¥¨ˆøπ“‘«åß∂ƒ©˙∆˚¬…æΩ≈ç√∫˜µ≤≥÷`⁄€‹›ﬁﬂ‡°·‚—±Œ„´‰ˇÁ¨ˆØ∏”’»ÅÍÎÏ˝ÓÔÒÚÆ¸˛Ç◊ı˜Â¯˘¿";
const NEG = '-';
const DEC = '.';
const END = ' ';
const HASH = '#';
raw_digits.remove(NEG, DEC, END, HASH);
const mod = ((x,y) => ((x % y) + y) % y);
function parseNum (string, base, digits){
  var n = 0, sign = 1;
  digits = digits || raw_digits;
  base = base || digits.length;
  if (string[0] === NEG){
    string = string.slice(1);
    sign = -1;
  }
  var strings = string.split('.');
  string = strings[0];
  for(let i = 0, j = string.length - 1; i < string.length; i++, j--){
    let index = mod(digits.indexOf(string[i]), base);
    let pow =  Math.pow(base, j);
    n += index * pow;
  }
  if (strings[1]) n += parseNum(strings[1]) * Math.pow(base, -strings[1].length);
  return n * sign;
}

function genNum (number, digits, base){
  digits = digits || raw_digits;
  base = base || digits.length;
  var sign, out = '';
  if (number < 0){
    number *= sign = -1;
  }
  const magnitude = number ? Math.floor(logn(base, number)) : 0;
  for (let i = 0; i <= magnitude; i++){
    let index = Math.floor(number / Math.pow(base, i)) % (base);
    out += digits[index];
  out = out.split('').reverse().join('');
  }
  if (number % 1 !== 0){
    let str = String(number);
    let remainder = +str.slice(str.indexOf('.'));
    console.log(remainder);
    out += DEC;
    while (remainder > 0){
      remainder *= base;
      out += genNum (Math.floor(remainder));
      remainder %= 1;
    }
  }
  if (sign === -1) out += NEG;
  return out;
}

function logn (base, number){
  return Math.log2(number) / Math.log2 (base);
}

class Oper {
  constructor (arity, exp){
    this.arity = arity;
    this.exp   =  exp;
  }
  format (x,y){
    return '(' + this.exp.replace('x', x).replace('y', y) + ')';
  }
}
var funcs = {
  "+" : new Oper (2, 'x + y'),
  '-' : new Oper (2, 'x - y'),
  '*' : new Oper (2, 'x * y'),
  '/' : new Oper (2, 'x / y'),
  ',' : new Oper (2, 'x[y]'),
  ':' : new Oper (2, 'x = y'),
  '$' : new Oper (2, 'stack.push(x)'),
  '{' : new Oper (1, '--x'),
  '}' : new Oper (1, '++x'),
  '&' : new Oper (2, 'x & y'),
  '|' : new Oper (2, 'x | y'),
  '~' : new Oper (2, 'x ^ y'),
  '^' : new Oper (2, 'Math.pow(x,y)'),
  '?' : new Oper (3, 'x ? y : z'),
};
function parse_tokens (string){
  var out = [], quote = '', quotes = ["'", '"', '`'], i,j;
  if (string.last !== '\n') string += '\n';
  for (j = string[i = 0]; i < string.length; j = string[++i]){
    var escaped = string[i - 1] === '\\';
    if (!quote && (~quotes.indexOf(j)) && !escaped){
      quote = j;
      out.push('');
    } else if (j === quote && !escaped){
    } else if (j === '\n' && quote && !escaped){
      out.last += quote;
      quote = '';
    }
    if (quote){
      out.last += j;
      if (quote === "'" && quote !== j) quote = '';
      if (out.last.length > 1 && j === quote) quote = '';
    } else {
      out.push(j);
    }
  }
  if (out.last === '\n') out = out.slice(0, out.length - 1);
  return out;
}

function evalu (string){

}

function compare (number){
  const numstring = genNum(number);
  console.log(number, numstring);
  return numstring;
}

function runScript (script, debug){
  window.open().document.write(`
    <head>
    <link rel='stylesheet' href='style.css'>
    <title>ParStack</title>
    </head>
    <body>
    <button style='font-family:andale-mono, consolas, menlo, monospace' class='box' id='run' onclick='run_main()'>Run</button><br>
    <pre>${script}</pre><script>${script}</script>
    </body>`
  );
}

function eval_stack (raw){
  var out = `
function stdargs(){
  return eval (\`[\${stdin()}]\`);
}
function stdin () {
  return prompt ('Input');
}
function stdout (string){
  return confirm(JSON.stringify(string)) && [string];
}
function run_main (){
  stdout (main (stdargs())) && window.close();
}
function main (_stack){
  var stack = _stack, newstack, stacks=[_stack];
  function usestack(newstack){
    stacks.push(newstack);
    stacks[stacks.length-2].push(newstack);
    stack = newstack;
  }\n`;
  var indent_level = 1, indents = [], tokens = parse_tokens(raw);
  window.tokens = tokens;
  window.raw = raw;
  const ops = {
    "+" : "x + y",
    "-" : "x - y",
    "/" : "x / y",
    "*" : "x * y",
    "^" : "Math.pow(x,y)",
    "$" : "stacks[0]",
    ":" : "stacks[stacks.length-2]",
    "@" : "usestack(x)",
    "M" : "main (x)",
    "(" : "x - 1",
    ")" : "x + 1",
    "C" : "X",
    "c" : "stacks[stacks.length-2].pop()",
    ">" : "x >= y",
    "<" : "x < y",
    "|" : "x | y",
    "&" : "x & y",
    "~" : "x ^ y",
    "X" : "(x,x)",
  };
  const cmd = {
    ";" : "}",
    "F" : "while (stack.length > 1){",
    "?" : "if(x){",
    "\\" : "} else {",
    "#" : "while(x){",
    "W" : "while(X){",
    "{" : 'usestack([])',
    "}" : "stacks.pop(); stack = stacks[stacks.length-1]"
  };
  const stdio = {
    "a" : "stdout(x)",
    "A" : "stdout(X)",
    "P" : "stdin()",
    "I" : "stdargs()"
  };
  function escape (string){
    return string.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  }
  function write (string){
    if (string[0]   === '}'){
      outdent ();
      string = string.slice(1);
    }
    out += `${'  '.repeat(indent_level) + string}\n`;
    if (string.last === '}') {
      outdent ();
      string = string.slice(0, string.length - 1);
    }
    if (string.last === '{') indent_level++;
  }
  function push (string){
    write(`stack.push(${string});`);
  }
  function block (string){
    write(`var stdval = ${string};
    if (stdval) stack.push(stdval[0])
    else return "Bye!"`);
  }
  function outdent () {
    indent_level--;
    out += indents [indent_level] || '}';
    indents [indent_level] = '}';
  }
  function exp (string){
    return string.replace(/x/, 'stack.pop()')
      .replace(/y/,'stack.pop()')
      .replace(/X/g, 'stack[stack.length-1]');
  }
  for (var i = 0; i < tokens.length; i++){
    let token = tokens[i];
    if (token in ops) push(exp(ops[token]));
    else if (token in cmd) {
      switch(token){}
      write(exp(cmd[token]));
    }
    else if (token in stdio) block(exp(stdio[token]));
    else push(token);
  }
  while (indent_level > 1) outdent ();
  write('  return stack.pop();\n}\ndocument.getElementById("run").focus()');
  return out;
}
function compile_program (){
  const raw = mainbox.value;
  const compiled = eval_stack(raw);
  runScript(compiled);
}
function edit_program (){
  const newprogram = prompt(mainbox.innerText);
  if (newprogram) mainbox.innerText = newprogram;
}
const mainbox = document.getElementById('main');
mainbox.focus();
