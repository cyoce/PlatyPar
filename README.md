# PlatyPar

PlatyPar is a golfing language that compiles to JavaScript, similarly to CoffeeScript. It was made for code-golfing, mainly on [SE](http://codegolf.stackexchange.com). Unlike most conventional languages, it is stack-oriented, which leads to interesting benefits and side-effects. 

## Infix notation
One important distinction is that while any practical language, uses **infix notation**, PlatyPar uses **postfix notation**.
This means that for a given operation, let's say `+`, you would put it **in**between (as in **in**fix), i.e. `a+b`. This can be read as "a plus b".
However, PlatyPar uses postfix notation, i.e. `ab+`. This can be read as "a, b, add", or if you prefer a pseudo-code approach, `[a,b].add`.
There is an important tradeoff here. Consider the following infix expression:
`a+b*c`
If you are familiar with PEMDAS, you will know that that _should_ evaluate to `a+(b*c)`. 

But what if you want to express `(a+b)*c`? You can't do it without parentheses. In postfix notation, both could be expressed _without parens_.
The postfix equivalents of those two would be `abc*+` and `ab+c*`. This is a huge advantage, as it not only saves you space by not needing to use `()`, but it also makes this harder to read, making distinguishing noobs from pros such as yourself a trivial task.
There is, however, a drawback: with postfix notation, every operator has an **arity**, or amount of operands it can take. While infix notation can have different arities, for example `-a` means the negation of `a` and `a-b` means the difference of `a` and `b`, postfix has a fixed arity, so `-` can **only** mean `a-b`. 

## Stack-oriented
Under the hood, PlatyPar is stack-oriented: all operations apply transformations to the stack. This is the only form of memory. It can be thought of this way: the only variable you can manipulate is an array.
PlatyPar translates each character into a command. For example, in our previous example `(2+3)*4`, we write this:
```javascript
23+4*
```
Since every character is treated separately, **including numbers**, this is parsed as:
```javascript
push 2
push 3
add
push 4
multiply
```

This may be confusing, so I'll demonstrate what's going on behind the scenes:
```javascript
   :: []
2  :: [2]
3  :: [2 3]
+  :: [2+3] => [5]
4  :: [5 4]
*  :: [5*4] => [20]
```

Here's the interesting part: at the beginning of the program, PlatyPar always asks for input! All input (`,` separated) is pushed to the stack! So to find the the sum of two input numbers:
```javascript
+
```
That's it! Let's have a look at what it does if you input `2, 5`.
```javascript
   :: []
in :: [2 5]
+  :: [2+5] => 7
```
Which brings us to the next feature: implicit printing.
At the end of the program, the last item of the stack is printed. This is useful, because 99% of all code golf challenges require I/O! Even the most basic `Hello, world!` program requires output. When given a challenge, you only need to worry about implementing the algorithm, *not* getting input and giving output. If it's _implicit_ you want to do something, why should you _explicitly_ tell the program to do it? (this is why I hate Java).
