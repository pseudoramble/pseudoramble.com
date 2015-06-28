from bs4 import BeautifulSoup
from pathlib import Path
from datetime import date

import sys
import soup_utils

def initialize_view(entry_markup, template_markup):
    temp_view = BeautifulSoup(entry_markup)
    view = BeautifulSoup(template_markup)

    view.find('article').clear()
    contents = temp_view.find('body').contents

    for node in contents:
        if node != '\n':
            view.find('article').append(node)

    return view

def store_view(view, filename):
    with open(filename, 'w') as output_fd:
        output_fd.write(view.prettify())

def add_previous_entries(view, prev_entries):
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

def change_dates(view, is_new_entry):
    published_node = view.new_tag('span')
    modified_node = view.new_tag('span')
    dates_node = view.new_tag('div')
    current_date = date.today()
    
    if is_new_entry:
        soup_utils.add_class(modified_node, 'hidden')
    else:
        soup_utils.remove_class(modified_node, 'hidden')
        
    published_node.string = "Published on %s " % current_date.isoformat()
    modified_node.string = "Modified on %s " % current_date.isoformat()

    soup_utils.add_class(dates_node, 'dates')
    dates_node.append(published_node)
    dates_node.append(modified_node)
    view.find('article').insert(1, dates_node)

def _get_previous_entries_(output_dir, cur_filename):
    return [entry for entry in Path(output_dir).glob('*.html') if cur_filename.find(entry.name) < 0]
    
if len(sys.argv) > 3:
    input_filename, output_filename, template_filename = (sys.argv[1], sys.argv[2], sys.argv[3])
    output_file_path = Path(output_filename)
    output_dir = output_file_path.parent
    prev_entries = _get_previous_entries_(output_dir, output_filename)[:5]
    is_new_entry = not output_file_path.exists()

    with open(input_filename) as input_fd, open(template_filename) as template_fd:
        entry_markup = input_fd.read()
        template_markup = template_fd.read()

    entry_view = initialize_view(entry_markup, template_markup)

    add_previous_entries(entry_view, prev_entries)
    change_dates(entry_view, is_new_entry)

    store_view(entry_view, output_filename)
