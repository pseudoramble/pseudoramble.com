# Search Trees Part 2 - Binary Search Trees

*This is a series about trees!* Search trees, that is.

* [Part 1 (Introduction)](http://www.pseudoramble.com/blog/entry/search-trees-part-1---introduction.html)
* Part 2 (Binary Search Trees)
* [Part 3 (AVL Trees)](http://www.pseudoramble.com/blog/entry/search-trees-part-3---avl-trees.html)

To recap our story, we love usernames. We collect them, and so do our friends. We love to compare our lists of usernames together to see how they're similar. This is tedious though, so we decided to sort it and search through it. Much better, but keeping this list sorted is a project in of itself.

So let's build ourselves a method to keep better track of these lists. We'll implement what's called a Binary Search Tree for this.

[My code for implementing a BST in F#](https://gitlab.com/pseudoramble/trees/blob/master/Trees/BST.fs) if you want to jump right in.

## Concepts

We will need two primary hunks of junk for our BST:

* [A Node Structure](https://gitlab.com/pseudoramble/trees/blob/master/Trees/Node.fs)
* [A Module to form BST's](https://gitlab.com/pseudoramble/trees/blob/master/Trees/BST.fs)

**First**, the `Node`. It's the fundamental structure in this BST. It's job is twofold:

1. Hold onto any important data (our usernames in this case).
1. Store the left/right edges to other Nodes.

We also represent empty Nodes which are affectionately known as `Leaf` nodes. In our case this means there are no more values to the one of the subtrees. It's our way of knowing "you don't have usernames to look for over there".

> *For normal people, a Leaf is represented by... nothing. There's nothing there, so why would we draw it? For developers, it's used like a null pointer, except it forces you to not run into unexpected bugs.*

**Second**, the module itself (called `BST` in the code). It contains the interface to form different trees. It provides the ways to deal with the `Node`'s themselves and organize them properly.

> *Notice I keep saying "form trees" here and there. This is because we're not mutating the trees. We're creating a copy of portions of the tree we need with a value added or removed. Subtle, but important.*

The parts of the interface we'll talk about here are creating new trees, adding values to a tree, finding values in a tree, and removing values from the tree. The interface is larger than this, but I believe that once the bigger pieces are understood, the rest of the code should be consumable.

## Step 1 - Create a tree

"Alright, let's start a new tree with 'MyNameIsURL'." Easy enough:

    > let tree = BST.create "MyNameIsURL";;
    val t : Node.TreeNode<string> = TreeNode ("MyNameIsURL",Leaf,Leaf)

Easy enough. All `BST.create` does is makes a new `TreeNode` instance with two `Leaf` edges and the value provided by you. Note that the type is constrained to a `string`. So you can't mix-and-match your types of trees. This is a good thing.

## Step 2 - Add to the tree

"Wow that's the worst username I've ever seen" says your humble and non-forward friend. "How about adding a real username like 'SuperNintendoChalmers'?" OK, then...

    > let t1 = BST.add "SuperNintendoChalmers" t;;
    val t1 : Node.TreeNode<string> =
      TreeNode ("MyNameIsURL",Leaf,TreeNode ("SuperNintendoChalmers",Leaf,Leaf))

Notice what happened here. We have two `TreeNode`'s:

* The root is "MyNameIsURL"
* The direct right subtree has the node with "SuperNintendoChalmers" as its value

So now, and values which come after "MyNameIsURL" and before "SuperNintendoChalmers" will be the left subtree of "SuperNintendoChalmers". If we add "SlaugherhouseHigh5":

    > let t3 = BST.add "SlaugherhouseHigh5" t2;;
    val t3 : Node.TreeNode<string> =
      TreeNode
        ("MyNameIsURL",Leaf,
        TreeNode ("Zonoh",TreeNode ("SlaugherhouseHigh5",Leaf,Leaf),Leaf))

We're quickly approaching the output of the tree being incomprehensible, but you can see that "SlaughterhouseHigh5" is the left subtree of "Zonoh".

### The Algorithm

The add code does the following:

* We match the type of Node. If it's a `Leaf`:
  * We've found our insertion spot and we create a new `TreeNode` with the value saved and two `Leaf` nodes (like the Create step did earlier).
* Otherwise it's a `TreeNode` by definition. Compare the value being added to the node's value:
  * If it's less than the current Node's value, run the `add` code on the left subtree
  * If it's greater than the current Node's value, run the `add` code on the right subtree.
  * In either of the two steps above, we copy the current node and replace the proper subtree with the results of `add`.
    * This allows us to "change" the tree without mutating the existing one.
  * Otherwise the value is already in the tree. Return the current node.

## Step 3 - Find values in the tree

Forgetful like you are, you deicde to make sure you actually did insert "Zonoh" into the tree. Let's see now...

    > BST.search "Zonoh" t3;;
    val it : string option = Some "Zonoh"

Good to know it's there. "What about 'LowHangingFruit'?" your friend asks. Let's see again...

    > BST.search "LowHangingFruit" t6;;
    val it : string option = None

Nope, nothin'. We use `Option<'T>` to represent a value that may or may not exist. `None` means it doesn't exist. `Some "Thing"` means it does exist.

### The Algorithm

This one is the most straightforward of the algorithms:

* We match the type of Node. If it's a `Leaf` the value does not exist in the tree. Return `None`.
* Otherwise, it's a `TreeNode` by definition. Compare the value being searched for to the node's value:
  * If they match, you found it! Return `Some value`.
  * If it's less than the current Node's value, search the left subtree.
  * Otherwise, search the right subtree.

## Step 4 - Remove from the tree

"Dammit!" your clumsy friend exclaims as they add their work username into your tree by accident.

    > let t4 = BST.add "corpresource12345" t3;;
    val t5 : Node.TreeNode<string> =
      TreeNode
        ("MyNameIsURL",Leaf,
        TreeNode
          ("Zonoh",TreeNode ("SlaugherhouseHigh5",Leaf,Leaf),
            TreeNode ("corpresource12345",Leaf,Leaf)))

Let's take it out:

    > let t5 = BST.remove "corpresource12345" t5;;
    val t5 : Node.TreeNode<string> =
      TreeNode
        ("MyNameIsURL",Leaf,
        TreeNode ("Zonoh",TreeNode ("SlaugherhouseHigh5",Leaf,Leaf),Leaf))

Good work. [You have avoided an Equifax-sized security breach](http://money.cnn.com/2017/09/07/technology/business/equifax-data-breach/index.html).

### The Algorithm

The code for `remove` is the most complex part of the BST because it involves maintaining the order of the tree by putting existing pieces together in a different way. Finding nodes and copying the tree are the same as `add`. The only difference is when a `Leaf` is found, the value can't be found. That means the tree isn't modified. Easy enough.

The hard part comes into play when we find the value. We match on the left and right subtrees. There are three cases:

1. The node has no subtrees (two `Leaf` values are matched). Simply return a `Leaf` node because there is nothing left to follow down this path.
1. The node has one `TreeNode` and one `Leaf`. Return the `TreeNode` because that value must be reachable.
1. The node has two `TreeNode`'s. Guh.
    1. Here we find the next smallest value to the right (`match min tRight with...`). It will take the place of the existing node. This is because any other node would throw off the ordering of the tree.
    1. When we find a suitable replacement, we have to then remove that from the tree. Make a new node with the old left subtree, and remove the replacement value from the existing right subtree.

## Step 5 - Everything comes crashing down

While you were banging away on your username tree, another friend went off on their own to create theirs. They did it in-order:

    > let f = BST.create "AFreudOfMine" |> BST.add "LowHangingFruit" |> BST.add "MyNameIsURL";;
    val f : Node.TreeNode<string> =
      TreeNode
        ("AFreudOfMine",Leaf,
        TreeNode ("LowHangingFruit",Leaf,TreeNode ("MyNameIsURL",Leaf,Leaf)))

Notice that the `TreeNodes` only exist as right subtrees. Your friend is unintentionally making a linear list. It's a slow one at that given the effort we went through. The plain BST on its own doesn't have an answer for this. You can recreate it and add the nodes in a different order to improve the situation, but the order-dependence will continue to cause problems.

In Part 3, we'll explore an answer to this problem in the form of an AVL Tree.