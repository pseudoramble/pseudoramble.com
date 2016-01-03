<div class="article-header">Python's Special Methods</div>

(To see the complete code for this entry, [clone the repo for this page here!](https://github.com/pseudoramble/blog-demos/tree/master/src/python-special-methods))

Let's talk a little about [Python's Special Methods](https://docs.python.org/3.5/reference/datamodel.html#special-method-names) by building up an example. Suppose you've got some mutual/index fund you own some shares of. You'd like to compare the Net Asset Value (NAV) from the end of last year to the end of this year. I imagined the code might look like this: [[1]](#1)[[2]](#2)

    from NAV import NAV

    def navOf(ticker, date):
        if date and date.year > 2014:
            return NAV(ticker, 71.80)
        else:
            return NAV(ticker, 70.87)

    ticker = 'FUSEX'
    nav_2014 = navOf(ticker, date(2014, 12, 31))
    nav_2015 = navOf(ticker, date(2015, 12, 31))

    print('For the ticker %s:' % ticker)
    
    if nav_2014 > nav_2015:
        print('\tAt a NAV of %s (versus %s), 2014 was a better year than 2015' %
              (nav_2014, nav_2015))
    else:
        print('\tAt a NAV of %s (versus %s), 2015 was a better year than 2014' %
              (nav_2015, nav_2014))

Simple, right? We like classes, so we of course want a NAV class. Here's an initial stab at it:

    class NAV:
        def __init__(self, ticker, price):
            self.ticker = ticker
            self.price = price

You have almost inevitably used the `__init__()` method when writing classes. This is a special method that provides some of the functionality of a constructor from other languages (setting variables, getting initial state configured, etc.).

So good work - One special method down. Now let's give this code a shot:

    [dswain@Dupree py-special-methods-example]$ python main.py 
    For the ticker FUSEX:
    Traceback (most recent call last):
      File "main.py", line 18, in <module>
        if nav_2014 > nav_2015:
    TypeError: unorderable types: NAV() > NAV()

Woof! Our first stumbling block is this strange `TypeError` explaining that NAV can't be ordered. So what does this mean? In essense, saying `nav_a > nav_b` means as little as saying `my_favorite_book > your_favorite_book`. What definitions and data make this true or false?

Python lets a developer decide some of these things. Let's add the `__gt__()` method to NAV:

    def __gt__(self, other):
        if self.ticker == other.ticker:
            return self.price > other.price
        else: # We can tell Python that this functionality isn't implemented here if need be.
            return NotImplemented

And if we take another attempt at running the code:

    [dswain@Dupree py-special-methods-example]$ python main.py 
    For the ticker FUSEX:
    	At a NAV of <NAV.NAV ...> (versus <NAV.NAV ...>), 2015 was a better year than 2014

Better, kinda. What happened though?

Python lays out a variety of well-known methods it uses objects if they exist. They're tied to different operators provided by Python. Some examples include:

* `__gt__()` goes with the operator `>`
* `__ge__()` goes with the operator `>=`
* `__sub__()` goes with the operator `-`

In other words, these functions give us a slightly more direct connection to Python itself, in a sorta-safe way.

Going back to our case, `if nav_2014 > nav_2015` can be roughly translated to `if nav_2014.__gt__(nav_2015)`. The former is (arguably) nicer than the former.

Here's another question - What if we switch `if nav_2014 > nav_2015:` to `if nav_2015 < nav_2014:`? Well, let's just try it out:

    For the ticker FUSEX:
    	At a NAV of <NAV.NAV ...> (versus <NAV.NAV ...>), 2015 was a better year than 2014

Not what you were expecting? Some things to keep in mind:

1. `__gt__` and `__lt__` are considered reflections of each other. So, we don't *need* to explicitly define it here.
2. `__ge__` and `__le__` are also reflections of one another. If we need those to function, we would need to implement one of those.

So there we go. Some handy operator overloading, and some kinda neat rules around them. An issue remains though - The output looks like crap!

    For the ticker FUSEX:
    	At a NAV of <NAV.NAV ...> (versus <NAV.NAV ...>), 2015 was a better year than 2014

What's a `<NAV.NAV object at 0x7f0090ff1710>` anyway? This is Python's way of describing the object **as a string**. Again, woof, but that whole **as a string** bit is neat.

`__str__()` which provides an "informal" version of the string (good for human eyes instead of machine ones).

    def __str__(self):
        return str(self.price)

This will simply print the price at that point. So when we try it again:

    [dswain@Dupree py-special-methods-example]$ python main.py 
    For the ticker FUSEX:
    	At a NAV of 71.8 (versus 70.87), 2015 was a better year than 2014

Notice how that function calls `str()` as part of the implementation. This is sorta what Python does when printing an object out, and it's looking out for the `__str__()` method for it to use.

One more example - I want to know how much real money dollars these shares might be worth. We can have our classes act like numbers using special methods. Let's get this working:

    shares = 1000000
    total_value = nav_2015 * shares

    print('\tWith %d shares of %s, the total value of your holdings are $%.2f' %
           (shares, ticker, total_value))

Basically, multiple a NAV by some kind of real number. That implementation on NAV might look like this: [[3]](#3)

    def __mul__(self, amount):
        if isinstance(amount, numbers.Real) or isinstance(amount, numbers.Integer):
            return self.price * amount
        else:
            return NotImplemented

And our results:

    [dswain@Dupree py-special-methods-example]$ python main.py 
    For the ticker FUSEX:
    	At a NAV of 71.8 (versus 70.87), 2015 was a better year than 2014
    	With 1000000 shares of FUSEX, the total value of your holdings are $71800000.00

Sweet! Now we can see all the millions of dollars that you may have realized (or not).

####TL;DR####
Python provides a way to override operators and provide some custom abilities for the language to make use of via special methods on objects. There are no direct ways to override operators in Python, or implement your own (AFAIK).

####Some Notes:####

<a name="1">[1]</a>:  If you're going to implement some of these, make sure they're done in a consistent manner. For example, overriding `__eq__()` really means you've gotta override `__hash__()` too. Delegate when you can, and check the docs for more serious implementations.

<a name="2">[2]</a>: Money is not well represented as floating-point numbers. Don't do it. It's bad.

<a name="3">[3]</a>: Because I was bad and didn't follow my own advice, you could see some really weird errors here. Don't use this for actual money calculations because this is just an illistration.
