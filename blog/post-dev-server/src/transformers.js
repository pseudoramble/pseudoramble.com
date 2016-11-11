const toLink = entry => ({ 
  title: entry.title,
  url: `/blog/entry/${entry.name}.html`
});

module.exports = {
  toLink
};