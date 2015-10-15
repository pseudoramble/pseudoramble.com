<div class="article-header">Understanding React - A Refactoring</div>

**To see the changes discussed in this entry, [check out this commit!](https://github.com/pseudoramble/listen-to-railroad-earth/commit/4ee25c46d48f6ad8b102a0280e0c1c218887198e)**

**To see the Listen to Railroad Earth player running, [check out this site!](http://104.236.199.146:3000/)**

Ever begin working on a set of code to get something working, only to realize that you can't make forward progress? That was me, while working on a [side project](https://github.com/pseudoramble/listen-to-railroad-earth).

See, my component named `Player` was trying to be quite smart. [You can see the original version of the file here](https://github.com/pseudoramble/listen-to-railroad-earth/blob/67a822908ab79c1be7e94772b98a43d710497a3b/src/client/app/components/Player/Player.jsx). `Player` was supposed to have the following features:

1. Showed the typical HTML5 audio controls.
2. The player would show the currently playing track
3. Had the ability to go to the previous & next tracks in a playlist.
4. If the player was left running, it would continue through the existing playlist.
5. If a new playlist was selected, it would reload with said playlist and begin playing that instead.

As you can see and probably imagine, `Player` was trying to be way too smart for everyone's good:

1. There was messy state to maintain.
2. There were edge cases to be detected and dealt with.
3. This component had no real sense of separation of concerns (code should serve one small set of purposes).

[React + Flux](http://facebook.github.io/flux/docs/overview.html) are put together to organize this setup so you avoid the situation I ended up in. Using a Flux architecture, you tend to force most data manipulating & related logic in Stores. This leaves React components to typically be more simplified, and focused on rendering said data.

The refactor looked like this:

* I modified the `Player` component to move all state-management into a Store.
* The Store and the `Player` component are then connected via an Action Creator and a Dispatcher.
* The Store then emits an event which the root component (`App` in this case) is looking for.
* `App` updates its state as needed.
* Finally, all subcomponents of `App` are updated (via `render()`) using only `props`.

A more visual sketch of the refactor might look like this:

    *User clicks next track*                                                              |-> (Reconfig setlist)
    ----------------                    ------------------                                -------------
    |              |  onTrackFinished   |                | {actionType : TRACK_FINISHED}  |           |
    | Player (jsx) | -----------------> | PlayerActions  | -----------------------------> | ShowStore | ----------
    |              |                    |                |     (Via the Dispatcher!)      |           |          |
    ----------------                    ------------------                                -------------          |
    ^                                                                                                            |
    |____________________________________________________________________________________________________________|
       (Emit an event to have the "root" component of the application update its state. Send props to Player.)
    
Once I had this realization, implementing new features (like previous/next, continuous playing of a setlist) became much more simplified. Keeping your concerns separated and only loosly connected really does work, to a degree.

**In closing, I'll leave you with a few clues that you may need to refactor your React component(s):**

1. You use `setState()` like a boss and you're not quite sure why.
2. There are a bunch of edge cases to handle in a component.
3. You're playing bug whack-a-mole (you fix one bug, only to create two more) in a component.
4. A component is doing lots of data manipulation.
5. Basic functionality seems to be impossible to enhance.
