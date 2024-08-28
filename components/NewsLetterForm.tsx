"use client";
import { useState } from "react";
import Modal from "./Modal";

type Form = {
  heading: string;
  subHeading: string;
};

export default function NewsLetter() {
  const [emailAddress, setemailAddress] = useState("");
  const [form, setForm] = useState<Form | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailAddress }),
      });

      if (response.ok) {
        setIsOpen(true);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("An unexpected error happened:", error);
    }
  };
  return (
    <div className="bg-gray-900 py-16 w-full sm:py-24 lg:py-32">
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:col-span-7">
          <h2 className="inline sm:block lg:inline xl:block">
            Want easily send newsletters?
          </h2>{" "}
          <p className="inline sm:block lg:inline xl:block">
            Sign up to learn more.
          </p>
        </div>
        <form className="w-full max-w-md lg:col-span-5 lg:pt-2">
          <div className="flex gap-x-4">
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6"
              placeholder="Enter your email"
              value={emailAddress}
              onChange={(e) => setemailAddress(e.target.value)}
            />
            <button
              type="submit"
              className="flex-none rounded-md bg-sky-400 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
              onClick={handleSubmit}
            >
              Subscribe
            </button>
          </div>
          <p className="mt-4 text-sm leading-6 text-gray-300">
            We deeply care about your data. Checkout our{" "}
            <a
              href="https://youtu.be/N9wsjroVlu8?feature=shared&t=6"
              className="font-semibold text-white"
            >
              privacy&nbsp;policy
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
}
