import { create } from 'zustand';

export type Transaction = {
  id: string;
  amount: number;
  merchant: string;
  note?: string;
  timestamp: string;
  paymentMethod: string;
  category?: string;
};

type Store = {
  transactions: Transaction[];

  monthlyBudget: number;

  addTransaction: (
    transaction: Transaction
  ) => void;

  assignCategory: (
    transactionId: string,
    category: string
  ) => void;

  setMonthlyBudget: (
    amount: number
  ) => void;
};

export const useStore =
  create<Store>((set) => ({
    transactions: [],

    monthlyBudget: 5000,

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
      transactionId,
      category
    ) =>
      set((state) => ({
        transactions:
          state.transactions.map(
            (t) =>
              t.id ===
              transactionId
                ? {
                    ...t,
                    category,
                  }
                : t
          ),
      })),

    setMonthlyBudget: (
      amount
    ) =>
      set({
        monthlyBudget: amount,
      }),
  }));