const wlAuditor = require('./wl-auditor');

module.exports = {
    generateMaskingInternalConfigs: wlAuditor.generateMaskingInternalConfigs,
    getMetroDefaultsForMask: wlAuditor.getMetroDefaultsForMask,
}