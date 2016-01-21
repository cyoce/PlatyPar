"use strict";

var _temporalUndefined = {};

function _temporalAssertDefined(val, name, undef) { if (val === undef) { throw new ReferenceError(name + " is not defined - temporal dead zone"); } return true; }

function _typeof(obj) { return obj && obj.constructor === Symbol ? "symbol" : typeof obj; }

function main() {
	"use strict";

	var raw_digits = _temporalUndefined;

	var noesc = _temporalUndefined;
	var mod = _temporalUndefined;
	var mainbox = _temporalUndefined;

	var linkbox = _temporalUndefined;
	var rawbox = _temporalUndefined;

	var last_obj = _temporalUndefined;
	var debug = true;raw_digits = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var l = [];
	for (var i = 32; i < 127; i++) {
		var c = _temporalUndefined;
		c = String.fromCharCode(_temporalAssertDefined(i, "i", _temporalUndefined) && i);
		if ((_temporalAssertDefined(c, "c", _temporalUndefined) && c) === escape(_temporalAssertDefined(c, "c", _temporalUndefined) && c)) l.push(_temporalAssertDefined(c, "c", _temporalUndefined) && c);
	}noesc = l.join('');

	mod = function mod(x, y) {
		return (x % y + y) % y;
	};

	mainbox = document.getElementById('main');
	(_temporalAssertDefined(mainbox, "mainbox", _temporalUndefined) && mainbox).focus();linkbox = document.getElementById('linkbox');
	rawbox = document.getElementById('raw');
	var query = parse_query(location.href);
	if (query && query.code) {
		(_temporalAssertDefined(rawbox, "rawbox", _temporalUndefined) && rawbox).value = query.code;
	}
	var time = Math.floor(new Date() / 1e3);
	if (query === null) query = {};
	if (query.date === void 0 || time - parseNum(query.date, 62) > 20) {
		query.date = genNum(time, 62);
		location.href = applyquery(query);
	}

	function applyquery(query, href) {
		href = href || location.href;
		href = href.split("?")[0];
		return href + gen_query(query);
	}

	$("#getlink").click(codelink_get);
	function codelink_get() {
		var q = gen_query({
			code: (_temporalAssertDefined(rawbox, "rawbox", _temporalUndefined) && rawbox).value
		});
		(_temporalAssertDefined(linkbox, "linkbox", _temporalUndefined) && linkbox).value = 'https://rawgit.com/cyoce/PlatyPar/master/page.html' + q;
		(_temporalAssertDefined(linkbox, "linkbox", _temporalUndefined) && linkbox).focus();
		return q;
	}

	$("#markgen").click(markdown_gen);
	function markdown_gen() {
		(_temporalAssertDefined(mainbox, "mainbox", _temporalUndefined) && mainbox).innerText = "\n# [PlatyPar](https://github.com/cyoce/PlatyPar), " + String((_temporalAssertDefined(rawbox, "rawbox", _temporalUndefined) && rawbox).value.length) + " bytes\n\n    " + String((_temporalAssertDefined(rawbox, "rawbox", _temporalUndefined) && rawbox).value) + "\n\n[Try it online](" + String(codelink_get()) + ")!\n";
	}

	function codelink_open() {
		window.open((_temporalAssertDefined(linkbox, "linkbox", _temporalUndefined) && linkbox).value);
	}

	function parse_query(href) {
		href = String(href).split("?");
		if (href.length <= 1) return null;
		href = href[1];
		var out = {};
		var keys = href.split("&");
		for (var i = 0; i < keys.length; i++) {
			var pair = _temporalUndefined;
			pair = keys[i].split('=');
			out[unescape((_temporalAssertDefined(pair, "pair", _temporalUndefined) && pair)[0])] = unescape((_temporalAssertDefined(pair, "pair", _temporalUndefined) && pair)[1]);
		}
		return out;
	}

	function gen_query(obj) {
		if (obj === null || obj === Object.create(null)) return '';
		var out = '?';
		for (var key in obj) {
			if (!obj.hasOwnProperty(key)) continue;
			if (out.length !== 1) out += "&";
			out += escape(key) + "=" + escape(obj[key]);
		}
		return out;
	}

	Array.prototype.remove = function () {
		for (var i = 0; i < arguments.length; i++) {
			var index = _temporalUndefined;
			index = this.indexOf(arguments[i]);
			if (~(_temporalAssertDefined(index, "index", _temporalUndefined) && index)) this.splice(_temporalAssertDefined(index, "index", _temporalUndefined) && index, 1);
		}
		return this;
	};last_obj = {
		get: function get() {
			return this[this.length - 1];
		},
		set: function set(v) {
			this[this.length - 1] = v;
		}
	};
	Object.defineProperty(Array.prototype, 'last', _temporalAssertDefined(last_obj, "last_obj", _temporalUndefined) && last_obj);
	Object.defineProperty(String.prototype, 'last', _temporalAssertDefined(last_obj, "last_obj", _temporalUndefined) && last_obj);

	function parseNum(string, base, digits, dot, neg) {
		var n = 0,
		    sign = 1;
		if (base <= 36 && !digits) return parseInt(string, base);
		digits = digits || _temporalAssertDefined(raw_digits, "raw_digits", _temporalUndefined) && raw_digits;
		base = base || 60;
		if (string[0] === neg) {
			string = string.slice(1);
			sign = -1;
		}
		var strings = string.split(dot);
		string = strings[0];
		for (var i = 0, j = string.length - 1; i < string.length; i++, j--) {
			var index = _temporalUndefined;
			var pow = _temporalUndefined;
			index = (_temporalAssertDefined(mod, "mod", _temporalUndefined) && mod)(digits.indexOf(string[_temporalAssertDefined(i, "i", _temporalUndefined) && i]), base);
			pow = Math.pow(base, _temporalAssertDefined(j, "j", _temporalUndefined) && j);
			n += (_temporalAssertDefined(index, "index", _temporalUndefined) && index) * (_temporalAssertDefined(pow, "pow", _temporalUndefined) && pow);
		}
		if (strings[1]) n += parseNum(strings[1]) * Math.pow(base, -strings[1].length);
		return n * sign;
	}

	function genNum(n, radix, digits) {
		digits = digits || _temporalAssertDefined(raw_digits, "raw_digits", _temporalUndefined) && raw_digits;
		if (radix <= 36 && radix >= 2 && !digits) return n.toString(radix);
		if (radix === void 0) radix = 60;
		var pow = 0;
		while (n % 1) {
			n *= radix;
			pow++;
		}
		var num = "",
		    q = Math.floor(Math.abs(n)),
		    r;
		do {
			r = q % radix;
			num = digits.charAt(r) + num;
			q = (q - r) / radix;
		} while (q);
		if (pow) {
			num = num.split('');
			num.splice(-pow, 0, '.');
			num = num.join('');
		}
		return n < 0 ? "-" + num : num;
	}

	function logn(base, number) {
		return Math.log2(number) / Math.log2(base);
	}

	function parse_tokens(string) {
		var out = [],
		    quote = '',
		    quotes = ["'", '"', '`', "#"],
		    i,
		    j;
		if (string.last !== '\n') string += '\n';
		for (j = string[i = 0]; i < string.length; j = string[++i]) {
			var escaped = string[i - 1] === '\\' && quote;
			if (quote === "#") {
				if (~(_temporalAssertDefined(raw_digits, "raw_digits", _temporalUndefined) && raw_digits).indexOf(j) && ~(_temporalAssertDefined(raw_digits, "raw_digits", _temporalUndefined) && raw_digits).concat(["#"]).indexOf(out.last.last) || out.last.length === 1) {
					out.last += j;
				} else if (j === "#") {
					out.push('');
					out.last += j;
				} else if (j === ";") {
					quote = '';
				} else {
					quote = '';
					i--;
				}
			} else {
				if (!quote && ~quotes.indexOf(j) && !escaped) {
					quote = j;
					out.push('');
				} else if (j === quote && !escaped) {} else if (j === '\n' && quote && !escaped) {
					out.last += quote;
					quote = '';
				}
				if (quote) {
					out.last += j.replace(/ /g, '™');
					if (quote === "'" && out.last.length > 1) out.last += quote, quote = '';
					if (out.last.length > 1 && j === quote) quote = '';
				} else {
					out.push(j);
				}
			}
		}
		if (out.last === '\n') out = out.slice(0, out.length - 1);
		console.trace(out, ">>><<<");
		return out;
	}

	function compare(number) {
		var numstring = _temporalUndefined;
		numstring = genNum(number);
		console.log(number, _temporalAssertDefined(numstring, "numstring", _temporalUndefined) && numstring);
		return _temporalAssertDefined(numstring, "numstring", _temporalUndefined) && numstring;
	}

	function runScript(script, debug) {
		window.open().document.write("\n    <head>\n    <link rel='stylesheet' href='style.css'>\n    <title>PlatyPar</title>\n    </head>\n    <body>\n    <button style='font-family:andale-mono, consolas, menlo, monospace class='box' id='run' onclick='run_main()'>Run</button><br>\n    <pre>" + String(script) + "</pre><script>" + String(script) + "</script>\n    </body>");
	}

	function compile_long(raw) {
		var ops = _temporalUndefined;
		var cmd = _temporalUndefined;
		var stdio = _temporalUndefined;

		var out = "var $, log =[];\nfunction stdargs (){\n  return eval ('[' + stdin() + ']');\n}\nfunction type (x){\n\treturn Object.prototype.toString.call(x).slice(8,-1);\n}\nfunction add (a,b){\n\treturn a + b;\n}\nfunction minus (a,b){\n\treturn a - b;\n}\nfunction divideArray (list, n){\n  out = Array(n);\n  for (var i = 0; i < list.length;i++){\n    idx = Math.floor (i / (list.length/n));\n    if (! out [idx]) out [idx] = [];\n    out [idx].push (list [i])\n  }\n  return out;\n}\nfunction div (a,b) {\n\tif (type (a) === 'Array' || type (a) === 'String'){\n\t\treturn divideArray (a,b);\n\t}\n\treturn a / b;\n}\nfunction mul (a,b){\n\tswitch ([type (a), type (b)].join (', ')){\n\t\tcase \"Number, Number\":\n\t\t\treturn a * b;\n\t\tcase \"String, Number\":\n\t\tcase \"Array, Number\":\n\t\t\treturn repeat (a, b);\n\t\tcase \"Array, Array\":\n\t\t\treturn cartesian (a , b);\n\t\tdefault:\n\t\t\treturn a * b;\n\t}\n}\nfunction repeat (list, n){\n\tvar out = [];\n\tfor (var i = 0; i < n; i++){\n\t\tout = out.concat (list);\n\t}\n\tif (typeof list === 'string') return out.join('');\n\treturn out;\n}\nfunction stdin (){\n  return prompt ('Input');\n}\nfunction stdout (string){\n  return confirm(string) && [string];\n}\nfunction stdraw (string){\n  return stdout(JSON.stringify(string));\n}\nfunction run_main (){\n  stdout (main (stdargs ())) && window.close ();\n}\nfunction charCode (x){\n\tvar out;\n\tif (typeof x === 'number') return [String.fromCharCode (x)];\n\telse if (typeof x === 'string' && x.length === 1) return [x.charCodeAt()];\n\telse {\n\t\tout = Array(x.length);\n\t\tfor (var i = 0; i < x.length; i++){\n\t\t\tout[i] = charCode (x[i])[0];\n\t\t}\n\t}\n\treturn out;\n}\nfunction shuffle (array) {\n  var m = array.length, t, i;\n  while (m) {\n    i = Math.floor(Math.random() * m--);\n    t = array[m];\n    array[m] = array[i];\n    array[i] = t;\n  }\n}\nfunction main (_stack){\n  var stack = window.__stack = _stack, newstack, stacks=[_stack];\n  log = [];\n  log.push(stringify(stack));\n  function usestack(newstack){\n    stacks.push(newstack);\n    stack = newstack;\n  }\n\tfunction shuffle(array) {\n  var m = array.length, t, i;\n  while (m) {\n    i = Math.floor(Math.random() * m--);\n    t = array[m];\n    array[m] = array[i];\n    array[i] = t;\n  }\n}\n  function display(list){\n    var out = [];\n    for(var i = 0; i < list.length;i++){\n      item = list[i];\n      item = item.replace(/\\n/g, '');\n      if (out[out.length-1] !== item) out.push(item)\n    }\n    return out.join('\\n');\n  }\n\tfunction type (x){\n\t\treturn Object.prototype.toString.call (x).slice (8, -1)\n\t}\n\tfunction str (x){\n\t\tif (type (x) === 'Array') return x.join ('');\n\t\treturn String (x);\n\t}\n\tfunction cart() {\n  return Array.prototype.reduce.call(arguments, function(a, b) {\n    var ret = [];\n    [...a].forEach(function(a) {\n      [...b].forEach(function(b) {\n        ret.push(a.concat([b]));\n      });\n    });\n    return ret;\n  }, [[]]);\n}\n  " + String(stringify) + "\n\tfunction iterate (i){\n\t\tif (typeof i === 'number') return range (0, i-1);\n\t\tif (typeof i === 'object') return Object.create (i);\n\t\treturn Array (...i);\n\t}\n\tfunction mod (a,b){\n\t\treturn ((a%b)+b)%b;\n\t}\n  function range(a,b){\n    if (~[typeof a, typeof b].indexOf('string')){\n      if (typeof a === 'string') a = a.charCodeAt();\n      if (typeof b === 'string') b = b.charCodeAt();\n      var out = range(a,b);\n      for (var i = 0; i < out.length; i++) out[i] = String.fromCharCode(out[i]);\n    } else {\n      var out = [];\n      while (a <= b) out.push(a++);\n    }\n    return out;\n  }\n";
		console.log(raw);
		var indent_level = 1,
		    indents = [],
		    tokens = raw.split(/\s+/);
		console.log(tokens);
		tokens = tokens.map(function (s) {
			return s.replace(/™/g, ' ');
		});
		window.tokens = tokens;
		window.raw = raw;ops = {
			"add": "add ($, $)",
			"sub": "minus ($, $)",
			"div": "div ($,$)",
			"mul": "mul ($,$)",
			"exp": "Math.pow($,$)",
			"mod": "mod($,$)",
			"global": "stacks[0]",
			"meta": "stacks[stacks.length-2]",
			"this": "stacks[stacks.length-1]",
			"use": "usestack ($)",
			"main": "main ($)",
			"dec": "$ - 1",
			"inc": "$ + 1",
			"copy": "#",
			"dupe": "stack[stack.length-2], stack[stack.length-1]",
			"more": "$ >= $",
			"less": "$ < $",
			"or": "$ | $",
			"and": "$ & $",
			"xor": "$ ^ $",
			"bitleft": "$ << $",
			"bitright": "$ >> $",
			"del": "($,$)",
			"equal": "$ === $",
			"range": "range($, $)",
			"rangex": "range($-1, $)",
			"boolnot": "!$",
			"booland": "$ && $",
			"boolor": "$ || $",
			"length": "$.length",
			"lower": "$.toLowerCase()",
			"upper": "$.toUpperCase()",
			"randint": "Math.floor(Math.random() * $)",
			"random": "Math.random()",
			"cart": "cart($,$)",
			"rotate": "rotate ($)",
			"sum": "$.reduce ((x,y) => x + y)",
			"prod": "$.reduce((x,y) => x * y)",
			"encap": "[$]",
			"encap2": "[$,$]",
			"flatten": "flatten($)",
			"shallow": "flatten_shallow($)",
			"string": "str ($)",
			"string_radix": "$.toString($)",
			"number": "Number($)",
			"number_radix": "parseFloat($, $)",
			"prop": "$[$]",
			"left": "stack.shift()",
			"index": "$.indexOf ($)",
			"code": "charCode($)",
			"string": "$.toString ()",
			"string_radix": "$.toString ($)",
			"number": "Number ($)",
			"number_radix": "parseInt ($, $)",
			"sort": "[...$].sort ()",
			"join": "$.join ($)"
		};
		cmd = {
			"swap": "var a = $, b = $; stack.push(b,a)",
			"shuffle": "shuffle (stack)",
			"end": "}",
			"fold": "while (stack.length > 1){",
			"if": "if($){",
			"else": "} else {",
			"while": "while($){",
			"dowhile": "while(#){",
			"{": 'usestack([])',
			"}": "stacks[stacks.length-2].push(stack); stacks.pop(); stack = stacks[stacks.length-1]",
			"repeat": "for (var i=0, j=$; i < j;i++){",
			"swap": "stacks[stacks.length-1]=stack=stack.reverse()",
			"right": "stack.unshift($)",
			"remove": "var list=$;list.splice(list.indexOf($),1);stack.push(list)",
			"expand": "var list = $; for(var i=0;i< list.length; i++) stack.push(list[i])",
			"reverse": "stack.reverse()",
			"pop": "$",
			"shift": "stack.shift()",
			"index": "var item = $; stack.push ($.indexOf(item))",
			"interp": "var list = $; list.push($)",
			"map": "for (var i = 0, iter = iterate ($); i < iter.length; i++){\nstack.push (iter[i])"
		};
		stdio = {
			"print": "stdout(#)",
			"input": "stdin()",
			"raw_input": "stdargs()",
			"raw_print": "stdraw(#)",
			"output": "stdout($)",
			"raw_output": "stdraw($)"
		};
		function write(string) {
			if (string[0] === '}') {
				outdent();
				string = string.slice(1);
			}
			out += String('  '.repeat(indent_level) + string) + "\n";
			if (string.last === '}') {
				outdent();
				string = string.slice(0, string.length - 1);
			}
			if (string.last === '{') indent_level++;
		}

		function push(string) {
			write('stack.push(' + string + ');');
		}

		function block(string) {
			write('var stdval = ' + string + ';\
    if (stdval);\
    else return "Bye!"');
		}

		function outdent() {
			indent_level--;
			out += indents[indent_level] || '}';
			indents[indent_level] = '}';
		}

		function exp(string, state) {
			string = string.replace(/#/g, 'stack[stack.length-1]');
			var len = string.match(/\$/g);
			if (len) len = len.length;else return string;
			string = string.replace(/\$/g, "@");
			if (!state) {
				string = "(($ = stack.splice(-" + String(len) + ", " + String(len) + ")),(" + string;
			} else {
				string = "$ = stack.splice(-" + String(len) + ", " + String(len) + "); " + String(string);
			}
			for (var i = 0; i < len; i++) {
				string = string.replace(/\@/, '$[' + i + ']');
			}
			if (!state) string += '))';
			return string;
		}

		function beautify(code) {
			code = code.split(/[\n]/g);
			var level = 0;
			for (var i = 0; i < code.length; i++) {
				var token = _temporalUndefined;
				token = code[i].replace(/\s/g, '');
				if ((_temporalAssertDefined(token, "token", _temporalUndefined) && token).last === '{') level++;else if ((_temporalAssertDefined(token, "token", _temporalUndefined) && token).last === '}') level--;else if ((_temporalAssertDefined(token, "token", _temporalUndefined) && token).last === ';') ;
				if ((_temporalAssertDefined(token, "token", _temporalUndefined) && token).length > 0 && (_temporalAssertDefined(token, "token", _temporalUndefined) && token)[0] === '}') level--;
				code[i] += '\n';
				if (level > 0) code[i] += '  '.repeat(level);
			}
			return code.join('');
		}
		for (var i = 0; i < tokens.length; i++) {
			var token = _temporalUndefined;
			token = tokens[i];
			if ((_temporalAssertDefined(token, "token", _temporalUndefined) && token) in (_temporalAssertDefined(ops, "ops", _temporalUndefined) && ops)) push(exp((_temporalAssertDefined(ops, "ops", _temporalUndefined) && ops)[_temporalAssertDefined(token, "token", _temporalUndefined) && token]));else if ((_temporalAssertDefined(token, "token", _temporalUndefined) && token) in (_temporalAssertDefined(cmd, "cmd", _temporalUndefined) && cmd)) {
				write(exp((_temporalAssertDefined(cmd, "cmd", _temporalUndefined) && cmd)[_temporalAssertDefined(token, "token", _temporalUndefined) && token], true));
			} else if ((_temporalAssertDefined(token, "token", _temporalUndefined) && token) in (_temporalAssertDefined(stdio, "stdio", _temporalUndefined) && stdio)) block(exp((_temporalAssertDefined(stdio, "stdio", _temporalUndefined) && stdio)[_temporalAssertDefined(token, "token", _temporalUndefined) && token], true));else push(_temporalAssertDefined(token, "token", _temporalUndefined) && token);
			if (debug) out += 'log.push(stringify(stack));\n';
		}
		while (indent_level > 1) outdent();
		write('console.log(display(log));\nreturn stack.pop();\n}\ndocument.getElementById("run").focus()');
		return beautify(out);
	}

	function compile_par(raw) {
		var ops = {
			"+": "add",
			"-": "sub",
			"*": "mul",
			"/": "div",
			"%": "mod",
			"^": "exp",
			"#^": "xor",
			"|": "or",
			"&": "and",
			"#!": "not",
			"#(": "bitleft",
			"#)": "bitright",
			">": "more",
			"<": "less",
			"=": "equal",
			"#>": "max",
			"#<": "min",
			"#|": "boolor",
			"#&": "booland",
			"!": "boolnot",
			"H": "inc",
			"T": "dec",
			"~": "randint",
			"#?": "randint",
			"#%": "random",
			"P": "cart",
			"_": "range",
			"R": "rotate",
			"p": "prod",
			"s": "sum",
			"j": "interp",
			"J": "encap",
			"y": "flatten",
			"Y": "shallow",
			"K": "prop",
			"k": "index",
			"u": "code",
			"l": "length",
			"#$": "shuffle",
			"d": "pop",
			".": "reverse",
			",": "swap",
			"(": "left",
			")": "right",
			"c": "copy",
			"C": "dupe",
			"{": "{",
			"}": "}",
			":": "read",
			"@": "write",
			"e": "encap",
			"E": "encap2",
			"G": "global",
			"q": "input",
			"Q": "raw_input",
			"o": "raw_output",
			"O": "output",
			"a": "raw_print",
			"A": "print",
			"F": "fold",
			"M": "map",
			"?": "if",
			"\\": "else",
			"W": "while",
			"w": "dowhile",
			"N": "number",
			"n": "number_radix",
			"S": "string",
			"#'": "string_radix",
			"$": "global",
			";": "end",
			"x": "remove",
			"X": "expand",
			"L": "lower",
			"U": "upper",
			"#_": "sort",
			"#+": "join"
		};
		var out = '',
		    tokens = parse_tokens(raw);
		for (var i = 0; i < tokens.length; i++) {
			var token = _temporalUndefined;
			token = tokens[i];
			if ((_temporalAssertDefined(token, "token", _temporalUndefined) && token) in ops) {
				out += ops[_temporalAssertDefined(token, "token", _temporalUndefined) && token];
			} else if ((_temporalAssertDefined(token, "token", _temporalUndefined) && token)[0] === '#') {
				var parts = (_temporalAssertDefined(token, "token", _temporalUndefined) && token).slice(1).replace(/z/g, '.').split('y').map(function ($) {
					return String(parseNum($, 60));
				}).join('e');
				out += parts;
			} else {
				out += _temporalAssertDefined(token, "token", _temporalUndefined) && token;
			}
			out += ' ';
		}
		return out.slice(0, -1);
	}

	$("#compile").click(compile_program);
	function compile_program() {
		runScript(compile_long(compile_par((_temporalAssertDefined(rawbox, "rawbox", _temporalUndefined) && rawbox).value)));
	}

	setTimeout(rawupdate);
	$("#raw").change(rawupdate);
	function rawupdate() {
		var raw = _temporalUndefined;
		var compiled = _temporalUndefined;
		raw = (_temporalAssertDefined(rawbox, "rawbox", _temporalUndefined) && rawbox).value;
		compiled = compile_par(_temporalAssertDefined(raw, "raw", _temporalUndefined) && raw);
		(_temporalAssertDefined(mainbox, "mainbox", _temporalUndefined) && mainbox).innerText = (_temporalAssertDefined(compiled, "compiled", _temporalUndefined) && compiled).replace(/™/g, ' ');
	}

	function stringify(iter, used) {
		used = used || [];
		var out = '';
		for (var i = 0; i < iter.length; i++) {
			if (typeof iter[i] === 'string') {
				if (iter[i].length === 1) {
					out += "'" + iter[i];
				} else if (iter[i].length === 0) {
					out += "''";
				} else {
					out += "\"" + String(iter[i]) + "\"";
				}
			} else if (_typeof(iter[i]) === 'object') {
				if (~used.indexOf(iter[i])) {
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
		return out.slice(0, -1);
	}
}
$(document).ready(main);
