# I Still Dont Know JS

Some days, I get complacent. So complacent, in fact, that I let myself slip into thinking I *know* Javascript.
If this fact alone doesn't make you sigh, well, thanks for your understanding. Here was today's unexpected adventure.

## What's wrong with the code?

    /**
     * Given a number, decrease it by 1, or stop it at the specified min.
     * @param {number} value - The value to decrease
     * @param {number} min - The limit which the value can reach. Defaults to Number.MIN_VALUE.
     * @returns {number} - Either value -1 or min.
     */
    function decrement(value, min = Number.MIN_VALUE) {
      const nextValue = value - 1;
      return Math.max(nextValue, min);
    }

This code is not trying to be sneaking or misleading at all. It takes one of the existing value. If it finds that `min` value is larger than `nextValue` it returns `min`. Otherwise it returns `nextValue`. Here are some examples:

    decrement(10, 5);     //    9  OK
    decrement(-100, -101) // -101  OK
    decrement(-101, -101) // -101  OK

So far, so good. Don't forget to test that default argument:

    decrement(10)   //      9  OK
    decrement(-100) // 5e-324  OK wait what?
    decrement(-1)   // 5e-324  :\
    decrement(0)    // 5e-324  Oh no...

What can we gather from this? Well, first thing is that it seems like this oddball result is the same. That means we get the same branch on each run. What else can we tell?

    decrement(0.9999)  // 5e-324                   Bad
    decrement(1.9999)  // 0.9999                   OK
    decrement(1.0001)  // 0.00009999999999998899   OK
    decrement(1)       // 5e-324                   Bad

We can see when our function maps to a number <= 0 that we get this funny result. Huh...

So what's happening? [MDN, tell me about `MAX_VALUE`!](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_VALUE):

> The `Number.MAX_VALUE` property represents the maximum numeric value representable in JavaScript.
>
> ...
>
> The `MAX_VALUE` property has a value of approximately `1.79E+308`.

OK, that sounds right. [So naturally `MIN_VALUE` is the opposite?](https://link)

> The `Number.MIN_VALUE` property represents the smallest positive numeric value representable in JavaScript.
>
> ... 
>
> The `MIN_VALUE` property is the number closest to `0`, not the most negative number, that JavaScript can represent.
> `MIN_VALUE` has a value of approximately `5e-324`. Values smaller than `MIN_VALUE` ("underflow values") are converted to `0`.

It turns out that my misunderstanding came from not thinking hard enough about how floats are represented.
[For example, Java has the same implementation](https://docs.oracle.com/javase/7/docs/api/java/lang/Double.html#MIN_VALUE) of these constants.
Interestingly, [C# chose to assign `MIN_VALUE` to the truly smallest value you can represent with 64-bit floats](https://docs.microsoft.com/en-us/dotnet/api/system.double.minvalue?view=netframework-4.7.2) and instead created the more by-the-spec constant [epsilon](https://docs.microsoft.com/en-us/dotnet/api/system.double.epsilon?view=netframework-4.7.2) to determine what the smallest possible granularity you could have is. 

Not what I would have expected intuitively, though I see the reasoning behind it.

Anyway, the solution we landed on for our situation was to default the bound from `Number.MIN_VALUE` to `Number.MIN_SAFE_INTEGER`. [From MDN one more time:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER)

> The `Number.MIN_SAFE_INTEGER` constant represents the minimum safe integer in JavaScript (`-(2^53 - 1)`).
>
> ...
>
> The reasoning behind that number is that JavaScript uses double-precision floating-point format numbers as specified in IEEE 754 and can only safely represent numbers between `-(2^53 - 1)` and `2^53 - 1`.

## The resulting code

    /**
     * Given a number, decrease it by 1, or stop it at the specified min.
     * @param {number} value - The value to decrease
     * @param {number} min - The limit which the value can reach. Defaults to Number.MIN_VALUE.
     * @returns {number} - Either value -1 or min.
     */
    function decrement(value, min = Number.MIN_SAFE_INTEGER) {
      const nextValue = value - 1;
      return Math.max(nextValue, min);
    }

    decrement(10)   //      9  OK
    decrement(-100) //   -101  OK
    decrement(-1)   //     -2  OK
    decrement(0)    //     -1  Woohoo!

So, in conclusion, I still don't know JS, but I really don't know floats either. Woof.