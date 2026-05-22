import { create } from 'zustand';

import {
  persist,
  createJSONStorage,
} from 'zustand/middleware';

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Transaction {
  id: string;
  amount: number;
  merchant: string;
  note?: string;
  timestamp: string;
  paymentMethod: string;
  category?: string;
}

interface StoreState {
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
    budget: number
  ) => void;

  loadData: () => Promise<void>;
}

export const useStore =
  create<StoreState>()(
    persist(
      (set) => ({
        transactions: [],

        monthlyBudget: 0,

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
          budget
        ) =>
          set({
            monthlyBudget: budget,
          }),

        loadData: async () => {
          return;
        },
      }),

      {
        name: 'spendwise-storage',

        storage: createJSONStorage(
          () => AsyncStorage
        ),
      }
    )
  );