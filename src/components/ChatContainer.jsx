import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from '../components/skeleton/MessageSkeleton'
import {useAuthStore} from '../store/useAuthStore'
import { formatMessageTime } from '../libs/utils'
import { useRef } from 'react'

export default function ChatContainer() {
  const { messages, getMessages, isMessagesloading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
  const { authUser } = useAuthStore(); 
  const messageEnd = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id)
    subscribeToMessages()
    return () => unsubscribeFromMessages()
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages])

  useEffect(() => {
    if(messageEnd.current && messages) {
    messageEnd.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])


  if (isMessagesloading) {
    return (

      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    )
  }

  console.log('here is messages', messages);
  

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div 
          key={message._id}
          className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"} `}
          ref={messageEnd}
          >
           
            <div className="chat-header mb-1">
              <time className='text-xs  opacity-50 ml-1'>
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  )
}
