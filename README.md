# PlatyPar

PlatyPar is a golfing language that compiles to JavaScript, similar to CoffeeScript. One important distinction is that while CoffeeScript, JavaScript, and any practical language, for that matter, use **infix notation**, PlatyPar uses **postfix notation**.
This means that for a given operation, let's say `+`, you would put it **in**between (as in **in**fix), i.e. `a+b`. This can be read as "a plus b".
However, PlatyPar uses postfix notation, i.e. `ab+`. This can be read as "a, b, add", or if you prefer a pseudo-code approach, `[a,b].add`.
There is an important tradeoff here. Consider the following infix expression:
`a+b*c`
If you are familiar with PEMDAS, you will know that that _should_ evaluate to `a+(b*c)`. 

But what if you want to express `(a+b)*c`? You can't do it without parentheses. In postfix notation, both could be express _without parens_.
The postfix equivalents of those two would be `abc*+` and `ab+c*`. This is a huge advantage, as it not only saves you space by not needing to use `()`, but it also makes this harder to read, making it trivial to differentiate noobs of the language from pros such as yourself.
There is, however, a drawback: with postfix notation, every operator has an **arity**, or amount of operands it can take. While infix notation can have different arities, for example `-a` means the negation of `a` and `a-b` means the difference of `a` and `b`, postfix has a fixed arity, so `-` can **only** mean `a-b`. 
