<script lang="ts">
	import type { ChatCompletionRequestMessageRoleEnum } from 'openai'
	export let type: ChatCompletionRequestMessageRoleEnum
	export let message: string
</script>

<div class="chat {type === 'user' ? 'chat-end' : 'chat-start'} justify-end">
	<div class="chat-image avatar">
		<div class="w-10 rounded-full">
			<img
				src="https://telegra.ph/file/{type === 'user' ? '6bffde36f1bbcf94f6b42.jpg' : 'ce72a789d7fee93959e58.jpg'}"
				alt="{type} avatar"
			/>
		</div>
	</div>
	<div class="chat-header">
		{type === 'user' ? 'Kamu' : 'Ikyy'}
	</div>
	<div class="chat-bubble {type === 'user' ? 'chat-bubble-primary' : 'chat-bubble-secondary'}">
		{message}
	</div>
</div>
