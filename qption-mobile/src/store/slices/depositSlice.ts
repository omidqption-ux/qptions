import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ImageSourcePropType } from "react-native";

// ─────────────────────────────
// Types
// ─────────────────────────────

export interface DepositMethod {
     title: string;
     minDeposit: number;
     logo: ImageSourcePropType | null;
     chain: string;
     code: string;
}

export interface PaymentInfo {
     pay_address: string;
     pay_amount: number;
     pay_currency: string;
     pay_network: string;
     deposit_amount: string;
}

export interface DepositState {
     method: DepositMethod;
     amount: number;
     paymentIOToken: string;
     paymentMethods: DepositMethod[];
     amountInPaymentMethod: number;
     paymentInfo: PaymentInfo;
     depositHistory: any[]; // change if you have a model
}

// ─────────────────────────────
// Initial State
// ─────────────────────────────

const initialState: DepositState = {
     method: {
          title: "",
          minDeposit: 0,
          logo: null,
          chain: "",
          code: "",
     },
     amount: 0,
     paymentIOToken: "",
     paymentMethods: [],
     amountInPaymentMethod: 0,
     paymentInfo: {
          pay_address: "",
          pay_amount: 0,
          pay_currency: "",
          pay_network: "",
          deposit_amount: "",
     },
     depositHistory: [],
};

// ─────────────────────────────
// Slice
// ─────────────────────────────

export const depositSlice = createSlice({
     name: "deposit",
     initialState,
     reducers: {
          setDepositMethod: (state, action: PayloadAction<DepositMethod>) => {
               state.method = action.payload;
          },

          setDepositAmount: (state, action: PayloadAction<number>) => {
               state.amount = action.payload;
          },

          resetDeposit: () => initialState,

          setPaymentIOToken: (state, action: PayloadAction<{ token: string }>) => {
               state.paymentIOToken = action.payload.token;
          },

          setPaymentMethods: (
               state,
               action: PayloadAction<{ paymentMethods: DepositMethod[] }>
          ) => {
               state.paymentMethods = action.payload.paymentMethods;
          },

          setAmountInPaymentMethod: (
               state,
               action: PayloadAction<{ amountInPaymentMethod: number }>
          ) => {
               state.amountInPaymentMethod = action.payload.amountInPaymentMethod;
          },

          setPaymentInfo: (
               state,
               action: PayloadAction<{ paymentInfo: PaymentInfo }>
          ) => {
               state.paymentInfo = action.payload.paymentInfo;
          },

          setDepositHistory: (
               state,
               action: PayloadAction<{ depositHistory: any[] }>
          ) => {
               state.depositHistory = action.payload.depositHistory;
          },
     },
});

// ─────────────────────────────
// Exports
// ─────────────────────────────

export const {
     setDepositMethod,
     setDepositAmount,
     resetDeposit,
     setPaymentIOToken,
     setPaymentMethods,
     setAmountInPaymentMethod,
     setPaymentInfo,
     setDepositHistory,
} = depositSlice.actions;

export default depositSlice.reducer;
