/*
THIS INCLUDES ALL APP MASKING CONFIGS TO BE USED IN WHITE-LABELING
COPYRIGHTS @ csath

CONFIG OBJECT STRUCTURE
    {
        defaultMasK: STRING, >>>> (one of the mask names from maskList. If specified and no mask argument passed this configs will be picked up for whitelabeling)
        promptDirUnlink: BOOLEAN (default: true), >>>> (prompt for unlink confirmation on any directory list in dirCopy otherthan running mask driCopy destinationDri)
        maskList: ARRAY [
            OBJECT {
                mask: STRING, >>>> (is used as the js file extension; *should be lowercase)
                appName: STRING, >>>> (application name)
                dirCopy: ARRAY [
                    {
                        sourceDri: STRING, >>>> (exisitng directory path of the folder or file relative to project root folder)
                        destinationDri: STRING, >>>> (directory path of the folder or file to be copied relative to project root folder)
                        overwrite: BOOLEAN (default: false), >>>> (if you need to remove all existing files in destinationDir)
                    }
                ]
            }
        ]
    }
*/

module.exports = {
    defaultMask: 'ue',
    promptDirUnlink: true,
    maskList: [
        {
            mask: 'ue',
            appName: 'chanaka',
            dirCopy: [
                // to copy images
                {
                    sourceDri: './wl-assets/images',
                    destinationDri: './app/images',
                    overwrite: true
                },
                // to copy android app icons
                {
                    sourceDri: './wl-assets/android/appIcons',
                    destinationDri: './android/app/src/main/res',
                    overwrite: false
                },
                // // to copy ios app icons
                {
                    sourceDri: './wl-assets/ios/appIcons/',
                    destinationDri: './ios/WhiteLabel/Images.xcassets',
                    overwrite: true
                }
            ]
        },
        // {
        //     mask: 'sr',
        //     appName: 'chanaka',
        //     dirCopy: [
        //         // to copy images
        //         {
        //             sourceDri: './wl-assets/images',
        //             destinationDri: './app/images',
        //             overwrite: true
        //         },
        //         // to copy android app icons
        //         {
        //             sourceDri: './wl-assets/android/appIcons',
        //             destinationDri: './android/app/src/main/res',
        //             overwrite: false
        //         },
        //         // to copy ios app icons
        //         {
        //             sourceDri: './wl-assets/ios/appIcons',
        //             destinationDri: './ios/WhiteLabel/Images.xcassets',
        //             overwrite: true
        //         }
        //     ]
        // },
    ]
};