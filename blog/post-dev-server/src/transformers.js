const toLink = entry => ({ 
  title: entry.name,
  url: `/blog/entry/${entry.name}.html`
});

module.exports = {
  toLink
};