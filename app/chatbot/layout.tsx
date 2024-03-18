import { ReactNode } from 'react'

const ChatbotLayout = ({ children }: { children: ReactNode }) => {
	return <div className='h-full'>{children}</div>
}

export default ChatbotLayout
