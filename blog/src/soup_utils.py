def add_class(node, class_):
    if node and hasattr(node.attrs, 'class') and node['class'].find(class_) < 0:
        node['class'] += " " + class_
    elif node and not hasattr(node.attrs, 'class'):
        node['class'] = class_
        
def remove_class(node, class_):
    if node and hasattr(node.attrs, 'class') and node['class'].find(class_) > -1:
        node['class'].replace(class_, '')
