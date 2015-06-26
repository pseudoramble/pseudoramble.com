from bs4 import BeautifulSoup
from pathlib import Path

import sys

def initialize_view(entry_markup, template_markup):
    temp_view = BeautifulSoup(entry_markup)
    view = BeautifulSoup(template_markup)

    view.find('article').clear()
    contents = temp_view.find('body').contents

    for node in contents:
        if node != '\n':
            view.find('article').append(node)

    return view

def update_view(view, prev_entries):
    for prev_entry in prev_entries:
        with prev_entry.open() as prev_entry_fd:
            prev_soup = BeautifulSoup(prev_entry_fd.read())
            title = prev_soup.find('div', class_='article-header').string
            
        link = view.new_tag('a', href=prev_entry.name)
        link.string = title
        
        li = view.new_tag('li')
        li.append(link)
        
        view.find('ul', class_='previous-entries').append(li)

    return view

def store_view(view, filename):
    with open(filename, 'w') as output_fd:
        output_fd.write(view.prettify())

def _get_previous_entries_(output_dir, cur_filename):
    return [entry for entry in Path(output_dir).glob('*.html') if cur_filename.find(entry.name) < 0]
    
if len(sys.argv) > 3:
    input_filename, output_filename, template_filename = (sys.argv[1], sys.argv[2], sys.argv[3])
    output_dir = Path(output_filename).parent
    prev_entries = _get_previous_entries_(output_dir, output_filename)[:5]
    
    with open(input_filename) as input_fd, open(template_filename) as template_fd:
        entry_markup = input_fd.read()
        template_markup = template_fd.read()

    entry_view = initialize_view(entry_markup, template_markup)
    update_view(entry_view, prev_entries)
    store_view(entry_view, output_filename)
