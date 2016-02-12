var fs = require('fs');
var path = require('path');

/*
 * GET home page.
 */
exports.index = function (req, res) {
    res.render('index', {
        backgrounds: getFiles()
    });
};

/*
 * GET presenter view
 */
exports.present = function (req, res) {
    res.render('present', { title: 'Present' });
};

/*
 * GET the slides
 */
exports.slides = function (req, res) {
    res.json({
        backgrounds: getFiles(),
        presentations: getPresos()
    });
};

function getFiles() {
    var uri = '../public/images/slides';
    uri = path.join(__dirname, uri);

    return fs.readdirSync(uri).filter(filterOutDirs);
}

function getPresos() {
    var uri = '../public/images/presos';
    uri = path.join(__dirname, uri);

    var dirs = fs.readdirSync(uri).filter(filterOutDirs);

    var presos = {};

    for (var i in dirs) {
        var presoDir = path.join(uri, dirs[i]);
        presos[dirs[i]] = fs.readdirSync(presoDir).filter(filterOutDirs);
    }

    return presos;
}

function filterOutDirs(filename) {
    return filename[0] !== '.';
}