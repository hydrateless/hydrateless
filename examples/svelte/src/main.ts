import { mount } from 'svelte';
import 'hydrateless/hydrateless.css';
import App from './App.svelte';

export default mount(App, { target: document.getElementById('app')! });
