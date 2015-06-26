<div class="article-header">How I Run This Blog</div>
As I write this, I'm currently creating the code to operate this blog. These are essentially my notes, a new entry, and a neat outline of things I'm creating.

This blog has a few simple strategies:

* None of this content needs to be dynamically generated at run-time
* Almost none of this content needs JS
* I want to be able to start writing, previewing, publishing, and sharing new entries without much thought

With that in mind, my system is fairly simple:

* Emacs - Write the entries, issue the commands.
* Python - Configures markup as needed (BeautifulSoup).
* Markdown - Used to write articles themselves.
* Apache - Hosts actual content (on DigitalOcean).

## Emacs ##

My Emacs code consists of a few small functions:

* *'blog-new-entry*
* *'blog-gen-entry*
* *'blog-publish-entry*
* *'blog-socialize-entry*

### 'blog-new-entry ###

'blog-new-entry visits a new file, given the name of the filename to use. It then switches the current window to the newly created buffer, and sets it as the current buffer. It does not save the current buffer by default.

* I write my filenames in-this-form.
* The directory where entries are stored is under the *blog-entry-dir* binding.
* The filetype used for new entries is stored under the *blog-file-type* binding.

*Example*: Suppose then I did the following:

`M-x blog-new-entry <RET> test-entry`.

I have *blog-file-type* set to ".md" and *blog-entry-dir* set to `~/blog/entries/`. The created entry would look something like `~/blog/entries/test-entry.md` and would be ready for editing.

### 'blog-gen-entry ###

*'blog-gen-entry* takes what content has been created so far and smashes it into its HTML form. We do roughly the following:

* Generate Markdown output
* Place output into new template copy
* Do any markup changes needed

We're issuing `M-x markdown-export 'temp.html'` to get the initial entry. We then use Python and BS4 to smush it together to make it look like a reasonable entry. See the Python section for more details.

### 'blog-publish-entry ###

*'blog-publish-entry* is what we'll use to take the generated & formatted markup, push it into version control, and finally do any last things we need to do to get it on our web server.

Firstly, we'll use git-status to enter the Emacs VC buffer. By default, we'll mark all files to be added. A commit message will be brought up to enter any changes that have happened.

## Python ##
To supplement the creation of the markup, I'm using Python & BeautifulSoup. Emacs issues out a call with the following inputs to the file:

* input_filename - The (absolute) name of the file containing the generated markup
* output_filename - The (absolute) name of the file where the updated markup will be stored
* template_filename - The (absolute) name of the file where we'll put generated markup into

There may be a way to handle this portion via Emacs. For now though, it seemed simple enough to try it this way. I may modify it later, but for the time being this was the easiest way forward. It seems to work fine too.
