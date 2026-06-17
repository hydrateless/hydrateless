import { useState } from 'react';
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
  ToastRegion,
  useToast,
} from '@hydrateless/react';

function Toolbar() {
  const toast = useToast();
  return (
    <div className="row">
      <Dropdown>
        <DropdownTrigger>
          <Button>Actions</Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem onSelect={() => toast.show('Edited')}>Edit</DropdownItem>
          <DropdownItem onSelect={() => toast.show('Duplicated')}>Duplicate</DropdownItem>
          <DropdownSeparator />
          <DropdownItem onSelect={() => toast.show('Deleted')}>Delete</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Button intent="primary" onClick={() => toast.show('Saved!')}>
        Save
      </Button>
    </div>
  );
}

export function App() {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(3);
  const [fruit, setFruit] = useState('');

  return (
    <main className="page">
      <header>
        <Breadcrumb>
          <BreadcrumbItem href="#">Home</BreadcrumbItem>
          <BreadcrumbItem href="#">Examples</BreadcrumbItem>
          <BreadcrumbItem current>React</BreadcrumbItem>
        </Breadcrumb>
        <h1>
          Hydrateless for React <Badge intent="primary">v0.5</Badge>
        </h1>
      </header>

      <Toolbar />

      <Alert intent="info" title="First-class components">
        The same component suite ships for React, Vue, and Svelte.
      </Alert>

      <Tabs defaultValue="overview">
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
              <Button onClick={() => setOpen(true)}>Open modal</Button>
            </CardBody>
          </Card>
        </TabPanel>

        <TabPanel>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input type="email" placeholder="you@example.com" />
            <FieldHelp>We never share it.</FieldHelp>
          </Field>
        </TabPanel>

        <TabPanel>
          <Combobox value={fruit} onValueChange={setFruit}>
            <ComboboxInput placeholder="Search fruit…" />
            <ComboboxList>
              <ComboboxOption value="apple">Apple</ComboboxOption>
              <ComboboxOption value="banana">Banana</ComboboxOption>
              <ComboboxOption value="cherry">Cherry</ComboboxOption>
            </ComboboxList>
          </Combobox>
          <p>Selected: {fruit || 'None'}</p>
        </TabPanel>
      </Tabs>

      <Pagination page={page} count={10} onPageChange={setPage} />

      <Modal open={open} onOpenChange={setOpen}>
        <ModalHeader>
          <h2>Confirm</h2>
        </ModalHeader>
        <ModalBody>
          <p>Are you sure you want to continue?</p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button intent="primary" onClick={() => setOpen(false)}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>

      <ToastRegion />
    </main>
  );
}
