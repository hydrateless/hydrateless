<script lang="ts">
  import Pagination from '../../src/components/Pagination.svelte';

  let page = $state(3);
</script>

<Pagination {page} count={10} onPageChange={(p) => (page = p)} />
<output data-testid="page">{page}</output>
