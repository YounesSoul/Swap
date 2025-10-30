"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { gsap } from "gsap";
import { toast } from "sonner";
import { 
  Calendar, 
  Clock, 
  X, 
  Check,
  User,
  BookOpen,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (sessionId: string, dateTime: string) => void;
  session: {
    id: string;
    courseCode: string;
    minutes: number;
    teacher?: {
      name?: string;
      email: string;
    };
    learner?: {
      name?: string;
      email: string;
    };
  };
  isLearner: boolean;
  loading?: boolean;
}

export const SchedulingModal: React.FC<SchedulingModalProps> = ({
  isOpen,
  onClose,
  onSchedule,
  session,
  isLearner,
  loading = false,
}) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [error, setError] = useState("");
  
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];
  
  // Get time slots (9 AM to 9 PM, 30-minute intervals)
  const timeSlots = React.useMemo(() => {
    const slots = [];
    for (let hour = 9; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  }, []);

  useEffect(() => {
    if (isOpen && modalRef.current && overlayRef.current && contentRef.current) {
      // Reset form
      setSelectedDate("");
      setSelectedTime("");
      setError("");
      
      // Animate in
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      );
      
      gsap.fromTo(
        contentRef.current,
        { scale: 0.9, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  const handleClose = () => {
    if (modalRef.current && overlayRef.current && contentRef.current) {
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 });
      gsap.to(contentRef.current, { 
        scale: 0.9, 
        opacity: 0, 
        y: 50, 
        duration: 0.3,
        onComplete: onClose 
      });
    } else {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedDate || !selectedTime) {
      setError("Please select both date and time");
      return;
    }

    // Check if selected date/time is in the future
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const now = new Date();
    
    if (selectedDateTime <= now) {
      setError("Please select a future date and time");
      return;
    }

    // Format for backend (ISO string)
    const isoDateTime = selectedDateTime.toISOString();
    onSchedule(session.id, isoDateTime);
  };

  const otherUser = isLearner ? session.teacher : session.learner;

  if (!isOpen) return null;

  const modalContent = (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    >
      {/* Overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal Content */}
      <div 
        ref={contentRef}
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-blue-600" />
              <span>Schedule Session</span>
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Session Info */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-900">{session.courseCode}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">{session.minutes} minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-500" />
              <span className="text-gray-600">
                {isLearner ? "Teacher" : "Student"}: {otherUser?.name || otherUser?.email}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Date Selection */}
          <div>
            <label htmlFor="date" className="text-sm font-medium text-gray-700 mb-2 block">
              Select Date
            </label>
            <Input
              id="date"
              type="date"
              min={today}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full"
              required
            />
          </div>

          {/* Time Selection */}
          <div>
            <label htmlFor="time" className="text-sm font-medium text-gray-700 mb-2 block">
              Select Time
            </label>
            <select
              id="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Choose a time</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {new Date(`2000-01-01T${time}`).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </option>
              ))}
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          )}

          {/* Preview */}
          {selectedDate && selectedTime && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Session Preview</h4>
              <div className="text-sm text-blue-800">
                <div>Date: {new Date(selectedDate).toLocaleDateString()}</div>
                <div>Time: {new Date(`${selectedDate}T${selectedTime}`).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}</div>
                <div>Duration: {session.minutes} minutes</div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={loading || !selectedDate || !selectedTime}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Scheduling...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4" />
                  <span>Schedule Session</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default SchedulingModal;