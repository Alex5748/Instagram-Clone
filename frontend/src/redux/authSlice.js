import SuggestedUsers from "@/components/SuggestedUser";
import { createSlice } from "@reduxjs/toolkit";



const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        suggestedUsers: [],
        userProfile: null,
        selectedUser: null,
    },
    reducers: {
        //action
        setAuthUser: (state,action)=> {
            state.user = action.payload;
        },
        setSuggestedUsers: (state, action) => {
            state.suggestedUsers = action.payload;
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload;
        }
    }
})


export const { setAuthUser, setSuggestedUsers, setUserProfile, setSelectedUser } = authSlice.actions;
export default authSlice.reducer;