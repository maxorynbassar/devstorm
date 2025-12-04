export enum TransactionType {
  PAYMENT = 'PAYMENT',
  TRANSFER = 'TRANSFER',
  CASH_OUT = 'CASH_OUT',
  DEBIT = 'DEBIT',
  CASH_IN = 'CASH_IN',
}

export interface TransactionData {
  step: number;
  type: TransactionType;
  amount: number;
  nameOrig: string;
  oldbalanceOrg: number;
  newbalanceOrig: number;
  nameDest: string;
  oldbalanceDest: number;
  newbalanceDest: number;
}

export interface RiskAnalysisResult {
  verdict: string;
  riskScore: number;
  riskLevel: 'НИЗКИЙ' | 'СРЕДНИЙ' | 'ВЫСОКИЙ';
  explanation: string[];
  recommendedAction: string;
  rawResponse: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
