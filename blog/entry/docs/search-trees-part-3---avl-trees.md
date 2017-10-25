# Search Trees Part 3 - AVL Trees

*This is a series about trees!* Search trees, that is.

* [Part 1 (Introduction)](http://www.pseudoramble.com/blog/entry/search-trees-part-1---introduction.html)
* [Part 2 (Binary Search Trees)](http://www.pseudoramble.com/blog/entry/search-trees-part-2--binary-search-trees.html)
* Part 3 (AVL Trees)

To recap Part 2, we built ourselves a BST to track our favorite usernames. This lets us add, remove, and find these usernames in "logarithmic time" which means the amount of stuff we look at is cut in half at each step.

However, we saw one of the issues with the plain BST. The performance is directly impacted by the order elements are added. This isn't great. So let's explore an option to overcome this limitation which is generally speaking known as a self-balancing binary search tree. Our specific pass at it is known as a AVL BST.

[My code for implementing an AVL BST in F#](https://gitlab.com/pseudoramble/trees/blob/master/Trees.Core/AVL.fs) if you want to jump right in.

## Concepts of a Self-Balanced BST

*In terms of structure*, a self-balanced BST is no different from a typical BST. They are still both binary trees, which means that it's a directed set of nodes where each node has at most two children.

*In terms of behavior*, a self-balanced BST maintains a similar **height** between its left and right subtrees. The height of a tree  (or `h(T)`) is the furthest leaf node from T. Self-balanced BST's go about this by readjusting their structure when nodes are added and removed from the trees.

As always, let's laugh (and learn) with some usernames. Here's an example of a balanced BST:

                  FedoraTheExplora
                  /                \
        ClipOnMullet               TacoBelle

This is a balanced BST that has a height of 1. I can say this BST is balanced because `FedoraTheExplora` has only one node on the left side and only one node on the right side. Since neither of those nodes have any children, they don't change the height of the tree. In other words `h(l) - h(r) = 0`. Nice.

Here's a tree that's not very balanced:

                  FedoraTheExplora
                  /                \
        ClipOnMullet               TacoBelle
                                  /
                          OuijaBored
                                    \
                                  PluralizesEverythings

This is most likely not a balanced BST, and it has a height of 3 (or in my hobo math, `h(T) = 3`). This BST is not balanced because `FedoraTheExplora` has one node to its left, but it has three nodes to its right. So this may be a case where the heigh difference is too large and would need to be adjusted.

One more visual to explain height. What height does this tree have?

                  FedoraTheExplora
                  /                \
        ClipOnMullet               TacoBelle
                                  /         \
                          OuijaBored        WingWingWeHavADinner

This tree has `h(T) = 2` because it has two paths of equal length. Since neither is larger, it doesn't add to the height of the tree anymore.

### AVL BST Specifics

Our implementation will be an AVL BST. This says that given a node, the difference between the left and right subtrees will be no greater than one. Using my hobo mathematics, that means given a node T that `-1 <= h(T.l) - h(T.r) <= 1`.

Graphically, this means that in addition to the 1st balanced BST we drew, the following is also balanced:

                  FedoraTheExplora
                  /                \
        ClipOnMullet               TacoBelle
                                  /
                          OuijaBored

Even though `h(T.l) = 1` and `h(T.r) = 2`, they only differ by 1 (or `h(T.l) - h(T.r) = 1`). So is considered balanced by the AVL definition.

### Rotations

So an AVL BST keeps itself balanced, but how? Using rotations! This is the process of taking a tree that's "heavy" or "leaning"  one direction and turning it into a tree with `h(T) = 0`. So if it leans to the left too much, we move it back toward the right. If it's too heavy to the right, we move it back toward the left.

There are technically four patterns. It's very helpful to get the first two patterns. Once we get those, the second two patterns are just a little extra work.

**Single Left/Single Right Rotations** turn a tree that's heavy towards one direction and turn it toward the other one.

*A single left rotation* performs a transformation that looks like you're pulling the left side of the tree down to make a new root. Graphically that transformation is:

        a
         \             b
          b     =>    / \
           \         a   c
            c

You could describe it like so:

    rotateLeft tree =
      newRoot = tree.right
      newRoot.left = tree.value
      newRoot.right = tree.right.right
      newRoot

Verbally, the new root node is the right node (in this example, `b`). The new left node is the original root (in this example, `a`). Lastly, the new right node is the original trees right subtree's right (in this example, `c`).

*A single right rotation* performs a transformation that looks like you're pulling the right side of the tree down to make a new root. Graphically that transformation is:

            a
           /            b
          b     =>     / \
         /            a   c
        c

You could describe it like so:

    rotateLeft tree =
      newRoot = tree.left
      newRoot.left = tree
      newRoot.right = tree.left.left
      newRoot

Verbally, the new root node is the left node (in this example, `b`). The new left node is the original root (in this example, `a`). Lastly, the new right node is the original trees left subtree's left (in this example, `c`).

**Double Left/Double Right Rotations** (also called Left-Right/Right-Left rotations) turn a tree that is heavy to one side but had inner nodes tilting the other way. So for example, if a tree is left-heavy but the middle node has a tree going to the right, this requires a double right rotation.

The trick here is to *turn the tree into a tree we know how to balance, then balance that instead.*

*A double left/left-right rotation* performs a transformation that does a single right rotation on the `root.right` subtree, then performs a single left rotation on that new tree. Graphically that transformation is:

            a          a
             \          \            b
              c    =>    b    =>    / \
             /            \        a   c
            b              c

You could describe it like so:

    rotateLeftRight tree =
      newRoot = tree
      newRoot.right = rotateRight(tree.right)

      rotateLeft(intermediateTree)

Verbally, the intermediate tree makes its right-right value the original tree's right-left value. We then do the right rotation algorithm on the intermediate tree.

*A double right/right-left rotation* performs a transformation that does a single left rotation on the `root.left` subtree, then performs a single right rotation on that new tree. Graphically that transformation is:

            c           c
           /           /          b
          a     =>    b    =>    / \
           \         /          a   c
            b       a

You could describe it like so:

    rotateRightLeft tree =
      intermediateTree = rotateLeft(tree.left)
      rotateRight(stepOneTree)

Verbally, the intermediate tree makes its left-left value the original tree's left-right value. We then do the left rotation algorithm on the intermediate tree.

## With Tests, Please!

![It Compiled:PASS](http://s2.quickmeme.com/img/a7/a7f7f520b1746d392c5676d1bd856f5dd4ce0c3f59d1e43a91534b3feabc748b.jpg)

Last time I did a bad, bad thing. I skipped unit tests. For the sake of playing around with a BST **that should never be used in a production environment** this was probably OK. However, I found that this case would be complicated without tests. 

[I implemented a variety of them](https://gitlab.com/pseudoramble/trees/blob/9ed327d2824c06202ffb55c7cd77506aee57009c/Trees.Tests/AVL.Tests.fs) using the Expecto testing library. For those reading who are familiar with JS testing, this is roughly what Mocha + Chai or Jest provides, but in F# instead. Funny enough, [I caught a bug in the original BST implementation thanks to having real tests](https://gitlab.com/pseudoramble/trees/commit/9ed327d2824c06202ffb55c7cd77506aee57009c). So even in my goof around implementation, unit tests came in handy.

These tests attempt to cover all the rotation scenarios for adding and removing nodes from a tree. It also covers how I implemented the height algorithm.

## Step 0 - The Stuff That Did Not Change

The functions that did not change include:

* create
* max
* min
* print
* search

The structure of the Node does not change either, as we simply recalculate height as needed. A lot of implementations of an AVL tree recommend storing the height with the specific node. Feel free to take that change on if you'd like, as I think it would be fairly simple.

## Step 1 - Add to the tree

OK, so finally we rewind back in time to when your crazy friend did this:

    > let f = BST.create "AFreudOfMine" |> BST.add "LowHangingFruit" |> BST.add "MyNameIsURL";;
    val f : Node.TreeNode<string> =
      TreeNode
        ("AFreudOfMine",Leaf,
        TreeNode ("LowHangingFruit",Leaf,TreeNode ("MyNameIsURL",Leaf,Leaf)))

Clearly crazy. But if we swap out the `BST` module with the `AVL` module, we get:

    > let f1 = AVL.create "AFreudOfMine" |> AVL.add "LowHangingFruit" |> AVL.add "MyNameIsURL";;
    val f1 : Node.TreeNode<string> =
      TreeNode
        ("LowHangingFruit",TreeNode ("AFreudOfMine",Leaf,Leaf),
         TreeNode ("MyNameIsURL",Leaf,Leaf))

And there you go. Your friend's tree has been saved from certain doom. So what happened?

* First the tree is made. It has one node, so it's balanced. Nothing special happens.
* Next we add a node to the right of the root.
  * The addition of the node is the same as the regular BST. After the addition (as the recursion unwinds) we check to see if the tree is balanced.
  * Since [`h(root.l) - h(root.r) = -1`](https://gitlab.com/pseudoramble/trees/blob/9ed327d2824c06202ffb55c7cd77506aee57009c/Trees.Core/AVL.fs#L61) the AVL tree is still balanced. No rotations required.
* Then we add a node to the right of the right of the root.
  * The addition of the node is the same as the regular BST. After the addition (as the recursion unwinds) we check to see if the tree is balanced.
  * Since [`h(root.l) - h(root.r) = -2`](https://gitlab.com/pseudoramble/trees/blob/9ed327d2824c06202ffb55c7cd77506aee57009c/Trees.Core/AVL.fs#L64) the AVL tree is not balanced anymore. We need to rotate.
  * [Since our tree is heavy to the right](https://gitlab.com/pseudoramble/trees/blob/9ed327d2824c06202ffb55c7cd77506aee57009c/Trees.Core/AVL.fs#L44), we performed a [single left rotation](https://gitlab.com/pseudoramble/trees/blob/9ed327d2824c06202ffb55c7cd77506aee57009c/Trees.Core/AVL.fs#L11).
  * This means making a new `TreeNode` where the left subtree is a new `TreeNode` that holds onto the original left value and the original right's left subtree.

Now what if your friend decided he wanted to do it in almost alphabetical order?

    > let f1 = AVL.create "AFreudOfMine" |> AVL.add "LowHangingFruit" |> AVL.add "ClipOnMullet";;
    val f1 : Node.TreeNode<string> =
      TreeNode
        ("ClipOnMullet",TreeNode ("AFreudOfMine",Leaf,Leaf),
        TreeNode ("LowHangingFruit",Leaf,Leaf))

Once again, nice and balanced. What happened?

* The first two steps are the same as above.
* Then we add a node to the left of the right of the root.
  * Since [`h(root.l) - h(root.r) = -2`](https://gitlab.com/pseudoramble/trees/blob/9ed327d2824c06202ffb55c7cd77506aee57009c/Trees.Core/AVL.fs#L64) the AVL tree is not balanced anymore. We need to rotate.
  * [Since our tree is sorta heavy to the right](https://gitlab.com/pseudoramble/trees/blob/9ed327d2824c06202ffb55c7cd77506aee57009c/Trees.Core/AVL.fs#L46) we perform a double left rotation.
  * This means first making a new `TreeNode` for the right subtree (and performing a [`rotateRight`](https://gitlab.com/pseudoramble/trees/blob/9ed327d2824c06202ffb55c7cd77506aee57009c/Trees.Core/AVL.fs#L19) on that). We then perform a `rotateLeft` on this new `TreeNode` for our adjusted result.

## Step 2 - Remove from the tree

We're covered from your friend adding values in weird orders, but of course your most indecisive friend is removing them willy-nilly. What happens?

    > let f2 = AVL.create "AFreudOfMine" |> AVL.add "ClipOnMullet" |> AVL.add "LowHangingFruit" |> AVL.add "MyNameIsURL";;
    val f2 : Node.TreeNode<string> =
      TreeNode
        ("ClipOnMullet",TreeNode ("AFreudOfMine",Leaf,Leaf),
        TreeNode ("LowHangingFruit",Leaf,TreeNode ("MyNameIsURL",Leaf,Leaf)))

    > let f3 = AVL.remove "AFreudOfMine" f2;;
    val f3 : Node.TreeNode<string> =
      TreeNode
        ("LowHangingFruit",TreeNode ("ClipOnMullet",Leaf,Leaf),
        TreeNode ("MyNameIsURL",Leaf,Leaf))

The nice part about this is that once you get the rotations, additions and removals aren't terribly different. The steps for this case look like the following:

* First do the normal creation/addition steps like we did earlier.
* Next we remove the node to the left of the root.
  * [The removal of the node is the same as the regular BST](https://gitlab.com/pseudoramble/trees/blob/9ed327d2824c06202ffb55c7cd77506aee57009c/Trees.Core/AVL.fs#L115). After the removal (as the recursion unwinds) we check to see if the tree is balanced.
  * Since [`h(root.l) - h(root.r) = -2`](https://gitlab.com/pseudoramble/trees/blob/9ed327d2824c06202ffb55c7cd77506aee57009c/Trees.Core/AVL.fs#L131) the AVL tree is not balanced anymore. We need to rotate.
  * [Perform same left rotation strategy as before](https://gitlab.com/pseudoramble/trees/blob/9ed327d2824c06202ffb55c7cd77506aee57009c/Trees.Core/AVL.fs#L134).

This is repeated for the other rotations scenarios.

## Step 3 - We Are Actually Done

We made it! We have a tree that stays balanced (in all the cases I tested for). Your friends are now free to grow their username lists as wildly as they want, and still have a (somewhat) easy time looking them up.

If you've made it through all the parts, thanks for sticking with it. We covered some ground, so in summary:

* We talked about the issues of keeping items that can be ordered in simple lists (including just sorting them always).
* We talked about how Binary Search Trees help describe the order of data by separating it into nodes.
  * Those nodes have values in a left subtree whose value is less than the root node.
  * Those nodes have values in a right subtree whose value is greater than the root node.
  * This lets us search through sorted data quickly. `O(log(n))` quickly in Computer Science terms.
* Part 3 (AVL Trees). Finally, we talked about how to keep trees balanced using an AVL tree (that's this piece).