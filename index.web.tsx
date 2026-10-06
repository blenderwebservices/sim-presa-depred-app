import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('SimPresaDepredApp', () => App);
const rootTag = document.getElementById('root');
if (rootTag) {
  AppRegistry.runApplication('SimPresaDepredApp', {
    initialProps: {},
    rootTag: rootTag as any,
  });
}
