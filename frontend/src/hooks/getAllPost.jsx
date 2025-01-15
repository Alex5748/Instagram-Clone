import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPosts = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        // Making API call to fetch all posts
        const res = await axios.get("http://localhost:8000/api/v1/post/all", {
          withCredentials: true,
        });

        // Dispatching posts to Redux store if API call is successful
        if (res.data.success) {
          dispatch(setPosts(res.data.posts));
        }
      } catch (error) {
        console.error("Error fetching posts:", error.message);
      }
    };

    fetchAllPosts();
  }, []); // Include `dispatch` as a dependency
};

export default useGetAllPosts;
