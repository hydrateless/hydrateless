<script lang="ts">
  import Modal from '../../src/components/Modal.svelte';
  import ModalBody from '../../src/components/ModalBody.svelte';

  let open = $state(false);
</script>

<button type="button" onclick={() => (open = true)}>open</button>
<Modal bind:open>
  <ModalBody>Body</ModalBody>
</Modal>
