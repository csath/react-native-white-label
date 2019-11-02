/*
THIS INCLUDES ALL APP MASKING CONFIGS TO BE USED IN WHITE-LABELING
COPYRIGHTS @ csath

CONFIG OBJECT STRUCTURE
    {
        defaultMasK: STRING, >>>> (one of the mask names from maskList. If specified and no mask argument passed this configs will be picked up for whitelabeling)
        maskList: ARRAY [
            OBJECT {
                mask: STRING, >>>> (is used as the js file extension; *should be lowercase)
                appName: STRING, >>>> (application name)
            }
        ]
    }
*/

module.exports = {
    defaultMask: '',
    maskList: [
        {
            mask: 'ue',
            assetsDirIn: '',
            assetsDirOut: '',
            appName: 'chanaka'
        },
        {
            mask: 'sr',
            assetsDirIn: '',
            assetsDirOut: '',
            appName: 'chanaka'
        },
    ]
};