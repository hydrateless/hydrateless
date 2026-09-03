<script setup lang="ts">
import { ref } from 'vue';
import {
  Alert,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Combobox,
  ComboboxInput,
  ComboboxList,
  ComboboxOption,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSeparator,
  DropdownTrigger,
  Field,
  FieldHelp,
  FieldLabel,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Pagination,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  useToast,
} from '@hydrateless/vue';

const toast = useToast();
const open = ref(false);
const page = ref(3);
const fruit = ref('');
const email = ref('');

function onAction(value: string) {
  toast.show(`${value} selected`, { intent: value === 'delete' ? 'danger' : 'info' });
}
</script>

<template>
  <main class="page">
    <header>
      <Breadcrumb>
        <BreadcrumbItem href="#">Home</BreadcrumbItem>
        <BreadcrumbItem href="#">Examples</BreadcrumbItem>
        <BreadcrumbItem current>Vue</BreadcrumbItem>
      </Breadcrumb>
      <h1>Hydrateless for Vue <Badge intent="primary">Example</Badge></h1>
    </header>

    <div class="row">
      <Dropdown @select="onAction">
        <DropdownTrigger class="hl-button">Actions</DropdownTrigger>
        <DropdownMenu>
          <DropdownItem value="edit">Edit</DropdownItem>
          <DropdownItem value="duplicate">Duplicate</DropdownItem>
          <DropdownSeparator />
          <DropdownItem value="delete">Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Button intent="primary" @click="toast.show('Saved', { intent: 'success' })">Save</Button>
    </div>

    <Alert intent="info" title="First-class components">
      The same component suite ships for React, Vue, and Svelte.
    </Alert>

    <Tabs>
      <TabList>
        <Tab value="overview">Overview</Tab>
        <Tab value="form">Form</Tab>
        <Tab value="search">Search</Tab>
      </TabList>

      <TabPanel>
        <Card>
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardBody>
            <p>Accessible primitives built on semantic HTML and modern CSS.</p>
            <Button @click="open = true">Open modal</Button>
          </CardBody>
        </Card>
      </TabPanel>

      <TabPanel>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input v-model="email" type="email" placeholder="you@example.com" />
          <FieldHelp>We never share it.</FieldHelp>
        </Field>
      </TabPanel>

      <TabPanel>
        <Combobox v-model="fruit">
          <ComboboxInput placeholder="Search fruit…" />
          <ComboboxList>
            <ComboboxOption value="apple">Apple</ComboboxOption>
            <ComboboxOption value="banana">Banana</ComboboxOption>
            <ComboboxOption value="cherry">Cherry</ComboboxOption>
          </ComboboxList>
        </Combobox>
        <p>Selected: {{ fruit || 'None' }}</p>
      </TabPanel>
    </Tabs>

    <Pagination v-model:page="page" :count="10" />

    <Modal v-model:open="open">
      <ModalHeader><h2>Confirm</h2></ModalHeader>
      <ModalBody><p>Are you sure you want to continue?</p></ModalBody>
      <ModalFooter>
        <Button @click="open = false">Cancel</Button>
        <Button intent="primary" @click="open = false">Confirm</Button>
      </ModalFooter>
    </Modal>
  </main>
</template>
