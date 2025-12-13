"use client";

import React, { useContext, useEffect, useState } from 'react';
import Modal from 'react-modal';
import { X } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import PizzaDetails from './PizzaDetails';
import { getPizzas } from '../utils/pizzaStore';

const modalStyles = {
    overlay: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 50,
    }
};

const GlobalEditModal = () => {
    const { editingItem, setEditingItem } = useContext(CartContext);
    const [fullPizza, setFullPizza] = useState(null);

    useEffect(() => {
        if (editingItem) {
            // Find full pizza details to pass to PizzaDetails (which needs toppings list, prices etc.)
            const allPizzas = getPizzas();
            const pizza = allPizzas.find(p => p.id === editingItem.id);
            setFullPizza(pizza);
        } else {
            setFullPizza(null);
        }
    }, [editingItem]);

    const closeModal = () => {
        setEditingItem(null);
    };

    if (!editingItem || !fullPizza) return null;

    return (
        <Modal
            isOpen={!!editingItem}
            style={modalStyles}
            onRequestClose={closeModal}
            contentLabel="Edit Item Modal"
            className="bg-softBlack w-full h-full lg:max-w-[1000px] lg:max-h-[85vh] lg:rounded-[30px] lg:fixed lg:top-[50%] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%] outline-none shadow-2xl overflow-hidden border border-cardBorder animate-in fade-in zoom-in-95 duration-200"
            ariaHideApp={false} // Avoid warning if not set to root
        >
            <div
                onClick={closeModal}
                className="absolute z-50 right-4 top-4 hover:scale-110 duration-200 cursor-pointer bg-black/50 backdrop-blur-md rounded-full p-2 text-white hover:bg-primary transition-colors shadow-lg border border-white/10"
            >
                <X className="w-6 h-6" />
            </div>

            {/* Pass editingItem to PizzaDetails to enable Edit Mode */}
            <PizzaDetails
                pizza={fullPizza}
                setModal={closeModal}
                cartItem={editingItem}
            />
        </Modal>
    );
};

export default GlobalEditModal;
