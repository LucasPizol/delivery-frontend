import { userService } from "@/services/user.service";
import { useFetch } from "./useFetch";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { createContext } from "react";
import { RegisterUserModel, UserModel } from "@/interfaces/User";

interface ContextProps {
  user: UserModel | null;
  loading: boolean;
  login: (usernameOrEmail: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterUserModel) => Promise<void>;
}

const AuthContext = createContext<ContextProps>(null as any);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, loading, refetch } = useFetch({
    queryKey: ["current_user"],
    queryFn: userService.getCurrentUser,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });

  const logout = async () => {
    userService.logout();
    queryClient.removeQueries({
      queryKey: ["current_user"],
    });
    refetch()
    router.push("/");
  };

  const login = async (usernameOrEmail: string, password: string) => {
    const { token, ...user } = await userService.loginUser(
      usernameOrEmail,
      password
    );
    localStorage.setItem("token", token);
    queryClient.setQueryData(["current_user"], user);
    refetch()
    router.push("/pedidos");

  };

  const register = async (data: RegisterUserModel) => {
    const { token, ...user } = await userService.registerUser({
      ...data,
      user: {
        ...data.user,
        phone: data.company.phone,
      },
    });

    localStorage.setItem("token", token);
    queryClient.setQueryData(["current_user"], user);
    refetch()
    router.push("/pedidos");
  };

  return (
    <AuthContext.Provider
      value={{
        user: data,
        loading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
