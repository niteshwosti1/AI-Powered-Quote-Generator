"use client";

import { useState } from "react";

export default function QuoteRequest() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error,setError] = useState("");

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {

        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        const formData = new FormData(e.currentTarget);

        const data ={
            customerName:formData.get("customerName"),
            customerEmail:formData.get("customerEmail"),
            companyName:formData.get("companyName"),
            serviceType:formData.get("serviceType"),
            projectDescription:formData.get("projectDescription"),
            budgetRange:formData.get("budgetRange"),
            timeline:formData.get("timeline"),
        };

        try{
            const response = await fetch("/api/generate-quote", {
                method: "POST",
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify(data),
            });
            if (!response.ok) throw new Error("Failed to generate quote");
            setIsSubmitted(true);
        } catch (error){
            setError(error instanceof Error ? error.message : "An unknown error occurred");
        }finally{
            setIsSubmitting(false);
        }
     }

     if (isSubmitted){
        return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
         <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Received!</h2>
          <p className="text-gray-500">
            Thank you! Your personalized quote is being prepared by our AI system.
            Check your email inbox in the next few minutes.
          </p>
        </div>
      </main>
        )
     }

     return (
        <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Get Your Free Quote
          </h1>
          <p className="text-gray-500 text-lg">
            Fill out the form below and receive a personalized quote in minutes.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="customerName"
                  required
                  placeholder="John Smith"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  required
                  placeholder="john@company.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                placeholder="Acme Inc. (optional)"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Service Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Type *
              </label>
              <select
                name="serviceType"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a service...</option>
                <option value="Web Design">Web Design</option>
                <option value="Web Development">Web Development</option>
                <option value="Mobile App">Mobile App</option>
                <option value="E-commerce">E-commerce</option>
                <option value="SEO & Marketing">SEO & Marketing</option>
                <option value="Branding">Branding</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                name="projectDescription"
                required
                rows={4}
                placeholder="Tell us about your project. What do you need? What problem are you solving?"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* Budget + Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Range
                </label>
                <select
                  name="budgetRange"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select budget...</option>
                  <option value="Under $1,000">Under $1,000</option>
                  <option value="$1,000 - $5,000">$1,000 - $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                  <option value="$25,000+">$25,000+</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeline
                </label>
                <select
                  name="timeline"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select timeline...</option>
                  <option value="ASAP">ASAP</option>
                  <option value="1 month">1 month</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 rounded-xl transition-colors duration-200"
            >
              {isSubmitting ? "Generating your quote..." : "Get My Free Quote →"}
            </button>

            <p className="text-center text-gray-400 text-sm">
              No spam. Your quote will arrive within minutes.
            </p>

          </form>
        </div>
      </div>
    </main>
 );
}

