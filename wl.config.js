const getMetroDefaultsForMask = (mask = '')  => {
    const defaults = require("metro-config/src/defaults/defaults");
    _getExtsForMask = (_mask, exts = []) => {
        if (!_mask) { return exts;}
        // setting up extension precedence and adding mask precedence as high beore defaults. eg: 'wl.js' > 'js'
        return ((f,xs) => xs.reduce((acc,x) => acc.concat(f(x)), []))(ext => [`${_mask}.${ext}`, ext], exts);
    }
    return ({
        ...defaults,
        sourceExts: _getExtsForMask(mask, defaults.sourceExts),
    })
};


module.exports = {
    maskConfig: {
        sourceExts: getMetroDefaultsForMask('mask').sourceExts,
    }
};