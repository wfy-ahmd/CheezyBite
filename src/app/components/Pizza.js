'use client';

import React, { useState, useContext } from "react";
import Image from "next/image";
import Modal from "react-modal";
import PizzaDetails from "./PizzaDetails";
import { CartContext } from "../context/CartContext";
import { X, Star, Plus, Minus } from 'lucide-react';

Modal.setAppElement('body');

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 50,
  }
}

const Pizza = ({ pizza }) => {
  const [modal, setModal] = useState(false);
  const { addToCart, cart, increaseAmount, decreaseAmount, removeItem } = useContext(CartContext);

  // Check if item is in cart (checking ID only for simple grid logic, ideally check distinct configs, but for Uber-style grid, we often sum up or show "Add" if customized)
  // For simplicity: We track the "default" configuration in grid or just total count of this Pizza ID.
  // Uber Eats style: If multiple configs exist, it might show "2" or "Add". 
  // Let's implement: "Find item with default config" for the counter, or just generic counter for this ID.
  // User Rule: "First click -> adds to cart... then shows + 1 -". 
  // We'll track *total quantity* of this pizza ID for simple display, OR precise default match.
  // To avoid confusion, let's track the SPECIFIC default item (Small, Traditional) for the inline controls.

  const defaultSize = 'small';
  const defaultCrust = 'traditional';

  const cartItem = cart.find(item =>
    item.id === pizza.id &&
    item.size === defaultSize &&
    item.crust === defaultCrust &&
    item.additionalTopping.length === 0
  );

  const quantity = cartItem ? cartItem.amount : 0;

  const openModal = () => {
    setModal(true);
  }

  const closeModal = () => {
    setModal(false);
  }

  const handleAdd = (e) => {
    e.stopPropagation();
    // Default: Small, Traditional, No Toppings
    addToCart(pizza.id, pizza.image, pizza.name, pizza.priceSm, [], defaultSize, defaultCrust, 1);
  };

  const handleIncrease = (e) => {
    e.stopPropagation();
    increaseAmount(pizza.id, pizza.priceSm);
  };

  const handleDecrease = (e) => {
    e.stopPropagation();
    decreaseAmount(pizza.id, pizza.priceSm);
    // If qty becomes 0, removeItem is likely handled in context or by this logic being 0
    if (quantity === 1) {
      removeItem(pizza.id, pizza.priceSm, defaultCrust);
    }
  };

  return (
    <div className="group flex flex-col h-full bg-softBlack rounded-xl overflow-hidden border border-cardBorder shadow-sm hover:shadow-lg transition-all duration-300">

      {/* Image Container - Click to Open details */}
      <div onClick={openModal} className="relative w-full aspect-[4/3] bg-charcoalBlack overflow-hidden cursor-pointer">
        <Image
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          src={pizza.image}
          alt={pizza.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        {/* Rating Badge */}
        <div className="absolute bottom-2 left-2 bg-white/10 backdrop-blur-md border border-white/20 px-2 py-1 rounded-lg flex items-center gap-1">
          <Star className="w-3 h-3 text-secondary fill-secondary" />
          <span className="text-xs font-bold text-white">{pizza.rating}</span>
          <span className="text-[10px] text-white/70">({pizza.ratingCount})</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 onClick={openModal} className="text-lg font-bold text-ashWhite leading-tight cursor-pointer hover:text-primary transition-colors">
            {pizza.name}
          </h3>
          <div className="flex flex-col items-end">
            <span className="text-sm text-ashWhite/60 line-through text-[10px]">Rs. {pizza.priceSm + 200}</span>
            <span className="text-md font-bold text-ashWhite">Rs. {pizza.priceSm}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-2">
          {pizza.tags?.map((tag, i) => (
            <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-ashWhite/60 border border-white/10">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-sm text-ashWhite/60 line-clamp-2 mb-4 leading-relaxed">
          {pizza.description}
        </p>

        {/* Action Area */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-cardBorder/50">
          <span className="text-xs text-ashWhite/40 font-medium">Customize &gt;</span>

          {/* Add / Counter Logic */}
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="btn bg-white text-black hover:bg-ashWhite px-6 py-2 rounded-full text-sm font-bold shadow-md active:scale-95 transition-all flex items-center gap-2"
            >
              Add <Plus className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center bg-black/40 rounded-full border border-cardBorder p-1">
              <button onClick={handleDecrease} className="w-8 h-8 flex items-center justify-center rounded-full bg-softBlack text-white hover:bg-white/20 transition-colors">
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-bold text-white text-sm">{quantity}</span>
              <button onClick={handleIncrease} className="w-8 h-8 flex items-center justify-center rounded-full bg-primary text-white hover:bg-primaryHover transition-colors shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal - Kept for deep customization */}
      {modal &&
        <Modal
          isOpen={modal}
          style={modalStyles}
          onRequestClose={(e) => {
            e.stopPropagation();
            closeModal();
          }}
          contentLabel="Pizza Modal"
          className="bg-softBlack w-full h-full lg:max-w-[1000px] lg:max-h-[85vh] lg:rounded-[30px] lg:fixed lg:top-[50%] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%] outline-none shadow-2xl overflow-hidden border border-cardBorder animate-in fade-in zoom-in-95 duration-200"
        >
          <div onClick={(e) => {
            e.stopPropagation();
            closeModal();
          }} className="absolute z-50 right-4 top-4 hover:scale-110 duration-200 cursor-pointer bg-black/50 backdrop-blur-md rounded-full p-2 text-white hover:bg-primary transition-colors shadow-lg border border-white/10">
            <X className="w-6 h-6" />
          </div>
          <PizzaDetails pizza={pizza} modal={modal} setModal={setModal} />
        </Modal>}
    </div>
  );
};

export default Pizza;