<script lang="ts">
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
    createToast,
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
  } from '@hydrateless/svelte';

  let toast: ReturnType<typeof createToast> | undefined = $state();
  $effect(() => {
    toast = createToast();
    return () => toast?.destroy();
  });

  let open = $state(false);
  let page = $state(3);
  let fruit = $state('');
  let email = $state('');
</script>

<main class="page">
  <header>
    <Breadcrumb>
      <BreadcrumbItem href="#">Home</BreadcrumbItem>
      <BreadcrumbItem href="#">Examples</BreadcrumbItem>
      <BreadcrumbItem current>Svelte</BreadcrumbItem>
    </Breadcrumb>
    <h1>Hydrateless for Svelte <Badge intent="primary">v0.4</Badge></h1>
  </header>

  <div class="row">
    <Dropdown>
      <DropdownTrigger>
        <Button>Actions</Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem onSelect={() => toast?.show('Edited')}>Edit</DropdownItem>
        <DropdownItem onSelect={() => toast?.show('Duplicated')}>Duplicate</DropdownItem>
        <DropdownSeparator />
        <DropdownItem onSelect={() => toast?.show('Deleted')}>Delete</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <Button intent="primary" onclick={() => toast?.show('Saved!')}>Save</Button>
  </div>

  <Alert intent="info" title="First-class components">
    The same component suite ships for React, Vue, and Svelte.
  </Alert>

  <Tabs>
    <TabList>
      <Tab>Overview</Tab>
      <Tab>Form</Tab>
      <Tab>Search</Tab>
    </TabList>

    <TabPanel>
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardBody>
          <p>Accessible primitives built on semantic HTML and modern CSS.</p>
          <Button onclick={() => (open = true)}>Open modal</Button>
        </CardBody>
      </Card>
    </TabPanel>

    <TabPanel>
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input type="email" bind:value={email} placeholder="you@example.com" />
        <FieldHelp>We never share it.</FieldHelp>
      </Field>
    </TabPanel>

    <TabPanel>
      <Combobox onValueChange={(v) => (fruit = v)}>
        <ComboboxInput placeholder="Search fruit…" />
        <ComboboxList>
          <ComboboxOption value="apple">Apple</ComboboxOption>
          <ComboboxOption value="banana">Banana</ComboboxOption>
          <ComboboxOption value="cherry">Cherry</ComboboxOption>
        </ComboboxList>
      </Combobox>
      <p>Selected: {fruit || '—'}</p>
    </TabPanel>
  </Tabs>

  <Pagination {page} count={10} onPageChange={(p) => (page = p)} />

  <Modal {open} onclose={() => (open = false)}>
    <ModalHeader><h2>Confirm</h2></ModalHeader>
    <ModalBody><p>Are you sure you want to continue?</p></ModalBody>
    <ModalFooter>
      <Button onclick={() => (open = false)}>Cancel</Button>
      <Button intent="primary" onclick={() => (open = false)}>Confirm</Button>
    </ModalFooter>
  </Modal>
</main>
