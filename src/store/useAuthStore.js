import { create } from 'zustand'
import { axiosInstance } from '../libs/axois.js'
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL = import.meta.env.VITE_API_URL;


export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingUp: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket: null,

    ischeckingAuth: true,


    checkAuth: async () => {
        try {
            const res = await axiosInstance.get(`/auth/check`);
            set({ authUser: res.data });
            get().connectSocket();
        } catch (error) {
            set({ authUser: null })
            console.error("Error checking authentication:", error);
        } finally {
            set({ ischeckingAuth: false });
        }
    },

    login: async (data) => {
        set({isLoggingUp: true});

        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data});
            toast.success("login successfully");
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message || "Login failed");
        } finally {
            set({ isLoggingUp: false});
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            toast.success("Account created sucessfully");
            get().connectSocket();
            set({ authUser: res.data })
            console.log("res is null")
        } catch (error) {
            console.log('here is the error',error)
            toast.error(error.response?.data?.message)
        } finally {
            set({ isSigningUp: false})
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            console.log("working");
            
            set({authUser: null});
            get().disconnectSocket();
            toast.success("logout sucessfully");
        } catch (error) {
            toast.error(error?.response?.data?.message || "something wrong");
            console.log(error);
        }
    },

    

    connectSocket: async () => {
        const { authUser } = get();

        if (!authUser || get().socket?.connected) {
            console.log("already coneeected");
        }

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id

            }
        })

        socket.connect();


        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds})
        })

        console.log('socket value', get().socket)
    },

    disconnectSocket: () => {
        if(get().socket?.connected) get().socket.disconnect();
    }
}))