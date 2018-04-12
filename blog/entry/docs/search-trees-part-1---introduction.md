# Search Trees Part 1 - Introduction

*This is a series about trees!* Search trees, that is.

* Part 1 (Introduction)
* [Part 2 (Binary Search Trees)](https://www.pseudoramble.com/blog/entry/search-trees-part-2--binary-search-trees.html)
* [Part 3 (AVL Trees)](https://www.pseudoramble.com/blog/entry/search-trees-part-3---avl-trees.html)

Who loves trees? I know [Thrift Craft Live](https://thriftcraftlive.com/) (or whatever her name is) does!

![Tree IRL](http://www.rawstory.com/wp-content/uploads/2015/05/Oak-tree-Shutterstock-800x430.jpg)

Those are cool. But I think search trees are cool. Kinda like this instead.

![Tree IFL](https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Binary_search_tree.svg/1229px-Binary_search_tree.svg.png)

This is the data structure I found the most interesting during my time at university. It's simple to draw and understand, and is also powerful.

The series will try and cover the following topics:

1. Introduction and Motivation (that's this page!)
1. Implementing a Binary Search Tree (part 2)
1. Implementing an AVL Tree (part 3)
1. Implementing a Red-Black Tree (part 4)

I will make an effort to cover the topics in a way that tries to assume less knowledge, but you certainly will want an understanding of programming, including arrays, comparable data types, and searching for elements in collections.

## Motivation and Concept

You and your friend *love* Reddit usernames. So much so that you both subscribe [/r/usernames](http://reddit.com/r/usernames) to write down great usernames. Right now you throw them into a list as you find them:

> `usernames = [LowHangingFruit, ..., SlaugherhouseHigh5, ..., Zonoh, ..., aFreudOfMyMother, ..., MyNameIsURL]`

The "..." means twenty items nowadays. Far too many for you to handle. Naturally, your friend goes "Let's compare lists. Do you have 'LowHangingFruit' in your list?"

Since your memory is not good, so you start from the top. It looks like this:

```javascript
    usernames[0] = 'LowHangingFruit'? Yes!
```

That happen to be true. The process was easy by coincidence in this case and it only took one step. Nice.

> This is called a "constant time" operation in CS terms. You may see it written like `O(1)` (where `O` is Big-O notation). Constant time is the best-case scenario when searching an array from front-to-back.

Now your friend goes "OH OH THIS ONE IS GREAT! Look for 'SuperNintendoChalmers'!"

```javascript
    usernames[0] = 'SuperNintendoChalmers'? No 
    usernames[1] = 'SuperNintendoChalmers'? No
    ... Forever Passes ...
    usernames[83] = 'SuperNintendoChalmers'? No
    usernames[84] = 'SuperNintendoChalmers'? No
```

A search that required looking at every element in the list was fruitless. So disappointing, but this is the way the world works sometimes.

> This is called a "linear time" operation in CS terms. You may see it written like `O(n)` (where `n` is the number of operations required for the algorithm). This is the worst case scenario. There is an "average" case too (searching half of the list) which is considered linear because ultimately it's still a search from front-to-back.

OK, so this is a bummer. Can you do better? What if you sort it and then search through it like a phone book? Now your list looks like this:

> `usernames = [aFreudOfMyMother, ..., LowHangingFruit, ..., MyNameIsURL, ..., SlaugherhouseHigh5, ..., Zonoh]`

Let's pretend that 'MyNameIsURL' is the middle of the list for our example.

"Dude 'MyNameIsURL' so goooooood find it!"

```javascript
    usernames[42] = 'MyNameIsURL'? Yes!
```

How about 'LowHangingFruit' this time?:

```javascript
    usernames[42] = 'LowHangingFruit'? No (look between the elements at 0-41)
    usernames[24] = 'LowHangingFruit'? No (look between the elements at 25-41)
    usernames[36] = 'LowHangingFruit'? No (look between 36-42)
    ... (this completes successfully in an iteration or two more like this)
```

Several steps are needed, but overall much better than one-by-one! Glorious username searching! This is known as a *binary search* because at any iteration, the value you want is in the "upper half" of your list or the "lower half" of your list (two options).

> This is called a "logarithmic time" operation in CS terms. You may see it written like `O(log(n))` (where `log(n)` is the number of steps required to complete the algorithm). This happens because the list is continually partitioned into two parts, reducing the search space in half each iteration.

The situation is better. What if you add new usernames though? You need to sort the list for every new entry to maintain this binary search property. What we might want now is a structure to maintain this property at all times. 

That's where the binary search tree comes into play.

## Some Properties

Binary search trees (sometimes referred to as BST in these entries) provide a few things:

* They maintain order by the data or key used to mark each piece of data.
* Provides efficient operations (insert/search/delete average cases are logarithmic `O(log(n))`
* They are really fun to draw (in contract to doubly linked lists at least).

If we built a BST of our usernames above, it would (partially) look like this:

```
                                                  MyNameIsURL
                                                /             \
                              LowHangingFruit                   SlaugherhouseHigh5
                             /               \                 /                 \
                aFreudOfMyMother             ...             ...                   Zonoh
```

Now you can much more easily scout out your favorite usernames. How nice!

## Some Considerations

Of course there are things to keep in mind when choosing to use a binary search tree.

* The order which items are added to the tree directly impact the performance of the tree (more on this later).
* The data or keys must be comparable (so they can be ordered properly using `<`, `>` and `=`).
* Functional versions of this could require lots of copying of elements (mine does, at least).

These may or may not be worth it, depending on your specific case. This series most likely won't help you decide if you should use them or not. It's more just for the fun of it.

## Next Time

[In Part 2](https://www.pseudoramble.com/blog/entry/search-trees-part-2--binary-search-trees.html) we will implement BST's in F#. The goal will be to create immutable versions of BST to explore what those may look like as well. We will implement the following interface on each implementation covered:

* Insertion
* Search/Find
* Deletion
* Print

And we'll dive into the major drawback of the binary search tree - how insertion order impacts performance.