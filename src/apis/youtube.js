import axios from "axios";

const KEY = "AIzaSyCA_cUpewS7JCk5FvRR6bRcRev_B5nLS5c";

export default axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: {
    part: "snippet",
    type: "video",
    maxResults: 5,
    key: KEY,
  },
});
