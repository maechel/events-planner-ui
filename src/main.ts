import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App.vue';
import { router } from './router';
import './icons.ts';
import './assets/style.css';

// PrimeVue Services
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import DialogService from 'primevue/dialogservice';
import Tooltip from 'primevue/tooltip';

// PrimeVue Components
import Button from 'primevue/button';
import Avatar from 'primevue/avatar';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import Dialog from 'primevue/dialog';
import Panel from 'primevue/panel';
import InputNumber from 'primevue/inputnumber';
import MultiSelect from 'primevue/multiselect';
import Checkbox from 'primevue/checkbox';
import ToggleSwitch from 'primevue/toggleswitch';
import ToggleButton from 'primevue/togglebutton';
import Textarea from 'primevue/textarea';
import DatePicker from 'primevue/datepicker';
import Select from 'primevue/select';
import Skeleton from 'primevue/skeleton';
import Drawer from 'primevue/drawer';
import Chart from 'primevue/chart';
import Tag from 'primevue/tag';
import MeterGroup from 'primevue/metergroup';
import ProgressBar from 'primevue/progressbar';
import Timeline from 'primevue/timeline';
import Stepper from 'primevue/stepper';
import StepList from 'primevue/steplist';
import StepPanels from 'primevue/steppanels';
import StepItem from 'primevue/stepitem';
import Step from 'primevue/step';
import StepPanel from 'primevue/steppanel';

const app = createApp(App);
app.use(createPinia());
app.use(router);

app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            prefix: 'p',
            darkModeSelector: 'system',
        },
    },
});

// PrimeVue Services
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);

// PrimeVue Directives
app.directive('tooltip', Tooltip);

// PrimeVue Components
app.component('Button', Button);
app.component('Avatar', Avatar);
app.component('FontAwesomeIcon', FontAwesomeIcon);
app.component('InputText', InputText);
app.component('Password', Password);
app.component('Toast', Toast);
app.component('ConfirmDialog', ConfirmDialog);
app.component('Dialog', Dialog);
app.component('Panel', Panel);
app.component('InputNumber', InputNumber);
app.component('MultiSelect', MultiSelect);
app.component('Checkbox', Checkbox);
app.component('ToggleSwitch', ToggleSwitch);
app.component('ToggleButton', ToggleButton);
app.component('Textarea', Textarea);
app.component('DatePicker', DatePicker);
app.component('Select', Select);
app.component('Skeleton', Skeleton);
app.component('Drawer', Drawer);
app.component('Chart', Chart);
app.component('Tag', Tag);
app.component('MeterGroup', MeterGroup);
app.component('ProgressBar', ProgressBar);
app.component('Timeline', Timeline);
app.component('Stepper', Stepper);
app.component('StepList', StepList);
app.component('StepPanels', StepPanels);
app.component('StepItem', StepItem);
app.component('Step', Step);
app.component('StepPanel', StepPanel);

app.mount('#app');
