import React, { useState, useEffect } from "react";
import { Check, CircleDot, Bean, Leaf, Flame, Layers, Circle } from 'lucide-react';

const Topping = ({ topping, additionalTopping, setAdditionalTopping }) => {
  const [isChecked, setIsChecked] = useState(false);
  const handleCheckBox = () => {
    setIsChecked(!isChecked);
  }

  const handleTopping = () => {
    if (isChecked) {
      const newToppings = new Set([...additionalTopping, { ...topping }]);
      setAdditionalTopping(Array.from(newToppings));
    } else {
      const newToppings = additionalTopping.filter((toppingObj) => {
        return toppingObj.name !== topping.name;
      });
      setAdditionalTopping(newToppings);
    }
  };

  useEffect(() => {
    handleTopping();
  }, [isChecked]);

  const getIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('cherry')) return <CircleDot className="w-8 h-8 text-red-500" />;
    if (n.includes('corn')) return <CircleDot className="w-8 h-8 text-yellow-400" />; // Fallback if no Corn icon
    if (n.includes('fresh tomatoes')) return <Circle className="w-8 h-8 text-red-600" />;
    if (n.includes('jalapeno')) return <Flame className="w-8 h-8 text-green-600" />;
    if (n.includes('parmesan')) return <Layers className="w-8 h-8 text-yellow-200" />;
    return <Leaf className="w-8 h-8 text-green-400" />;
  };

  return (
    <div className={`${isChecked && 'border-orange'} w-full max-w-[110px] h-[140px] p-4 flex flex-col items-center justify-center border rounded-md bg-softBlack/40 relative cursor-pointer hover:bg-white/5 transition-colors`} onClick={handleCheckBox}>
      <div className="mb-2">
        {getIcon(topping.name)}
      </div>
      <div className="text-sm capitalize text-center font-medium text-ashWhite">{topping.name}</div>
      <input className="hidden" type='checkbox' checked={isChecked} readOnly />
      <div className={`${isChecked ? 'opacity-100 scale-100' : 'opacity-0 scale-0'} absolute top-2 right-2 transition-all duration-200`}>
        <Check className="text-xl text-orange" />
      </div>
    </div>
  )
};

export default Topping;
