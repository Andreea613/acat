// @ts-ignore
import './src/assets/less/style.less';
import { App } from './src/App';

window.simulator = new App(document.body);
window.simulator.run();
