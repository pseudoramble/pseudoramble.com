<div class="article-header">Goofing off With Prime Number Part 1 - The Sieve of Eratosthenes</div>

I am not fantastic at math. I've always found it interesting, but it's never come to me naturally. Sometimes it's good to face things you're not good at and give them a shot! So here we are, goofing off with prime numbers. 

## So first off, what is a prime number anyway? ##

Using a grade school explanation of it, prime numbers are natural numbers that can be evenly divided by two divisors - the number itself and 1. 

A few things:

* By natural number, I mean whole number (no decimals or complex numbers or crazy things) > 0.
* By divisors, I mean a denominator. So in `10 / 2 = 5`, it would be 2.
* Those factors are the number itself (`n` lets say) and the number 1.

Okay, cool. So some number, itself, and 1. Got it.

## What are some prime numbers? ##

A small sample would be `{2, 3, 5, 7}`.

## How did you figure that out? ##

Let's first try out a real quick test for prime numbers between 1 and 10:

 1. &#10008; Trick question. One isn't considered a prime number.
 2. &#10003; That's our only option here!
 3. &#10003; We can skip `3 / 3` and `3 / 2 = 1.5` doesn't work. So count 3!
 4. &#10008; `4 / 2 = 2` so we can't count 4.
 5. &#10003; `5 / 4` | `5 / 3` | `5 / 2` don't give us whole numbers. So count 5!
 6. &#10008; `6 / 5` | `6 / 4` won't work. `6 / 3 = 2` so we can't count 6.
 7. &#10003; `7 / 6` | `7 / 5` | `7 / 4` | `7 / 3` | `7 / 2` don't give us whole numbers. So count 7!
 8. &#10008; `8 / 4 = 2` so we can't count 8.
 9. &#10008; `9 / 3 = 3` so we can't count 9.
 10. &#10008; `10 / 5 = 2` so we can't count 10.

Putting it together, you get the set `{2, 3, 5, 7}`. 

You might notice a few things too:

 * All of the even numbers are omitted (save for 2). So right away you knocked out 4, 6, 8, and 10.
 * All of the numbers that are multiples of 3 were removed (save for 3). So you could eliminate 6 and 9.
 * Even if we somehow missed that 10 / 2 = 5, we would catch that 10 / 5 = 2. 
   * In other words, multiples of 5 disappear.

You're finding *all numbers that are multiples of something else*. Once you've eliminated those numbers, you're left with the prime numbers! And that is the essence of the Sieve of Eratosthenes.

[Here's a handy illistration from Wikipedia](https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes):

![Sieve of Eratosthenes](https://upload.wikimedia.org/wikipedia/commons/b/b9/Sieve_of_Eratosthenes_animation.gif)

## So how do I find the prime numbers under 123,456?! ##

Running this by hand (or most algorithms really) can be tedious. Good thing we've got these shiny fancy computer boxes now. They're even internet-enabled now!

[An implementation of this I put together in F# can be found here](https://github.com/pseudoramble/hundred-projects/blob/master/f%23/Numbers/sieve.fsx). The way I put together my implementation was probably not the most efficient, but I think is somewhat straight forward (here's a paired down form to show the idea):

    let rec runTest multipliers limit removals =
        let multipler = List.head multipliers

        if multipler > int (sqrt (float limit))
        then
            removals
        else
            let updatedRemovals = generateStep multipler limit removals
            runTest (List.tail multipliers) limit updatedRemovals

    let n = 123456
    let startSeq = seq { for i in 2 .. n -> i }

    runTest (List.ofSeq startSeq) n Set.empty
    |> Set.diffeernce (Set.ofSeq startSeq)

**A quick breakdown of the code above**:

1. First, check if we need to calculate more primes by looking at the next multiplier.
   2. If we do need to check, we generate the values from `multiplier^2` to the upper bound specified.
   3. We that set of values with the previously calculated value to omit (see `Set.union`).
   4. Repeat from #1.
5. Once here, all the composite numbers have been found. 
   6. These are removed from the range from 2 to the upper bound (see `Set.difference`).
7. You are now left with only prime numbers!

So there you have it - A way to find prime numbers. In Part 2, we'll goof around more by talking about how prime numbers actually can make *any* other natural number.
