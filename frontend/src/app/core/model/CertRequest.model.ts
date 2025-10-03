export interface CertRequest {
  commonName: string;
  organization: string;
  organizationalUnit: string;
  country: string;
  email: string;
  type: string;

  validityDays: number;
  keyUsages: string[];
  pathLength?: number;

  issuerId?: number;
}
