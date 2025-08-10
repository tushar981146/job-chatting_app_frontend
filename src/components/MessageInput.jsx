import { useRef, useState } from 'react'
import { useChatStore } from '../store/useChatStore';
import { Image, Send, X } from 'lucide-react';

export default function MessageInput() {
  const [text, setText] = useState("");
  const [imagePreview, SetimagePreview] = useState(null);

  const { sendMessages } = useChatStore();



  const handlesendMessages = async (e) => {
    e.preventDefault();
    if(!text.trim()) return;

    try {
      await sendMessages({
        text: text.trim(),
      })

      //clear form

      setText("")


    } catch (error) {
      console.log('failed to send messages error', error);
    }
  }

  return (
    <div className="p-4 w-full">
       

      <form onSubmit={handlesendMessages} className='flex items-center gap-2'>
        <div className="flex-1 flex gap-2 ">
          
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim()}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  )
}
