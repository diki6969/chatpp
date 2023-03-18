<script lang="ts">
  import type { CreateCompletionResponse } from 'openai'
  import { SSE } from 'sse.js'

  let context = ''
  let loading = false
  let error = false
  let answer = ''

  const handleSubmit = async () => {
    loading = true
    error = false
    answer = ''

    const eventSource = new SSE('/api/explain', {
      headers: {
        'Content-Type': 'application/json'
      },
      payload: JSON.stringify({ context })
    })

    context = ''

    eventSource.addEventListener('error', (e) => {
      error = true
      loading = false
      console.error(e)
      alert('Something went wrong!')
    })

    eventSource.addEventListener('message', (e) => {
      try {
        loading = false

        if (e.data === '[DONE]') {
          return
        }

        const completionResponse: CreateCompletionResponse = JSON.parse(e.data)

        const [{ text }] = completionResponse.choices

        answer += text
      } catch (err) {
        error = true
        loading = false
        console.error(err)
        alert('Something went wrong!')
      }
    })

    eventSource.stream()
  }
</script>

<main>
  <h2>Halo, Saya Ikyy<br>Asisten Virtualmu</h2>

  <form on:submit|preventDefault={handleSubmit}>
    <label for="context">Silahkan ketikkan pertanyaanmu<br>dikolom dibawah ini:</label>
    <textarea name="context" rows="5" bind:value={context} />

    <button disabled={!context}>Tanyakan</button>

    {#if loading}
      <p>Loading...</p>
    {:else if error}
      <p>Something went wrong. Please try again later.</p>
    {:else if answer}
      <div class="pt-4">
        <p>Jawaban:</p>
        <p>{answer}</p>
      </div>
    {/if}
  </form>
</main>
