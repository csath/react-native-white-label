import { createAppContainer } from 'react-navigation';
import AppNavigator from './containers/RootNavigator'
import theme from './styles/theme';

let color = theme.PRIMARY_COLOR;
export const setColor = (_color) => { color = _color};
export const getColor = () => color
export default createAppContainer(AppNavigator);