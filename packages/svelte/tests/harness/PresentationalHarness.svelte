<script lang="ts">
  import Alert from '../../src/components/Alert.svelte';
  import Badge from '../../src/components/Badge.svelte';
  import Button from '../../src/components/Button.svelte';
  import Card from '../../src/components/Card.svelte';
  import CardHeader from '../../src/components/CardHeader.svelte';
  import CardTitle from '../../src/components/CardTitle.svelte';
  import CardBody from '../../src/components/CardBody.svelte';
  import CardFooter from '../../src/components/CardFooter.svelte';
  import Avatar from '../../src/components/Avatar.svelte';
  import Separator from '../../src/components/Separator.svelte';
  import Spinner from '../../src/components/Spinner.svelte';
  import Progress from '../../src/components/Progress.svelte';
  import Kbd from '../../src/components/Kbd.svelte';
</script>

<main>
  <Alert intent="info" title="Heads up">Something happened.</Alert>
  <Badge intent="primary">New</Badge>
  <Card>
    <CardHeader>
      <CardTitle>Title</CardTitle>
    </CardHeader>
    <CardBody>Body content</CardBody>
    <CardFooter><Button>OK</Button></CardFooter>
  </Card>
  <Avatar alt="">AL</Avatar>
  <Separator />
  <Spinner label="Loading" />
  <Progress value={40} max={100} />
  Press <Kbd>Esc</Kbd> to close.
</main>
