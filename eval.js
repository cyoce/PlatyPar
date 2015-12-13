"use strict";
const mainbox = document.getElementById('main');
mainbox.focus();
const linkbox = document.getElementById('linkbox');
var query = parse_query(location.href);
if (query) {
  if (query.code){
    mainbox.value = query.code;
  }
}
function codelink_get (){
  var code = mainbox.value;
  linkbox.value = 'https://rawgit.com/cyoce/Par/master/page.html' + gen_query ({code:code});
  linkbox.focus();
}
function codelink_open (){
  window.open (linkbox.value);
}
function parse_query (href){
  href = String(href).split("?");
  if (href.length <= 1) return null;
  href = href[1];
  console.log(href);
  var out  = Object.create(null);
  var keys = href.split("&");
  for (var i = 0; i < keys.length; i++){
    let
    pair = keys[i].split('=');
    out[unescape(pair[0])] = unescape(pair[1]);
  }
  return out;
}
function gen_query (obj){
  if (obj === null || obj === Object.create(null)) return '';
  var out = '?';
  for (var key in obj){
    if (!obj.hasOwnProperty(key)) continue;
    if (out.length !== 1) out += "&";
    out += escape(key) + "=" + escape(obj[key]);
  }
  return out;
}
if(isNaN(location.href[location.href.length-1])){
  location.href += ((~location.href.indexOf('?')) ? '&' : '?') + 'latest=' + String(Math.random()).split('.')[1];
}

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
      if (quote === "'" && quote !== j) out.last += quote, quote = '';
      if (out.last.length > 1 && j === quote) quote = '';
    } else {
      out.push(j);
    }
  }
  if (out.last === '\n') out = out.slice(0, out.length - 1);
  return out;
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
    <title>Par</title>
    </head>
    <body>
    <button style='font-family:andale-mono, consolas, menlo, monospace' class='box' id='run' onclick='run_main()'>Run</button><br>
    <pre>${script}</pre><script>${script}</script>
    </body>`
  );
}

function eval_stack (raw){
  var out = `function stdargs (){
  return eval (\`[\${stdin()}]\`);
}
function stdin (){
  return prompt ('Input');
}
function stdout (string){
  return confirm(JSON.stringify(string)) && [string];
}
function run_main (){
  stdout (main (stdargs())) && window.close();
}
function main (_stack){
  var stack = window.__stack = _stack, newstack, stacks=[_stack];
  function usestack(newstack){
    stacks.push(newstack);
    stack = newstack;
  }
  function range(a,b){
    if (~[typeof a, typeof b].indexOf('string')){
      if (typeof a === 'string') a = a.charCodeAt();
      if (typeof b === 'string') b = b.charCodeAt();
      var out = range(a,b);
      for (var i = 0; i < out.length; i++) out[i] = String.fromCharCode(out[i]);
    } else {
      var out = [];
      while (b <= a) out.push(b++);
    }
    return out;
  }\n`;
  var indent_level = 1, indents = [], tokens = parse_tokens(raw);
  window.tokens = tokens;
  window.raw = raw;
  const ops = {
    "+" : "$ + $",
    "-" : "$ - $",
    "/" : "$ / $",
    "*" : "$ * $",
    "^" : "Math.pow($,$)",
    "$" : "stacks[0]",
    "S" : "stacks[stacks.length-2]",
    "s" : "stacks[stacks.length-1]",
    "@" : "usestack ($)",
    "M" : "main ($)",
    "(" : "$ - 1",
    ")" : "$ + 1",
    "C" : "#",
    "c" : "stacks[stacks.length-2].pop()",
    "V" : "stack[stack.length-2], stack[stack.length-1]",
    ">" : "$ >= $",
    "<" : "$ < $",
    "|" : "$ | $",
    "&" : "$ & $",
    "~" : "$ ^ $",
    "Z" : "($,$)",
    "z" : "$,$",
    "=" : "$ === $",
    "_" : "range($, $)",
    "." : "range($-1, $)",
    "d" : "",
    "!" : "!$",
    "l" : "$.length",
    "L" : "$.toLowerCase()",
    "U" : "$.toUpperCase()"
  };
  const cmd = {
    ";" : "}",
    "F" : "while (stack.length > 1){",
    "?" : "if($){",
    "\\" : "} else {",
    "w" : "while($){",
    "W" : "while(#){",
    "{" : 'usestack([])',
    "}" : "stacks[stacks.length-2].push(stack); stacks.pop(); stack = stacks[stacks.length-1]",
    "#" : "for (var i=0, j=$; i < j;i++){",
    "," : "stacks[stacks.length-1]=stack=stack.reverse()",
    "r" : "stack.push.apply(stack, range($,$))",
    "[" : "stack.push(stack.shift())",
    "]" : "stack.unshift(stack.pop())",
    "f" : "stack.push.apply(stack, $)",
    "x" : "var item=$,list=$;list.splice(list.indexOf(item),1);stack.push(list)",
    "e" : "var list = $; for(var i=0;i< list.length;i++)stack.push(list[i])",
  };
  const stdio = {
    "a" : "stdout($)",
    "A" : "stdout(#)",
    "i" : "stdin()",
    "I" : "stdargs()"
  };
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
    if (stdval);
    else return "Bye!"`);
  }
  function outdent () {
    indent_level--;
    out += indents [indent_level] || '}';
    indents [indent_level] = '}';
  }
  function exp (string){
    return string.replace(/\$/g, 'stack.pop()')
      .replace(/#/g, 'stack[stack.length-1]');
  }
  function beautify (code) {
    code = code.split(/[\n]/g);
    var level = 0;
    for (var i = 0; i < code.length; i++){
      let token = code[i].replace(/\s/g, '');
      if (token.last === '{') level++;
      else if (token.last === '}') level--;
      else if (token.last === ';');
      else {
        code[i] += ';';
      }
      if (token.length > 0 && token[0] === '}') level--;
      console.log(level);
      code[i] += '\n';
      if (level > 0) code[i] += '  '.repeat(level);
    }
    return code.join('');
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
  write('return stack.pop();\n}\ndocument.getElementById("run").focus()');
  return beautify(out);
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
