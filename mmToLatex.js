var mmconv = require(__dirname + '/mmconv.js');
var fs = require('fs');

var mapOwnProperties = function(obj, func) {
    for (var property in obj) {
        if (obj.hasOwnProperty(property)) {
            // console.log('mapOwnProperty obj[' + property + '] : ' + obj[property]);
            func(obj[property]);
        }
    }
};

var startNode = function (node, fileName, siblingCtx) {
    // fs.appendFileSync(fileName, '\\begin{itemize}\n');
    console.log(siblingCtx);
    if( node.icon ) {
        mapOwnProperties(node.icon, function(icon) {
            if(icon === 'full-1') {
                fs.appendFileSync(fileName, '\\chapter{' + node.TEXT + '}\n');
                return true;
            } else if(icon === 'full-2') {
                fs.appendFileSync(fileName, '\\section{' + node.TEXT + '}\n');
                return true;
            } else if(icon === 'full-3') {
                fs.appendFileSync(fileName, '\\subsection{' + node.TEXT + '}\n');
                return true;
            } else if(icon === 'full-4') {
                fs.appendFileSync(fileName, '\\subsubsection{' + node.TEXT + '}\n');
                return true;
            } else if(icon === 'forward') {
                if( siblingCtx.itemize ) {
                } else {
                    siblingCtx.itemize = true;
                    fs.appendFileSync(fileName, '\\begin{itemize}\n');
                }
                fs.appendFileSync(fileName, '\\item ');
                fs.appendFileSync(fileName, node.TEXT + '\n');
                return true;
            } else if(icon === 'up') {
                if( siblingCtx.enumerate ) {
                } else {
                    siblingCtx.enumerate = true;
                    fs.appendFileSync(fileName, '\\begin{enumerate}\n');
                }
                fs.appendFileSync(fileName, '\\item ');
                fs.appendFileSync(fileName, node.TEXT + '\n');
                return true;
            }
        });
    } else {
        fs.appendFileSync(fileName, node.TEXT + '\n\n');
    }
    return true;
};

var endNode = function (node, fileName) {
    // fs.appendFileSync(fileName, '\\end{itemize}\n');
};

var beginChildren = function (node, fileName, siblingCtx) {
    console.log('beginChildren');
    siblingCtx.itemize = false;
    siblingCtx.enumerate = false;
};

var endChildren = function (node, fileName, siblingCtx) {
    console.log('endChildren');
    if( siblingCtx.itemize ) {
        fs.appendFileSync(fileName, '\\end{itemize}\n');
    }
    if( siblingCtx.enumerate ) {
        fs.appendFileSync(fileName, '\\end{enumerate}\n');
    }
};

exports.latexWriter = function (map, fileName) {
    // console.log('latexWriter: ', map, fileName);

    fs.writeFileSync(fileName,
        '\\documentclass[12pt]{book}\n\\begin{document}\n\\title ');

    mmconv.traverseTreeCtx( map.node, { 
            beginChildren : function(node,ctx) { return beginChildren(node, fileName, ctx); },
            endChildren : function(node,ctx) { return endChildren(node, fileName, ctx); },
            entryFunction : function(node,ctx) { return startNode(node, fileName, ctx); },
            leaveFunction : function(node, ctx) { return endNode(node, fileName, ctx); }
        });

    fs.appendFileSync(fileName, '\n\\end{document}\n');
};