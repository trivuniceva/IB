export interface Certificate {
  id: number;
  commonName: string;
  organization: string;
  organizationalUnit: string;
  country: string;
  email: string;
  type: string;
  startDate: string;
  endDate: string;
  revoked: boolean;
}
