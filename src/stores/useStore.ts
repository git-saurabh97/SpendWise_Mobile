import { create } from 'zustand';

export interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  category?: string;
  note?: string;
  timestamp: string;
  paymentMethod: string;
}

interface AppState {
  transactions: Transaction[];

  addTransaction: (
    transaction: Transaction
  ) => void;

  assignCategory: (
    id: string,
    category: string
  ) => void;
}

export const useStore = create<AppState>(
  (set) => ({
    transactions: [],

    addTransaction: (
      transaction
    ) =>
      set((state) => ({
        transactions: [
          transaction,
          ...state.transactions,
        ],
      })),

    assignCategory: (
      id,
      category
    ) =>
      set((state) => ({
        transactions:
          state.transactions.map((t) =>
            t.id === id
              ? {
                  ...t,
                  category,
                }
              : t
          ),
      })),
  })
);