"use strict";
Array.prototype.remove = function (){
  for (var i = 0; i < arguments.length; i++){
    let index = this.indexOf(arguments[i]);
    if(~index) this.splice(index, 1);
  }
  return this;
}
var raw_digits = " \"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~"
.split('');
//raw_digits = "0123456789".split('');
//raw_digits = "`1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,./~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?`¡™£¢∞§¶•ªº–≠œ∑´®†¥¨ˆøπ“‘«åß∂ƒ©˙∆˚¬…æΩ≈ç√∫˜µ≤≥÷`⁄€‹›ﬁﬂ‡°·‚—±Œ„´‰ˇÁ¨ˆØ∏”’»ÅÍÎÏ˝ÓÔÒÚÆ¸˛Ç◊ı˜Â¯˘¿";
const NEG = '-';
const DEC = '.';
const END = ' ';
const HASH = '#';
raw_digits.remove(NEG, DEC, END, HASH);
const last_obj = {
  get () {
    return this[this.length-1];
  }, set (v){
    this[this.length-1] = v;
  }
}
Object.defineProperty(Array.prototype, 'last', last_obj);
Object.defineProperty(String.prototype, 'last', last_obj);
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
  var out = [], quote = '', quotes = ["'", '"', '`', '#'], i,j;
  if (string.last !== '\n') string += '\n';
  for (j = string[i = 0]; i < string.length; j = string[++i]){
    var escaped = string[i - 1] === '\\';
    if (!quote && (~quotes.indexOf(j)) && !escaped){
      quote = j;
      out.push('');
    } else if (j === quote && !escaped){
      //quote = '';
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
  window.open().document.write(`<pre>${script}</pre><script>${script}</script>`);
}

function eval_stack (raw){
  var out = `
  function stdargs(){
    var input, args = [];
    while (input = stdin()){
      args.push(eval(input));
      console.log(input);
    }
    return args;
  }
  function stdin () {
    return prompt ('Input');
  }
  function stdout (string){
    alert (JSON.stringify(string));
    return string;
  }
  function main (stack){`;
  var tokens = parse_tokens(raw);
  window.tokens = tokens;
  var ops = {
    "+" : "x + y",
    "-" : "x - y",
    "/" : "x / y",
    "*" : "x * y",
    "^" : "Math.pow(x,y)",
    "P" : "stdin()",
    "I" : "stdargs()",
    "$" : "stack",
    "M" : "main (x)"
  };
  var cmd = {
    "A" : "stdout(x)",
    ";" : "}",
    "@" : "while (stack.length > 1){",
    "?" : "if(x){",
    "\\" : "} else {"
  };
  function write (string){
    out += string + '\n';
  }
  function push(string){
    write(`stack.push(${string});`);
  }
  function exp (string){
    return string.replace(/x/, 'stack.pop()').replace(/y/,'stack.pop()');
  }
  for (var i = 0; i < tokens.length; i++){
    let token = tokens[i];
    if (token in ops) push(exp(ops[token]));
    else if (token in cmd) write(exp(cmd[token]));
    else push(token);
  }
  write('return stack.pop()\n}');
  write('stdout (main (stdargs()))')
  write('window.close()');
  return out;
}
function compile_program (){
  var compiled = eval_stack(mainbox.innerHTML);
  runScript(compiled);
}
const mainbox = document.getElementById('main');
document.getElementById('run').focus();
