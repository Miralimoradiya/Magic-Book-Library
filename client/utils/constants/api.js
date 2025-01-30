// utils/api.js
import axios from "axios";
import config from "../config/index";

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: `${config.API_URL}`,
});

let dialogShown = false;

// Function to refresh the JWT token
const refreshToken = async () => {
    const storedRefreshToken = localStorage.getItem("jwt_refreshToken");

    if (!storedRefreshToken) {
        throw new Error("No refresh token found in localStorage.");
    }

    try {
        const response = await axios.post(
            `${config.API_URL}/auth/refresh-token`,
            { refreshToken: storedRefreshToken }
        );

        const { accessToken, refreshToken } = response.data;
        localStorage.setItem("jwt_token", accessToken);
        localStorage.setItem("jwt_refreshToken", refreshToken);
        console.log("Tokens refreshed successfully.");
        return accessToken;

    } catch (err) {
        console.error("Error refreshing token:", err);
        return null;
    }
};

const showLogoutDialog = () => {
    if (dialogShown) return;
    dialogShown = true; 

    const dialog = document.createElement("div");

    dialog.innerHTML = `
   <div class="fixed inset-0 flex justify-center items-center ">
   <div class="absolute inset-0 bg-black opacity-50"></div>
    <div class="relative bg-white rounded-lg p-6 w-96">
      <div class="text-gray-700 text-center mb-6">oops! <br /> You've been logged out ,<br /> The account owner may have changed the password</div>
      <div class="text-center text-sm text-gray-500 mb-4" id="timer">LogOut in 5 seconds...</div>
      <div class="flex justify-center space-x-4">
        <button class="bg-[#142534] text-white py-2 px-10 rounded-xl" id="confirmLogoutBtn">Ok</button>
      </div>
    </div>
   </div>
  `;

    document.body.appendChild(dialog);

    let countdown = 5;
    const timerElement = document.getElementById("timer");
    const timerInterval = setInterval(() => {
        countdown--;
        timerElement.textContent = `LogOut in ${countdown} seconds...`;
        
        if (countdown <= 0) {
            clearInterval(timerInterval);
            window.location.href = "/";
        }
    }, 1000);

    document.getElementById("confirmLogoutBtn").addEventListener("click", () => {
        clearInterval(timerInterval); 
        localStorage.clear();
        window.location.href = "/";
    });
};


axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                const newAccessToken = await refreshToken();
                if (newAccessToken) {
                    error.config.headers["Authorization"] = `Bearer ${newAccessToken}`;
                    return axiosInstance(error.config); 
                }
            }

            if (error.response.status === 403) {
                showLogoutDialog(); 
            }
        }
        return Promise.reject(error);
    }
);

window.onload = () => {
    dialogShown = false; 
};

export { axiosInstance, refreshToken };


























