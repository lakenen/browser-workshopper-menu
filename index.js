var util = require('util')
  , sidenote = require('sidenote')
  , browserMenu = require('browser-menu')
  , progress = require('browser-workshopper-progress')

module.exports = function (opts) {
  'use strict';

  var menu = browserMenu({
      x: opts.x || 0
    , y: opts.y || 0
    , bg: opts.bg || '#61FF90'
    , fg: opts.fg || '#34363B'
  })

  var exercises = opts.exercises || {}

  menu.reset()
  menu.write(util.format('<strong>%s</strong>\n', opts.title.toUpperCase()))
  menu.element.style.margin = '2em'
  document.title = opts.title

  var lcat = null
    , cats = []
    , keys = Object.keys(exercises)

  var rows = sidenote(keys.map(function(name, i) {
    var dir = exercises[name]
      , parts = name.match(/^(.*?)([A-Z][^\:]+\:)(.*?)$/)
      , category = cats[i] = parts[2].slice(0, -1)

    var newname = parts
      .slice(1, 2)
      .concat(parts.slice(3))
      .join('')
      .replace(/\s+/, ' ')

    exercises[newname] = exercises[name]

    return [
      newname
    , progress.get(dir) ? '[COMPLETE]' : '          '
    ]
  }), {
    distance: 10
  })

  rows = rows.map(function(row, i) {
    var cat = cats[i]
      , line = '------------------------------------------'

    if (lcat !== cat) {
      line = '- <span><span>' + cat + '</span></span> ' + line.slice(cat.length)
      menu.write(line + '\n')
      lcat = cat
    }

    return menu.add(row), row
  })

  menu.on('select', function(label) {
    label = keys[rows.indexOf(label)]

    if (!exercises[label]) return console.error(label)

    window.location = exercises[label]
  })

  return menu
};
