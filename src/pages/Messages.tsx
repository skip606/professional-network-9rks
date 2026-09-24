import { useState, useEffect } from 'react'
import './Messages.css'

interface MessagesProps {
  user: any
}

interface Message {
  id: string
  from: string
  to: string
  content: string
  read: boolean
  createdAt: string
}

export default function Messages({ user }: MessagesProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [otherUser, setOtherUser] = useState('')
  const [messageContent, setMessageContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversations, setConversations] = useState<Set<string>>(new Set())

  const loadConversation = async (otherEmail: string) => {
    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`/.netlify/functions/messages/get?user=${otherEmail}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (res.ok) {
        setMessages(data.messages)
        setOtherUser(otherEmail)
      }
    } catch (err) {
      console.error('Failed to load conversation')
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageContent.trim() || !otherUser) return

    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/.netlify/functions/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          to: otherUser,
          content: messageContent
        })
      })

      if (res.ok) {
        setMessageContent('')
        await loadConversation(otherUser)
      }
    } catch (err) {
      console.error('Failed to send message')
    }
  }

  return (
    <div className="messages-container">
      <div className="container">
        <h1>Messages</h1>
        <div className="messages-wrapper">
          <div className="messages-main">
            {!otherUser ? (
              <div className="no-conversation">
                <p>Select a conversation or start a new one</p>
                <div className="start-conversation">
                  <input
                    type="email"
                    placeholder="Enter email to message..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                        loadConversation((e.target as HTMLInputElement).value)
                      }
                    }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="conversation-header">
                  <h2>{otherUser}</h2>
                  <button onClick={() => setOtherUser('')}>← Back</button>
                </div>
                <div className="messages-list">
                  {messages.length === 0 ? (
                    <div className="no-messages">No messages yet. Start the conversation!</div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className={`message ${msg.from === user.email ? 'sent' : 'received'}`}>
                        <div className="message-content">{msg.content}</div>
                        <div className="message-time">
                          {new Date(msg.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <form onSubmit={handleSendMessage} className="message-form">
                  <input
                    type="text"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <button type="submit" className="primary">
                    Send
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
