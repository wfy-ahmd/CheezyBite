import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { UserContext } from "../context/UserContext"; // Import UserContext
import { useRouter } from "next/navigation";
import AuthModal from "./AuthModal"; // Reuse AuthModal

const CartBottom = () => {
  const { setIsOpen, cart, cartTotal } = useContext(CartContext);
  const { user } = useContext(UserContext); // Get user
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const router = useRouter();

  const handleCheckout = () => {
    if (!user) {
      setAuthModalOpen(true);
    } else {
      setIsOpen(false);
      router.push('/checkout');
    }
  };

  return (
    <>
      {cart.length >= 1 ? (
        <div className="px-6 py-3 lg:py-6 mt-auto">
          <div className="flex items-center justify-between mb-6 text-lg font-bold font-robotoCondensed text-ashWhite">
            <div>Total:</div>
            <div>Rs. {parseFloat(cartTotal).toLocaleString()}</div>
          </div>
          <div className="flex flex-col gap-y-3">
            <button
              onClick={handleCheckout}
              className="btn btn-lg bg-gradient-to-r from-primary to-secondary w-full flex justify-center text-white shadow-lg hover:shadow-primary/20"
            >
              Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="absolute top-0 w-full h-full flex justify-center items-center -z-10">
          <div className="font-semibold text-ashWhite/60">Your cart is empty</div>
        </div>
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          // Optionally auto-redirect after login? User might want to verify cart first.
          // Keeping them in cart is safer UX.
        }}
      />
    </>
  );
};

export default CartBottom;