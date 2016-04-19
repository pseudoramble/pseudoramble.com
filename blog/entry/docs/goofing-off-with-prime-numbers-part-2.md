<div class="article-header">Goofing off With Prime Number Part 2 - Prime Factorization</div>

I am not fantastic at math. I've always found it interesting, but it's never come to me naturally. Sometimes it's good to face things you're not good at and give them a shot! So here we are, goofing off with prime numbers (again). 

[Here's what we talked about the last time we goofed off with prime numbers.](http://pseudoramble.com/blog/entry/goofing-off-with-prime-numbers-part-1.html)

## I don't feel like reading your last entry. What are you talking about?

Last time we talked about what a prime number is, and how to generate a set of prime numbers within some range using a sieve. This included some sample code in F# that you could use if you wanted to. 

Here's another potential grade school thing you may have forgotten - Any natural number can be formed by using a series of prime numbers put together! This was something I forgot about until learning more about prime factorization.

## Explain yourself!

As college professors I had would state, we can use our intuition to see that we have two kinds of natural numbers:

 * Prime numbers like `{2, 3, 5, 7, 11}`
 * Other kinds of numbers `{4, 6, 8, 9, 10}`
 
### What are these "other kinds of numbers" anyway? 

One thing you might've noticed is that one could use the prime numbers listed above to obtain the other kinds of numbers listed below. They might look like:

 * `4 = 2 * 2`
 * `6 = 2 * 3`
 * `8 = 2 * 2 * 2`
 * `9 = 3 * 3`
 * `10 = 2 * 5`

So yeah, numbers on the left are formed by multiplying the prime numbers listed on the right. **These are known as composite numbers**.

## What other kinds of Natural Numbers are there?

We now know of prime and composite natural numbers. Are there any other kinds? 

It turns out there isn't. The [fundamental theorem of arithmetic](https://en.wikipedia.org/wiki/Fundamental_theorem_of_arithmetic) spells this out for us. In essence, *all numbers are either prime or composite.* Beyond that, each composite number has a *unique prime factorization*. 

So for example, in the case of `10 = 2 * 5` the set `{2, 5}` is the only prime representation of 10 that can exist. 

That means that we can hunt down a factorization of a particular number. As long as all the pieces are prime, we can be sure that you can't factor it any other way using prime numbers.

## Can you run through some examples?

Examples are always good. Let's look at the number 12. How might we go about finding the prime factors of this? We need to know how we can break 12 down into smaller even parts. We also know that since we're only interested in prime numbers, we can skip other numbers like 4 and 8 because they're not interesting here.

So first, let's get some primes together, shall we? [Using our handy sieve from last time](http://pseudoramble.com/blog/entry/goofing-off-with-prime-numbers-part-1.html), we get the prime numbers <= 12: `{2, 3, 5, 7, 11}` These will be our "tests" and be the only possible factors we can see in our answer.

Since a lot more numbers will be divisible by 2 than 3 (so on and so on) we can start from the first and go to the last prime in our test. We're going to look for numbers that divide 12 evenly, but eliminate numbers that composites as we go along. 

 * `12 / 2 = 6`. So we'll keep 2. 
    * `6 % 2 = 0` however. Let's factor that out.
    * `6 / 2 = 3`. So we'll keep 2 (again). 
      * `3 % 2 = 1`. So we would move onto testing the next prime, 3.
      * `3 * 3 > 3` though. We can skip factoring numbers < sqrt(n) because we'll have already tested for this.
 * Combining the factors, we get `{2, 2, 3}`. 
    * And this checks out because `2 * 2 * 3 = 12`

How about something like 16? Again, we'll use the sieve to get us the set `{2, 3, 5, 7, 11, 13}` and start from the bottom.

 * `16 / 2 = 8`. So we'll keep 2.
    * `8 % 2 = 0` however. Let's factor that out.
    * `8 / 2 = 4`. So we'll keep 2 (again).
      * `4 % 2 = 0` however. Let's factor that out.
      * `4 / 2 = 2`. So we'll keep 2 (again).
        * `2 % 2 = 0` however. Let's factor that out.
          * `2 / 2 = 1`. So we'll keep 2 (again).
          * `1 % 2 = 1`. So we would move onto testing the next prime, 3.
          * `3 * 3 > 1` though. We can skip factoring this.
 * Combining the factors, we get `{2, 2, 2, 2}`.
    * And this checks out because `2 * 2 * 2 * 2 = 4 * 4 = 16`.

This algorithm is known as [Trial Division](https://en.wikipedia.org/wiki/Trial_division). It's a fitting name given that you just keep testing numbers to see what works out until you can't factor anymore.

## Enough with this tedious madness! Bring me the code!

[Here's my way of trying to implement Trail Division in F#](https://github.com/pseudoramble/hundred-projects/blob/master/f%23/Numbers/prime-factors.fsx). The essential machinery is as follows:

    let rec path a b steps tests =
        if a % b = 0
        then path (a/b) b (b :: steps) tests
        else
            match tests with
                | x :: xs -> if x * x > a then a :: steps else path a x steps xs
                | [] -> a :: steps
                
**A quick breakdown of the code above**:

In this function, `a` is the numerator, `b` is the denominator. In addition, `steps` records the denominator values that pan out, while `tests` hold our prime numbers to work through. 

1. First, check if `a` is divisible by `b`. 
   2. If it is, repeat this function replacing `a` with `a/b`.
3. Otherwise, look for the next prime to test. 
   4. If `x * x` (the next prime squared) is larger than the current `a` value, save `a` as the last step in this branch.
   5. Otherwise, repeat this function replacing `b` with `x` and `tests` with the primes NOT including `x`.

There are some separate small checks the code does outside of this before hand, but they aren't super important to the core of this functionality.

Embedded in the code are a few quick unit tests. I've used a variety of online tools to try and validate that the results are correct that exist in the file (and other random samples).
