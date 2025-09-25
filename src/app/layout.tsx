"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../store";
import { Toaster } from "react-hot-toast"; // import Toaster
import "../styles/globals.scss";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          {children}
          {/* Global Toaster */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: {
                fontSize: "0.875rem",
                borderRadius: "0.5rem",
                padding: "0.75rem 1rem",
              },
            }}
          />
        </Provider>
      </body>
    </html>
  );
}
