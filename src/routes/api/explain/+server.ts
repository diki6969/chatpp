import { OPENAI_KEY } from '$env/static/private'
import { oneLine, stripIndent } from 'common-tags'
import type { RequestHandler } from '@sveltejs/kit'
import type { CreateCompletionRequest } from 'openai'
import { error, Config } from '@sveltejs/kit'

export const config: Config = {
  kit: {
    target: '#svelte'
  },
  prerender: {
    crawl: true,
    enabled: true,
    entries: ['*']
  }
}

export const post: RequestHandler = async ({ request }) => {
  try {
    if (!OPENAI_KEY) {
      throw new Error('OPENAI_KEY env var not set')
    }

    const requestData = await request.json()

    if (!requestData) {
      throw new Error('Request data missing')
    }

    const { context } = requestData

    if (!context) {
      throw new Error('No context provided')
    }

    const prompt = stripIndent`
      ${oneLine`
        Saya adalah asisten virtual yang bernama Ikyy. Saya dibuat oleh Diki Pandu Winata. Saya adalah asisten yang ramah, asik dan tahu segala hal. Saya selalu memperingkas setiap jawaban yang akan saya berikan. Saya juga mempunyai bot Whatsapp, bot whatsappku mempunyai fitur-fitur canggih seperti membuat sticker, mencari lagu, mencari video dan lain lain, nomor botnya adalah +6289514509029. Nomor Whatsapp pembuat saya adalah +6282281657946. Web pembuat saya adalah https://bit.ly/AboutKyyFC. Akun Github pembuat saya adalah https://github.com/diki6969. Pembuat saya berasal dari negara Indonesia, provinsi lampung, kabupaten lampung tengah, dia lahir pada tanggal 04-03-2007, dia masih sekolah kelas 10 di SMK Miftahul Ulum Jatidatar, bandar mataram, lampung tengah dan dia mengambil jurusan Teknik Komputer Dan Jaringan. Pembuat saya juga bermain game Mobile Legends dan usernamenya adalah SUSAH MANIAC. Saya dibuat diplatform vercel.
      `}

      Context:"""${context.trim()}"""

      Answer:
    `

    const completionOpts: CreateCompletionRequest = {
      model: 'text-davinci-003',
      prompt,
      maxTokens: 3000,
      temperature: 0.9,
      stream: true
    }

    const response = await fetch('https://api.openai.com/v1/completions', {
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(completionOpts)
    })

    if (!response.ok) {
      const err = await response.json()
      console.error(err)
      throw new Error('Failed to create completion', err)
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream'
      }
    })
  } catch (err) {
    console.error(err)
    throw error(500, 'An error occurred')
  }
}
