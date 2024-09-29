import { userService } from "@/services/user.service";
import { useFetch } from "./useFetch";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { createContext, useEffect } from "react";
import { RegisterUserModel, UserModel } from "@/interfaces/User";
import { consumer } from "@/services/action_cable.service";
import { MotorCurierModel } from "@/interfaces/MotorCurier";

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

  useEffect(() => {
    if (data) {
      consumer.subscriptions.create(
        {
          channel: "MotorcurierPositionChannel",
          id: data.company_id,
        },
        {
          connected() {
            console.log("Connected to MotorcurierPositionChannel");
          },
          disconnected() {
            console.log("Disconnected from MotorcurierPositionChannel");
          },
          received(data: MotorCurierModel) {
            const getMotorCuriers = queryClient.getQueryData([
              "motor-curiers",
            ]) as MotorCurierModel[];

            if (getMotorCuriers) {
              queryClient.setQueryData(
                ["motor-curiers"],
                [
                  ...getMotorCuriers.filter(
                    (motorCurier) => motorCurier.id !== data.id
                  ),
                  data,
                ]
              );
            }
          },
        }
      );
    }
  }, [data]);

  const logout = async () => {
    userService.logout();
    queryClient.removeQueries({
      queryKey: ["current_user"],
    });
    refetch();
    router.push("/");
  };

  const login = async (usernameOrEmail: string, password: string) => {
    const { token, ...user } = await userService.loginUser(
      usernameOrEmail,
      password
    );
    localStorage.setItem("token", token);
    queryClient.setQueryData(["current_user"], user);
    refetch();
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
    refetch();
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
