const { readdirSync, statSync } = require('fs');
const _ = require('lodash');

const writtenEntries = require('./entries.json');

const byNewestFirst = (first, second) => new Date(second.created) - new Date(first.created);
const byOldestFirst = (first, second) => new Date(first.created) - new Date(second.created);

const summonEntries = ({name = '', comparator = byNewestFirst, limit = 5}) =>
  _(writtenEntries)
      .sort(comparator)
      .dropWhile(entry => name ? entry.name.indexOf(name) < 0 : false)
      .slice(name && 1 || 0, name && (limit + 1) || limit)
      .value();

const before = (name, limit=5) => summonEntries({ name });
const after = (name, limit=5) => summonEntries({ name, comparator: byOldestFirst });

const latest = (name, limit=5) => summonEntries({});
const oldest = (name, limit=5) => summonEntries({ comparator: byOldestFirst });

const afoot = (name) => _.find(writtenEntries, { name });

module.exports = {
  afoot,
  after,
  before,
  latest,
  oldest
}