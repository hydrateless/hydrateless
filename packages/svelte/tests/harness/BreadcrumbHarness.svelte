<script lang="ts">
  import Breadcrumb from '../../src/components/Breadcrumb.svelte';
  import BreadcrumbItem from '../../src/components/BreadcrumbItem.svelte';
</script>

<Breadcrumb>
  <BreadcrumbItem href="/">Home</BreadcrumbItem>
  <BreadcrumbItem href="/docs">Docs</BreadcrumbItem>
  <BreadcrumbItem current>Guide</BreadcrumbItem>
</Breadcrumb>
