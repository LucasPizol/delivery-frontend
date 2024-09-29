import { AddOrderModel, OrderModel } from "@/interfaces/Order";
import { ApiService } from "./api.service";
import { AddMotorCurierModel, MotorCurierModel } from "@/interfaces/MotorCurier";

export class MotorCurierService {
  async createMotorCurier(data: AddMotorCurierModel) {
    return await ApiService.post<MotorCurierModel>("/motor_curiers", data);
  }

  async getMotorCuriers() {
    return await ApiService.get<MotorCurierModel[]>("/motor_curiers");
  }
}

export const motorCurierService = new MotorCurierService();
