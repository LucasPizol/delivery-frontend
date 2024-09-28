export interface CompanyModel {
  id: string;
  name: string;
  document: string;
  phone: string;
}

export type AddCompanyModel = Omit<CompanyModel, "id">;
