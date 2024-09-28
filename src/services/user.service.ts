import {
  AddUserModel,
  RegisterUserModel,
  UserModel,
  UserResponse,
} from "@/interfaces/User";
import { ApiService } from "./api.service";

class UserService {
  async getCurrentUser() {
    const token = localStorage.getItem("token");

    if (!token) return null;

    return await ApiService.get<UserModel>("/me");
  }

  async registerUser(user: RegisterUserModel) {
    return await ApiService.post<UserResponse>("/register/user", {
      ...user,
      address: {
        address: user.address.address,
        lat: user.address.coordinates.lat,
        lng: user.address.coordinates.lng,
      }
    });
  }

  async loginUser(email: string, password: string) {
    return await ApiService.post<UserResponse>("/login", {
      email,
      password,
      type: "user",
    });
  }

  logout() {
    localStorage.removeItem("token");
  }
}

export const userService = new UserService();
