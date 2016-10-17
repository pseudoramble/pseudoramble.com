#!/bin/bash

GENERATE_ENTRY_SCRIPT=~/Programming/Websites/pseudoramble.com/blog/src/generate_entry.py
BLOG_DOCS_DIR=~/Programming/Websites/pseudoramble.com/blog/entry/docs
BLOG_ENTRIES_DIR=~/Programming/Websites/pseudoramble.com/blog/entry
WEBSITE_ROOT_DIR=~/Programming/Websites/pseudoramble.com
BLOG_TEMPLATE_FILENAME=~/Programming/Websites/pseudoramble.com/blog/template.html
TEMP_OUTPUT_FILENAME=temp.html

if [ -z $1 ]; then
    echo "Please provide the name of the new blog doc to work on"
    exit 1;
fi

new_entry_name=$1
new_entry_doc_filename=$BLOG_DOCS_DIR/$new_entry_name.md

new_entry_output_filename=$BLOG_ENTRIES_DIR/$new_entry_name.html
new_entry_input_filename=$BLOG_DOCS_DIR/$TEMP_OUTPUT_FILENAME

index_filename=$WEBSITE_ROOT_DIR/index.html

if [ "$2" == "-d" ]; then
    echo "-------------------"
    echo "Variables used:"
    echo "  Doc name="$new_entry_doc_filename
    echo "  Output filename="$new_entry_output_filename
    echo "  Input filename="$new_entry_input_filename
    echo "  Index filename="$index_filename
    
    echo "-------------------"
    echo "Markdown output would be saved to "$new_entry_input_filename" for more processing"
    echo "The script "$GENERATE_ENTRY_SCRIPT" would be used to process "$new_entry_input_filename
    echo "It would be output to "$new_entry_output_filename
    echo "-------------------"
else
    markdown $new_entry_doc_filename > $new_entry_input_filename
    python $GENERATE_ENTRY_SCRIPT $new_entry_input_filename $new_entry_output_filename $BLOG_TEMPLATE_FILENAME $index_filename 
fi

exit 0