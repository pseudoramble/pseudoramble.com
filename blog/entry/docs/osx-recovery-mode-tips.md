<div class="article-header">OS X Recovery Mode Tips</div>

I've recently taken up the adventure of looking at my girlfriend's semi-dead Macbook Pro. I had been neglecting the poor thing for too long, and it was time to get it up and running.

I think (or maybe hope) the issue may be a corrupt filesystem, perhaps in the boot blocks or the Volume Header. While it can't boot into OSX properly anymore, the personal data recovered from the disk seems to be in-tact. Thankfully, the OSX Recovery Mode (in this case) has made it fairly simple to get this data back. Not without a few hiccups of course.

First off, what is Recovery Mode?
-------------------

Recovery Mode is a special feature on a Mac to allow a user access to a basic environment on the machine. This mostly allows for diagnostics to be performed on the machine (memory tests, filesytem tests and repairs, etc.). It does provide some other utilites though, such as recovery using Time Machine and a few handy command line tools.

For those familiar with Linux, just imagine loading an image into memory from a disk or thumb drive (a very similar setup). For people who are used to Windows or OSX, imagine the little OS you get to run when installing from a boot disk.

To access Recovery Mode, hold CMD-R during boot. After a minute or so, you should be dropped into a screen like this:

![OS X Recovery Mode Screenshot](http://cdn3.tekrevue.com/wp-content/uploads/2014/09/osx-recovery.jpg)

One other note...
-------------------

While I hope you gather good tips and ideas while reading this, realize you should also have a good laugh at my expense at some parts. The moral of the story is, planning ahead can help.

Tips
-------------------

1. **Avoid a situation where you need to do a backup from Recovery Mode.**<br />
In this case, we weren't properly prepared with a backup on this machine. It's obviously much better to plan for later where possible. 
2. **Use Time Machine to perform your recovery, if possible.**<br />
While I'm not very familiar with Time Machine yet, it seems like a useful utility to take advantage of. And since Recovery Mode supports restoring a machine with this, it seems worthwhile to spare yourself in the future.
3. **Adjust the powermanagement settings to disable sleep mode.**<br />
Recovery Mode appears configured to have the machine go to sleep after 10 minutes by default (power adapter or otherwise). Since the system won't adjust the timer for sleeping due to something on the command line, this will terminate your remote backup attempts.<br />
    1. *First, check the power settings*. <br />Do this by running `pmset -g`. This lists off current settings such as if sleep mode or disk-sleep mode are on, how long until something turns off, etc.
    2. *Next, disable sleep mode if needed for the disk and the system*.<br /> Do this by running `pmset -a sleep 0`, then run `pmset -a disksleep 0`. The zero in this case denotes how many minutes until either of these settings is applied.
4. **Ensure your backup machine is reliable**<br />
During the backup, I found that my typical backup machine was being quite unreliable (dropping its connection to the network). It's also not the fastest machine, which just meant the process took even longer than one would like. Switching over to my primary computer which is much more reliable seemed to help greatly.
5. **Ensure your backup machine has enough disk space**<br />
During the backup onto my primary machine, I found out that I was lacking in the disk space needed for this.<br />
    1. *Calculate the size of the directory to back up.* <br/ >Do this by running `du -sh`. It should give you the total directory structure's size in GB's (a more 'human-readable' format if you will).
    2. *Check for duplicated items*<br />It turns out there were duplicated items within the user's Library directory (all of the User directory essentially). Skipping those bought me a ton of extra space. I don't know the reason behind their duplication yet however.
6. **Get your backup plan in place after you've recovered**
Now that I've got the backup finished and the machine running once again, I need to put into place some kind of backup strategy. On my current (Linux) machine, I use a simple rsync setup to a few different locations, which would be sufficient here too. That being said, Time Machine seems like a worthwhile thing to investigate first.
