<script lang="ts">
  import { onMount } from 'svelte';
  let faded = false;
  let timeout: ReturnType<typeof setTimeout>;

  onMount(() => {
    timeout = setTimeout(() => {
      faded = true;
    }, 3000);
    return () => clearTimeout(timeout);
  });
</script>

<style>
.neon-header {
  font-family: 'Yellowtail', cursive;
  font-size: 128px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px auto 20px auto;
  padding: 18px 40px;
  border-radius: 18px;
  font-size: 1.5rem;
  color: #fff;
  background: #181a20;
  box-shadow: 0 0 12px purple, 0 0 24px purple, 0 0 36px purple;
  border: 2px solid purple;
  text-shadow: 0 0 8px purple, 0 0 16px purple;
  opacity: 1;
  transition: opacity 1.2s ease;
  max-width: 80vw;
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  text-shadow:
    0 0 7px #fff,
    0 0 10px #fff,
    0 0 21px #fff,
    0 0 42px #f09,
    0 0 82px #f09,
    0 0 92px #f09,
    0 0 102px #f09,
    0 0 151px #f09;
}
.neon-header.fade {
  opacity: 0;
}
</style>

<div class="neon-header {faded ? 'fade' : ''}">CLICK ANYWHERE</div>
