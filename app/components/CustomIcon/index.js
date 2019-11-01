import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import customIconConfig from './selection';

export default createIconSetFromIcoMoon(customIconConfig);


/**
 * when updating font please upload existing selection.json to icomoon 
 * and edit font icons and then replace selection.json and font inside "../../fonts" directroy
 */