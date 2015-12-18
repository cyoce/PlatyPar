"use strict";
var debug = true;
setTimeout(rawupdate);
const raw_digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const mod = ((x,y) => ((x % y) + y) % y);
const mainbox = document.getElementById('main');
mainbox.focus();
const linkbox = document.getElementById('linkbox');
const rawbox = document.getElementById('raw');
var query = parse_query(location.href);
if (query) {
  if (query.code){
    rawbox.value = query.code;
  }
}
var time = Math.floor(new Date / 1e3);
if (query === null) query = {};
if (query.date === (void 0) || time - parseNum(query.date, 62) > 20){
  query.date = genNum(time, 62);
  location.href = applyquery (query);
}
console.log(+(new Date));
function applyquery (query, href){
  href = href || location.href;
  href = href.split("?")[0];
  return href + gen_query (query);
}
function codelink_get (){
  var code = rawbox.value;
  linkbox.value = 'https://rawgit.com/cyoce/PlatyPar/master/page.html' + gen_query ({code:code});
  linkbox.focus();
	return linkbox.value;
}
function markdown_gen (){
	mainbox.innerText = `
# [PlatyPar](https://github.com/cyoce/PlatyPar/blob/master/), ${rawbox.value.length} bytes

    ${rawbox.value}

[Try it online](${codelink_get()})!
`
}
function codelink_open (){
  window.open (linkbox.value);
}
function parse_query (href){
  href = String(href).split("?");
  if (href.length <= 1) return null;
  href = href[1];
  var out  = {};
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
function parseNum (string, base, digits){
	if (base <= 36) return parseFloat(string, base);
  var n = 0, sign = 1;
  digits = digits || raw_digits;
  base = base || 60;
  if (string[0] === '-'){
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

function genNum(n,radix) {
	if (radix <= 36) return n.toString(radix);
  if (radix === (void 0)) radix = 60;
  var pow = 0;
  while (n%1){
    n *= radix;
    pow++;
  }
 var num="", q=Math.floor(Math.abs(n)), r;
 do {
  r=q%radix;
  num = raw_digits.charAt(r)
       + num;
  q=(q-r)/radix;
} while(q);
 if (pow){
   num = num.split('');
   num.splice(-pow,0,'.');
   num = num.join('');
 }
 return ((n<0) ? "-"+num : num);
}

function logn (base, number){
  return Math.log2(number) / Math.log2 (base);
}
function parse_tokens (string){
  var out = [], quote = '', quotes = ["'", '"', '`', "#"], i,j;
  if (string.last !== '\n') string += '\n';
  for (j = string[i = 0]; i < string.length; j = string[++i]){
    var escaped = string[i - 1] === '\\';
    if (quote === "#"){
      if ((~raw_digits.indexOf(j) && ~raw_digits.concat(["#"]).indexOf(out.last.last)) || out.last.length === 1){
        out.last += j;
      } else if (j === "#"){
        out.push('');
        out.last += j;
      } else if (j === ";"){
        quote = '';
      } else {
        quote = '';
        i--;
      }
    } else {
      if (!quote && (~quotes.indexOf(j)) && !escaped){
        quote = j;
        out.push('');
      } else if (j === quote && !escaped){
      } else if (j === '\n' && quote && !escaped){
        out.last += quote;
        quote = '';
      }
      if (quote){
        out.last += j.replace(/ /g,'™');
        if (quote === "'" && quote !== j) out.last += quote, quote = '';
        if (out.last.length > 1 && j === quote) quote = '';
      } else {
        out.push(j);
      }
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
    <title>PlatyPar</title>
    </head>
    <body>
    <button style='font-family:andale-mono, consolas, menlo, monospace class='box' id='run' onclick='run_main()'>Run</button><br>
    <pre>${script}</pre><script>${script}</script>
    </body>`
  );
}

function compile_long (raw){
  var out = `var $, log =[];
function stdargs (){
  return eval ('[' + stdin() + ']');
}
function type (x){
	return Object.prototype.toString.call(x).slice(8,-1);
}
function mul (a,b){
	switch ([type (a), type (b)].join (', ')){
		case "Number, Number":
			return a * b;
		case "String, Number":
		case [Array, Number]:
			return repeat (a, b);
		case [Array, Array]:
			return cartesian (a , b);
		default:
			return a * b;
	}
}
function repeat (list, n){
	var out = [];
	for (var i = 0; i < n; i++){
		out = out.concat (list);
	}
	return out;
}
function stdin (){
  return prompt ('Input');
}
function stdout (string){
  return confirm(string) && [string];
}
function stdraw (string){
  return stdout(JSON.stringify(string));
}
function run_main (){
  stdout (main (stdargs ())) && window.close ();
}
function charCode (x){
	var out;
	if (typeof x === 'number') return [String.fromCharCode (x)];
	else if (typeof x === 'string' && x.length === 1) return [x.charCodeAt()];
	else {
		out = Array(x.length);
		for (var i = 0; i < x.length; i++){
			out[i] = charCode (x[i])[0];
		}
	}
	return out;
}
function shuffle (array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
}
function main (_stack){
  var stack = window.__stack = _stack, newstack, stacks=[_stack];
  log = [];
  log.push(stringify(stack));
  function usestack(newstack){
    stacks.push(newstack);
    stack = newstack;
  }
	function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
}
  function display(list){
    var out = [];
    for(var i = 0; i < list.length;i++){
      item = list[i];
      item = item.replace(/\\n/g, '');
      if (out[out.length-1] !== item) out.push(item)
    }
    return out.join('\\n');
  }
  ${stringify}
	function iterate (i){
		if (typeof i === 'number') return range (0, i-1);
		if (typeof i === 'object') return Object.create (i);
		return Array (...i);
	}
  function range(a,b){
    if (~[typeof a, typeof b].indexOf('string')){
      if (typeof a === 'string') a = a.charCodeAt();
      if (typeof b === 'string') b = b.charCodeAt();
      var out = range(a,b);
      for (var i = 0; i < out.length; i++) out[i] = String.fromCharCode(out[i]);
    } else {
      var out = [];
      while (a <= b) out.push(a++);
    }
    return out;
  }\n`;
  var indent_level = 1, indents = [], tokens = raw.split(/\s+/);
  tokens = tokens.map(s => s.replace('™', ' '));
  window.tokens = tokens;
  window.raw = raw;
  const ops = {
    "add" : "$ + $",
    "sub" : "$ - $",
    "div" : "$ / $",
    "mul" : "mul ($,$)",
    "exp" : "Math.pow($,$)",
    "mod" : "mod($,$)",
    "global" : "stacks[0]",
    "meta" : "stacks[stacks.length-2]",
    "this" : "stacks[stacks.length-1]",
    "use" : "usestack ($)",
    "main" : "main ($)",
    "dec" : "$ - 1",
    "inc" : "$ + 1",
    "copy" : "#",
    "dupe" : "stack[stack.length-2], stack[stack.length-1]",
    "more" : "$ >= $",
    "less" : "$ < $",
    "or" : "$ | $",
    "and" : "$ & $",
    "xor" : "$ ^ $",
    "bitleft" : "$ << $",
    "bitright" : "$ >> $",
    "del" : "($,$)",
    "equal" : "$ === $",
    "range" : "range($, $)",
    "rangex" : "range($-1, $)",
    "boolnot" : "!$",
    "booland" : "$ && $",
    "boolor" : "$ || $",
    "length" : "$.length",
    "lower" : "$.toLowerCase()",
    "upper" : "$.toUpperCase()",
    "randint" : "Math.floor(Math.random() * $)",
    "random" : "Math.random()",
    "cart" : "cartesian($,$)",
    "rotate" : "rotate ($)",
    "sum" : "$.reduce ((x,y) => x + y)",
    "prod" : "$.reduce((x,y) => x * y)",
    "encap" : "[$]",
    "encap2" : "[$,$]",
    "flatten" : "flatten($)",
    "shallow" : "flatten_shallow($)",
    "string" :  "String($)",
    "string_radix" : "$.toString($)",
    "number" : "Number($)",
    "number_radix" : "parseFloat($, $)",
    "prop" : "$[$]",
    "left" : "stack.shift()",
		"index" : "$.indexOf ($)",
		"code" : "charCode($)",
		"string" : "$.toString ()",
		"string_radix" : "$.toString ($)",
		"number" : "Number ($)",
		"number_radix": "parseInt ($, $)"
  };
  const cmd = {
    "swap" : "var a = $, b = $; stack.push(b,a)",
    "shuffle" : "shuffle (stack)",
    "end" : "}",
    "fold" : "while (stack.length > 1){",
    "if" : "if($){",
    "else" : "} else {",
    "while" : "while($){",
    "dowhile" : "while(#){",
    "{" : 'usestack([])',
    "}" : "stacks[stacks.length-2].push(stack); stacks.pop(); stack = stacks[stacks.length-1]",
    "repeat" : "for (var i=0, j=$; i < j;i++){",
    "swap" : "stacks[stacks.length-1]=stack=stack.reverse()",
    "right" : "stack.unshift($)",
    "remove" : "var list=$;list.splice(list.indexOf($),1);stack.push(list)",
    "expand" : "var list = $; for(var i=0;i< list.length; i++) stack.push(list[i])",
    "reverse" : "stack.reverse()",
    "pop" : "$",
    "shift" : "stack.shift()",
    "index" : "var item = $; stack.push ($.indexOf(item))",
    "interp" : "var list = $; list.push($)",
		"map" : "for (var i = 0, iter = iterate ($); i < iter.length; i++){\nstack.push (iter[i])"
  };
  const stdio = {
    "print" : "stdout(#)",
    "input" : "stdin()",
    "raw_input" : "stdargs()",
    "raw_print" : "stdraw(#)",
    "output" : "stdout($)",
    "raw_output" : "stdraw($)"
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
    write('stack.push(' + string + ');');
  }
  function block (string){
    write('var stdval = ' + string + ';\
    if (stdval);\
    else return "Bye!"');
  }
  function outdent () {
    indent_level--;
    out += indents [indent_level] || '}';
    indents [indent_level] = '}';
  }
  function exp (string, state){
    string = string.replace(/#/g, 'stack[stack.length-1]');
    var len = string.match(/\$/g);
    if (len) len = len.length;
    else return string;
    string = string.replace(/\$/g,"@");
    if (!state){
      string = `(($ = stack.splice(-${len}, ${len})),(` + string;
    } else {
      string = `$ = stack.splice(-${len}, ${len}); ${string}`
    }
    for (var i = 0; i < len; i++){
      string = string.replace (/\@/, '$[' + i + ']');
    }
    if (!state) string += '))';
    return string;
  }
  function beautify (code) {
    code = code.split(/[\n]/g);
    var level = 0;
    for (var i = 0; i < code.length; i++){
      let token = code[i].replace(/\s/g, '');
      if (token.last === '{') level++;
      else if (token.last === '}') level--;
      else if (token.last === ';');
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
      write(exp(cmd[token], true));
    }
    else if (token in stdio) block(exp(stdio[token], true));
    else push(token);
    if (debug) out += 'log.push(stringify(stack));\n'
  }
  while (indent_level > 1) outdent ();
  write('console.log(display(log));\nreturn stack.pop();\n}\ndocument.getElementById("run").focus()');
  return beautify(out);
}
function compile_par (raw) {
  var ops = {
    "+" : "add",
    "-" : "sub",
    "*" : "mul",
    "/" : "div",
    "%" : "mod",
    "^" : "exp",
    "#^" : "xor",
    "|" : "or",
    "&" : "and",
    "#!" : "not",
    "#(" : "bitleft",
    "#)" : "bitright",
    ">" : "more",
    "<" : "less",
    "=" : "equal",
    "#>" : "max",
    "#<" : "min",
    "#|" : "boolor",
    "#&" : "booland",
    "!" : "boolnot",
    "H" : "inc",
    "T" : "dec",
    "~" : "randint",
		"#?" : "randint",
    "#%" : "random",
    "P" : "cart",
    "_" : "range",
    "R" : "rotate",
    "p" : "prod",
    "s" : "sum",
    "j" : "interp",
    "J" : "encap",
    "y" : "flatten",
    "Y" : "shallow",
    "K" : "prop",
    "k" : "index",
    "u" : "code",
    "l" : "length",
    "#$" : "shuffle",
    "d" : "pop",
    "." : "reverse",
    "," : "swap",
    "(" : "left",
    ")" : "right",
    "c" : "copy",
    "C" : "dupe",
    "{" : "{",
    "}" : "}",
    ":" : "read",
    "@" : "write",
    "e" : "encap",
    "E" : "encap2",
    "G" : "global",
    "q" : "input",
    "Q" : "raw_input",
    "o" : "raw_output",
    "O" : "output",
    "a" : "raw_print",
    "A" : "print",
    "F" : "fold",
    "M" : "map",
    "?" : "if",
    "\\" : "else",
    "W" : "while",
    "w" : "dowhile",
    "N" : "number",
    "n" : "number_radix",
    "S" : "string",
    "#'" : "string_radix",
    "$" : "global",
    ";" : "end",
    "x" : "remove",
    "X" : "expand",
		"L" : "lower",
		"U" : "upper"
  };
  var out = '', tokens = parse_tokens(raw);
  for (var i = 0; i < tokens.length; i++){
    let token = tokens[i];
    if (token in ops){
      out += ops[token];
    } else if (token[0] === '#'){
      var parts = token.slice(1).replace(/z/g, '.').split('y').map($ => String(parseNum ($, 60))).join('e');
      out += parts;
    } else {
      out += token;
    }
    out += ' ';
  }
  return out.slice(0,-1);
}
function compile_program (){
  runScript (compile_long(mainbox.innerText));
}

function rawupdate(){
  const raw = rawbox.value;
  const compiled = compile_par(raw);
  mainbox.innerText = compiled.replace(/™/g, ' ');
}

function edit_program (){
  const newprogram = prompt(mainbox.innerText);
  if (newprogram) mainbox.innerText = newprogram;
}

function stringify (iter, used){
  used = used || [];
  var out = '';
  for (var i = 0; i < iter.length; i++){
    if (typeof iter[i] === 'string'){
      if (iter[i].length === 1){
        out += "'" + iter[i];
      } else if (iter[i].length === 0){
        out += "''";
      } else {
        out += `"${iter[i]}"`;
      }
    } else if (typeof iter[i] === 'object'){
      if (~used.indexOf(iter[i])){
        out += '<stack>';
      } else {
        used.push(iter[i]);
        out += '\n[' + stringify(iter[i], used) + ']';
      }
    } else {
      out += String(iter[i]);
    }
    out += ' ';
  }
  return out.slice(0,-1);
}
