"use client";

import React, { useContext } from "react";
import { X } from "lucide-react";
import { CartContext } from "../context/CartContext";

const CartTop = () => {
  const { setIsOpen, cart } = useContext(CartContext);
  return (
    <div className="w-full h-16 border-b border-white/10 flex items-center justify-between px-6 bg-charcoalBlack/50 backdrop-blur-md rounded-t-[30px] lg:rounded-none">
      <div className="flex items-center gap-3">
        <h3 className="font-bold text-lg text-white">Your Order</h3>
        <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {cart.reduce((a, c) => a + c.amount, 0)} items
        </span>
      </div>
      <button
        onClick={() => setIsOpen(false)}
        className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
      >
        <X className="w-5 h-5 text-ashWhite" />
      </button>
    </div>
  )
};

export default CartTop;
