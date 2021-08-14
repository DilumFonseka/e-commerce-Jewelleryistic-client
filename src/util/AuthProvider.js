import React, { useEffect, useReducer, useState } from "react";
import { app, db } from "./config";

import CartReducer from "../reducers/CartReducer";

import { CircularProgress } from "@material-ui/core";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, dispatch] = useReducer(
    CartReducer,
    {
      products: [],
      total: 0,
    },
    () => {
      const localData = localStorage.getItem("summergrace-cart");
      return localData
        ? JSON.parse(localData)
        : {
            products: [],
            total: 0,
          };
    }
  );
  const [pending, setPending] = useState(true);

  useEffect(() => {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        return db
          .collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            localStorage.setItem("summergrace-cart", JSON.stringify(cart));
            console.log(doc.data());
            setCurrentUser(doc.data());
            setPending(false);
          })
          .catch((err) => {
            console.log(err);
            setCurrentUser(null);
            setPending(false);
          });
      } else {
        console.log("no user");
        setCurrentUser(null);
        setPending(false);
      }
    });
  }, [cart]);

  if (pending) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="inherit"></CircularProgress>
      </div>
    );
  }

  console.log(currentUser);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        cart,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
