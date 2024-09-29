export interface MotorCurierModel {
  id: string;
  name: string;
  code: string;
  lat: string;
  lng: string;
}

export type AddMotorCurierModel = Pick<MotorCurierModel, "name">;