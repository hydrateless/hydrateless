import { onBeforeUnmount, onMounted, ref, toValue, watch, type MaybeRefOrGetter } from 'vue';

/** Clipboard feedback shared by code examples and installation commands. */
export function useClipboard(source: MaybeRefOrGetter<string>) {
  const status = ref<'idle' | 'copied' | 'failed'>('idle');
  const ready = ref(false);
  onMounted(() => {
    ready.value = true;
  });
  let timer: ReturnType<typeof setTimeout> | undefined;
  let revision = 0;
  function clear() {
    revision += 1;
    clearTimeout(timer);
    status.value = 'idle';
  }
  watch(() => toValue(source), clear);
  onBeforeUnmount(clear);

  async function copy() {
    clear();
    const current = revision;
    try {
      await navigator.clipboard.writeText(toValue(source).trimEnd());
      if (current !== revision) return;
      status.value = 'copied';
    } catch {
      if (current !== revision) return;
      status.value = 'failed';
    }
    timer = setTimeout(clear, 2000);
  }
  return { copy, status, ready };
}
