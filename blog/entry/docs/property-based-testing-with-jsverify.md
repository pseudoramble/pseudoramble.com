# Property-Based Testing With JSVerify

Something that's easy to forget in the world of software development is that testing is a major time investement.
Testing has a variety of meanings depending on the context of course. But here we mean attempting to show software 
correctness by exercising code.

I've recently been poking around at a form of testing known as *property-based testing*.

### What's a property-based test?

To quote the website [Abstractivate](http://blog.jessitron.com/2013/04/property-based-testing-what-is-it.html):

##### "Property-based tests make statements about the output of your code based on the input, and these statements are verified for many different possible inputs."

Property-based looks at the input & output of a function to describe details about the output itself.
A description is provided for the parameters needed for that function. Test data is then
generated from these descriptions, which helps tease out harder-to-find scenarios.

### In comparison with unit tests

Unit tests *focus on the results of one-example at a time*. They may also use specific implementation details 
of the code to check its functionality.

Let's take a look at `median(values: number): number`:

    it('is the second number when a list of size 3 is given', () => {
      expect(median([3, 6, 1024])).to.equal(6);
    });

    it('is between the 1st and 2nd number when a list of size 2 is given', () => {
      expect(median([2, 4])).to.equal(3);
    });

    it('is still the midpoint of numbers regardless of order', () => {
      expect(median([1024, 12, 144444, 13, 1924, 169, 4])).to.equal(169);
    });

These are not entirely random examples, as we're exercising the length and values of the list itself. I'm
trying to check that we're always getting the middle-most element of the list, or the average if not possible.

### Switched to be property-based (kinda)

Property tests *focus on the descriptions using many examples*. These avoid using implementation details
to check the functionality.

One property I thought of was that we're trying to say that the median is less than at least half of these elements.
This seems a lot closer to what I wanted to discover about the `median` function.

Here's the revised property-based version:

    it('is <= at least half of the numbers in the set', () => {
      const test = jsc.check(jsc.forall('nearray nat', values => {
        const med = median(values);
        return values.filter(v => v <= med).length >= values.length / 2;
      }));

      expect(test).to.be.true;
    });

Some notes on what this is:

1. JSVerify helps describes what data to generate to work this property.
    1. `jsc.forall('nearray nat')` says that for all non-empty lists of natural numbers.
1. The implementation of the property test returns if that particular case matches the property.
    1. This function is invoked with different values a multitude of times (100 by default).

Hopefully the contrast is a bit more clear now. **Properties are details we want to hold true for *any*
inputs that meet the acceptable criteria.**

We can make this less wordy by using `jsc.property` which is takes away some boilerplate.

    jsc.property('is <= at least half of the numbers in the set', 'nearray nat', values => {
      const med = median(values);
      return values.filter(v => v <= med).length >= values.length / 2;
    });

### What are useful properties to test for?

This depends on the scenario. In the code I've been using this in, some mathematical ones have
come in handy. These are great because we can look them up and implement them online.
For more broad ideas, [F# for fun and profit](http://fsharpforfunandprofit.com/posts/property-based-testing-2/)
 provides a great set of examples to explore.

Let's try an example of using idempotence! Idempotence says that applying a function more than once is
 the same as applying it once.

The mode of a set of numbers (the most frequent elements in a list) is an example of that:

    describe('the mode of a set of numbers', () => {
      jsc.property('is idempotent', 'nearray nat', v => {
        const mmm = mode(mode(v));
        const m = mode(v);

        return m.every(x => mmm.includes(x));
      });

### What is this `jsc` thing you're using?

This is from the [JSVerify](https://github.com/jsverify/jsverify) library. They provide few examples,
but plenty of details about how the library can work. They provide functionality such as:

* Ways to describe the function's data (and a DSL with that).
* Ways to generate different kinds of data.
* Ways to find the minimum input from a failed example.

I'm still working my way through what they offer and learning. But the functionality I've shown
here have been good enough to cover my example project,
[Numberenos](https://github.com/pseudoramble/numberenos/tree/master/packages/numberenos-lib).