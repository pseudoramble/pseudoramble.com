OCaml Setup
====================
I started playing around with OCaml maybe a year ago on-and-off. I _really_ enjoy the language. It's a general purpose language that supports a variety of styles (functional, OO, imperative) that's a dialect of ML. I highly recommend giving it a whirl!

That being said, I've found the setup of some of the tools quite frustrating. It was unclear why some tools were needed (or desired). Errors that I ran into also were not always clear. My hope is to reword [Real World OCaml's instructions](https://github.com/realworldocaml/book/wiki/Installation-Instructions) a bit with my own issues and understanding.xs

Since I use Arch Linux on this machine, some of the steps are Arch-specific (mostly around installing packages). Otherwise, I believe most of these steps should be fine on any Linux system. I'm unsure about whether or not they'll work out on OSX *(feel free to send me a Mac and I'll find out for you :))*.

Packages to Install
======================
Typical (stable/non-AUR) Packages
----------------------
You'll want to start by installing your distros OCaml package, as well as camlp4:
<pre>
<code>
    $ sudo pacman -Sy ocaml camlp4
</code>
</pre>
The ocaml package includes the compiler and a REPL for ocaml. For the sake of just running some basic code, or running prewritten code that only requires ocaml, this would be sufficient.

camlp4 is a tool which provides a preprocessor to the OCaml language. I don't know much about camlp4, but it does provide some functionality we'll see later like:

* #require
* #use
* #thread

Much like the C preprocessor, these are pieces of functionality run before interpreting and compiling OCaml code. 

AUR Packages
-----------------------
Many languages include their own package manager(s) (Ruby, Python, NodeJS, ...). OCaml is no exception via OPAM. This is what we need to install from the AUR.

In Arch Linux, the OPAM package currently depends on:

* clasp
* gringo
* aspcud

All of these tools are [more properly described here](http://potassco.sourceforge.net/). These packages seem to help OPAM resolve dependencies for the packages they provide. I'm unsure of how they work or why they are not bundled with the OPAM package, but they are needed to run OPAM.

An Arch Linux user can [install yaourt](https://github.com/archlinuxfr/yaourt) to deal stable & AUR packagess. Since this comes from the AUR itself it does require at least one manual AUR installation, but it does make installing AUR packages much more straightforward from this point on.

A quick run through of installing an individual AUR package looks like this (the net result should be installing clasp):
<pre>
<code>
    $ wget https://aur.archlinux.org/packages/cl/clasp/clasp.tar.gz
    $ tar xf clasp.tar.gz
    $ cd clasp
    $ makepkg -s
    $ sudo pacman -U clasp-3.0.6.tar.xz
</code>
</pre>

The process above needs to be repeated for each package listed that OPAM depends on. Once that's completed, you can install OPAM from the AUR.

OPAM Setup
======================
Now we need to do a little configuration of OPAM.

*OPAM keeps all package installs and configuration to the local user*! It means two things for the sake of this guide:

* If at any point something goes awry beyond this point (a step was done out of order say) you can delete this entire directory and start from here again.
  * This directory is ~/.opam by default.
* When we configure Emacs to run some of these tools, we are configuring the editor to use these to look for packages.

First you start off by initializing OPAM. The net result of this is that your current user's configuration is modified to know about OPAM and the packages it installs. It creates the ~/.opam directory for the user as well.

I recommend you stick with the default settings, as this is the easiest way to get going.
Once this is completed, you can test that your users environment variables were configured correctly by trying this:

<pre>
<code>
    $ echo $OCAML_TOPLEVEL_PATH
    /home/dswain/.opam/system/lib/toplevel
</code>
</pre>

This environment variable helps OCaml know where it should start looking for the correct REPL (or toplevel) and how to find it.

OPAM requires to know what compiler it should be using. This is because it manages source code packages and not binary packages. So it needs to know what to target when building a package you request.

Assuming you're running an up-to-date version of Arch Linux, you should be as up-to-date as possible. As of this writing, the default version is 4.02.1, and should be considered the "System compiler."

<pre>
<code>
    $ opam switch
    --     -- 3.11.2  Official 3.11.2 release
    --     -- 3.12.1  Official 3.12.1 release
    --     -- 4.00.0  Official 4.00.0 release
    --     -- 4.00.1  Official 4.00.1 release
    --     -- 4.01.0  Official 4.01.0 release
    --     -- 4.02.0  Official 4.02.0 release
    --     -- 4.02.1  Official 4.02.1 release
    system  C system  System compiler (4.02.1)
</code>
</pre>

If for some reason your compiler is not set to be the newest one, change it using the switch command of opam:

<pre>
<code>
    $ opam switch 4.02.1
    $ eval `opam config env` # Makes the shell evaluate a bunch of differnet env variables.
</code>
</pre>

Note that this can take some time, so don't stress if it takes a few minutes.

Installing OPAM Packages
=========================

