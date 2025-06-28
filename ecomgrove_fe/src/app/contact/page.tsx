"use client";
import SubHeader from "@/components/Header/SubHeader";
import React, { useEffect } from "react";
import { useWindowEvents } from "../hooks/useWindowsEvent";
import TopHeader from "@/components/about/TopHeader";
import Footer from "@/components/Footer/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { formFields, FormValues, SocialItem } from "../constants/ContactData";
import GoogleMap from "@/components/GoogleMap";
import { useAuthStore } from "../store/auth/useAuthStore";

export default function Contact() {
  const { isScrolledY } = useWindowEvents();
  const checkAuth = useAuthStore((state) => state.checkAuth);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    mode: "onBlur",
  });

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Form submitted:", data);

      reset();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="selection:bg-mid-night selection:text-white">
      <TopHeader />
      <div
        className={`sticky top-0 w-full z-20 bg-white transition-all duration-300 ease-in-out ${
          isScrolledY ? "shadow-md opacity-100" : "shadow-sm opacity-95"
        }`}
      >
        <SubHeader />
      </div>

      {/* Main content */}
      <div className="container relative flex flex-col items-center justify-center min-h-screen px-4 py-8 mx-auto sm:py-12">
        <div className="relative z-10 mb-6 text-center sm:mb-8">
          <h3 className="mb-1 text-3xl font-semibold text-gray-900 sm:text-4xl">
            Keep In Touch with Us
          </h3>
          <div className="flex items-center justify-center gap-2 text-sm text-soft-gray">
            <span className="relative after:content-['•'] after:mx-2 after:text-soft-gray">
              Home
            </span>
            <span>Contact</span>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-7xl px-6 py-8 overflow-hidden bg-white shadow-lg rounded-lg">
          <div className="grid grid-cols-1 lg:grid-cols-3 p-5">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              <h1 className="text-2xl text-mid-night">Send A Message</h1>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {formFields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    {field.type === "textarea" ? (
                      <Textarea
                        id={field.name}
                        label={field.label}
                        className={`min-h-[120px] ${
                          errors[field.name]
                            ? "border-red-400 ring-red-200"
                            : ""
                        }`}
                        {...register(field.name, field.validation)}
                      />
                    ) : (
                      <Input
                        id={field.name}
                        label={field.label}
                        type={field.type}
                        className={`w-full ${
                          errors[field.name]
                            ? "border-red-400 ring-red-200"
                            : ""
                        }`}
                        {...register(field.name, field.validation)}
                      />
                    )}
                    {errors[field.name] && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors[field.name]?.message}
                      </p>
                    )}
                  </div>
                ))}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="blue"
                  className="p-7 mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            {/* Contact Information Section */}
            <div className="lg:col-span-1 lg:pl-8 mt-8 lg:mt-0">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-mid-night"></h2>
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex flex-col items-center gap-y-5">
                    <div className="flex flex-col items-start">
                      <img src="/contact-icon-1.png" alt="contact-image" />
                      <p className="text-dark-gray text-lg hover:text-electric-blue hover:cursor-pointer transition-all duration-300">
                        contact@ecomgrove.store
                      </p>
                      <span className="text-mid-night font-bold text-md hover:text-electric-blue hover:cursor-pointer transition-all duration-300">
                        <a href="tel:+670 413 90 762">+670 413 90 762</a>
                      </span>
                    </div>

                    <div className="flex flex-col items-start">
                      <img src="/contact-icon-2.png" alt="contact-image" />
                      <div className="text-mid-night text-lg hover:text-electric-blue hover:cursor-pointer transition-all duration-300">
                        <p>84 sleepy hollow st.</p>
                        <span>jamaica, New York 1432</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-y-5">
                      <img src="/contact-icon-3.png" alt="contact-image" />
                      <div className="text-mid-night text-lg ">
                        <p>Find on social media</p>
                        <div className="flex gap-3 mt-2">
                          {SocialItem.map((si) => (
                            <div key={si.id} className="group">
                              <div className="p-2 border group-hover:bg-electric-blue cursor-pointer transition-all duration-300">
                                {si.icon}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <GoogleMap />
      </div>
      <Footer />
    </div>
  );
}
