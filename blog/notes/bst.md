Maybe interesting for another blog entry:

A Binary Search Tree is part of a family of concepts called a Graph. A Graph is a series of "nodes" and "edges" where a node represents something, and the edge represents its relation to something else.

Here's a valid graph:

    =======      =======
    |  A  | ---- |  B  |
    =======      =======

This says the node "A" has an edge to "B", and likewise the node "B" has an edge to "A". This is called an *Undirected Graph* which means that we can go between two nodes with an edge in either direct (from "A" to "B" and vice-versa). It's a two-way street, if you will. This also forms a *cycle* where one can get "stuck" in a loop going back-and-forth between a series of nodes.

Here's another graph:

    =======      =======
    |  A  | ---> |  B  |
    =======      =======

This says the node "A" has an edge to "B". Unlike the 1st example, the node "B" doesn't have an edge to "A" though. This is called a *Directed Graph* which means we can go from a node where an edge is pointing to, but not the other way (from "A" to "B" is fine, but we can't traverse from "B" to "A"). Also, this specific example **does not** form a cycle. We can't get stuck in a loop. We can stop at the node "B" and that's it.

Binary Search Trees are in the latter group called Directed Acyclic Graphs (they specify what way they can go, and you can't get into a cycle). They also do three other noteworthy things:

1. A node can only have two edges ("left" and "right" if you will).
1. Smaller nodes than the node itself will be attached to the left.
1. Larger nodes than the node itself will be attached to the right.

Here's an example of a BST:

              =======
              |  C  |
              =======
             |       |
             v       v
       =======       =======
       |  B  |       |  E  |
       =======       =======

In this example, "C" is the called the root of the tree. Any values which come before "C" in the letter system will be placed to the left. Likewise, and values which come after "C" will be placed to the right. This applies for any node in the BST. If I added "A" for example, it would be on the left value of the "B" node. If I added "F" for example, it would be on the right edge of "E".