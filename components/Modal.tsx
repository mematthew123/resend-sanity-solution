"use client";
import { useState, useEffect } from "react";
import { TConductorInstance } from "react-canvas-confetti/dist/types";
import Realistic from "react-canvas-confetti/dist/presets/realistic";

type ModalProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const Modal = ({ isOpen, setIsOpen }: ModalProps) => {
  const [conductor, setConductor] = useState<TConductorInstance>();

  const triggerConfetti = () => {
    conductor?.run({ speed: 0.3, duration: 3000 });
  };

  useEffect(() => {
    if (conductor) {
      triggerConfetti();
    }
  }, [conductor]);

  useEffect(() => {
    const handleEsc = (event: { keyCode: number }) => {
      if (event.keyCode === 27) setIsOpen(false);
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [setIsOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden max-w-md w-full">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 inline-flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="text-center p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Successfully Subscribed!
            </h1>
            <p className="text-md text-gray-700 dark:text-gray-300 mb-4">
              You have successfully subscribed to our newsletter.
              <br />
              Time to Party!
            </p>

            <button
              onClick={() => {
                triggerConfetti();
              }}
              className="inline-flex items-center bg-sky-800 justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
            >
              Celebrate!
            </button>
            <Realistic
              onInit={({ conductor }: { conductor: TConductorInstance }) =>
                setConductor(conductor)
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
