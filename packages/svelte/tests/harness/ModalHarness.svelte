<script lang="ts">
  import Modal from '../../src/components/Modal.svelte';
  import ModalBody from '../../src/components/ModalBody.svelte';

  let { controlled = true }: { controlled?: boolean } = $props();
  let open = $state(false);
  let changes = $state<boolean[]>([]);
</script>

{#if controlled}
  <button type="button" onclick={() => (open = true)}>open</button>
  <button type="button" onclick={() => (open = false)}>close</button>
  <Modal bind:open onOpenChange={(o) => changes.push(o)}>
    <ModalBody>Body</ModalBody>
  </Modal>
  <output data-testid="open">{open}</output>
{:else}
  <Modal defaultOpen onOpenChange={(o) => changes.push(o)}>
    <ModalBody>Body</ModalBody>
  </Modal>
{/if}
<output data-testid="changes">{changes.join(',')}</output>
