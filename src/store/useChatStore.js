import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../libs/axois";
import { useAuthStore } from "./useAuthStore";





export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesloading: false,

    getUsers: async () => {
        set({ isUserLoading: true});
        try {
            const res = await axiosInstance.get(`/messages/users`);
            set({users: res.data});

        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isUserLoading: false});
        }
    },

    getMessages: async (userId) => {
        set({isMessagesloading: true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data});
            
        } catch (error) {
            toast.error(error?.response?.data?.message);
        } finally {
            set({isMessagesloading: false});
        }
    },

    sendMessages: async (msgData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, msgData);
            set ({ messages: [...messages, res.data]})
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {

            if(newMessage.senderId !== selectedUser._id && newMessage.receiverId !== selectedUser._id) {
                return; // Ignore messages not related to the selected user
            }
            set({ 
                messages: [...get().messages, newMessage]
             })
        })

    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    // todo: opetimise later 
    setSelected: async (selectedUser) => set({ selectedUser })

}))