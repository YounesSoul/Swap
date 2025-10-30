"use client";

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { toast } from "sonner";
import { GlowCard } from "@/components/ui/enhanced-components";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Clock, Calendar, X, ChevronDown } from "lucide-react";
import { useSwap } from "@/lib/store";
import { API_BASE } from "@/lib/api";

type DayOfWeek = "MONDAY" | "TUESDAY" | "WEDNESDAY" | "THURSDAY" | "FRIDAY" | "SATURDAY" | "SUNDAY";

interface TimeSlot {
  id: string;
  type: "course" | "skill";
  courseCode?: string;
  skillName?: string;
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
  isActive: boolean;
  _count?: { sessions: number };
}

const DAYS: DayOfWeek[] = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: "Mon",
  TUESDAY: "Tue", 
  WEDNESDAY: "Wed",
  THURSDAY: "Thu",
  FRIDAY: "Fri",
  SATURDAY: "Sat",
  SUNDAY: "Sun"
};

// Generate time slots from 08:00 to 20:00
const generateTimeOptions = () => {
  const times: string[] = [];
  for (let hour = 8; hour <= 20; hour++) {
    times.push(`${hour.toString().padStart(2, '0')}:00`);
    if (hour < 20) times.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return times;
};

const TIME_OPTIONS = generateTimeOptions();

export default function AvailabilityManager() {
  const { me, myCourses, mySkills } = useSwap();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Form state
  const [formType, setFormType] = useState<"course" | "skill">("course");
  const [selectedCourseOrSkill, setSelectedCourseOrSkill] = useState("");
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("MONDAY");
  const [startTime, setStartTime] = useState("09:00");
  
  // Auto-calculate end time (1 hour later)
  const endTime = React.useMemo(() => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHour = (hours + 1) % 24;
    return `${endHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }, [startTime]);

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/timeslots/my-slots`, {
        headers: { "x-user-email": me?.email || "" },
      });
      const data = await response.json();
      setSlots(data);
    } catch (error) {
      console.error("Failed to fetch time slots:", error);
      toast.error("Failed to load availability");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSlot = async () => {
    if (!selectedCourseOrSkill) {
      toast.error("Please select a course or skill");
      return;
    }

    const payload = {
      type: formType,
      courseCode: formType === "course" ? selectedCourseOrSkill : null,
      skillName: formType === "skill" ? selectedCourseOrSkill : null,
      dayOfWeek: selectedDay,
      startTime,
      endTime,
    };

    console.log("Creating time slot with payload:", payload);

    try {
      const response = await fetch(`${API_BASE}/timeslots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-email": me?.email || "",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      toast.success("Time slot created successfully!");
      setShowDialog(false);
      fetchSlots();
      
      // Reset form
      setSelectedCourseOrSkill("");
      setStartTime("09:00");
    } catch (error: any) {
      toast.error(error.message || "Failed to create time slot");
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    try {
      const response = await fetch(`${API_BASE}/timeslots/${slotId}`, {
        method: "DELETE",
        headers: { "x-user-email": me?.email || "" },
      });

      if (response.ok) {
        toast.success("Time slot deleted");
        fetchSlots();
        setShowDeleteConfirm(false);
        setSlotToDelete(null);
      } else {
        toast.error("Failed to delete time slot");
      }
    } catch (error) {
      toast.error("Failed to delete time slot");
    }
  };

  const confirmDelete = (slotId: string) => {
    setSlotToDelete(slotId);
    setShowDeleteConfirm(true);
  };

  const groupedSlots = slots.reduce((acc, slot) => {
    const day = slot.dayOfWeek;
    if (!acc[day]) acc[day] = [];
    acc[day].push(slot);
    return acc;
  }, {} as Record<DayOfWeek, TimeSlot[]>);

  // Delete confirmation modal
  const deleteConfirmModal = showDeleteConfirm ? ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Time Slot?</h3>
        <p className="text-gray-600 mb-6">
          This will permanently remove this time slot from your availability. Any existing bookings will not be affected.
        </p>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setShowDeleteConfirm(false);
              setSlotToDelete(null);
            }}
            className="border-gray-300 text-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={() => slotToDelete && handleDeleteSlot(slotToDelete)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  // Modal component that renders in a portal
  const modal = showDialog ? ReactDOM.createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-8 relative z-[10000]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Add Availability</h2>
          <button
            onClick={() => setShowDialog(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teaching Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setFormType("course");
                  setSelectedCourseOrSkill("");
                }}
                className={`py-3 px-4 rounded-lg font-medium transition-all border ${
                  formType === "course"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                Course
              </button>
              <button
                onClick={() => {
                  setFormType("skill");
                  setSelectedCourseOrSkill("");
                }}
                className={`py-3 px-4 rounded-lg font-medium transition-all border ${
                  formType === "skill"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                Skill
              </button>
            </div>
          </div>

          {/* Course/Skill Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {formType === "course" ? "Select Course" : "Select Skill"}
            </label>
            <select
              value={selectedCourseOrSkill}
              onChange={(e) => setSelectedCourseOrSkill(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            >
              <option value="">Choose...</option>
              {formType === "course"
                ? myCourses.map((course) => (
                    <option key={course.courseCode} value={course.courseCode}>
                      {course.courseCode} (Grade: {course.grade})
                    </option>
                  ))
                : mySkills.map((skill, i) => (
                    <option key={i} value={skill}>
                      {skill}
                    </option>
                  ))}
            </select>
          </div>

          {/* Day Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
            <div className="grid grid-cols-7 gap-2">
              {DAYS.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                    selectedDay === day
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {DAY_LABELS[day]}
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <div className="relative">
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none cursor-pointer"
                >
                  <option value="">Select</option>
                  {TIME_OPTIONS.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <div className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-500 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{endTime || "--:--"}</span>
                <span className="text-xs ml-auto">(1h session)</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setShowDialog(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateSlot}
              disabled={loading}
              className="bg-gray-900 hover:bg-gray-800 text-white"
            >
              {loading ? "Creating..." : "Create Slot"}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <GlowCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Teaching Availability</h2>
          <p className="text-sm text-gray-600 mt-1">
            Set your weekly schedule for students to book sessions
          </p>
        </div>
        <Button
          onClick={() => setShowDialog(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Time Slot</span>
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : slots.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-700 font-medium">No availability set</p>
          <p className="text-sm text-gray-500 mt-1">
            Click "Add Time Slot" to let students book sessions
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {DAYS.map((day) => {
            const daySlots = groupedSlots[day] || [];
            if (daySlots.length === 0) return null;

            return (
              <div key={day} className="bg-white border border-gray-200 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 bg-gray-900 rounded-full"></div>
                  <h3 className="font-semibold text-gray-900">{day}</h3>
                  <span className="text-xs text-gray-500 ml-auto">{daySlots.length} slot{daySlots.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="space-y-2">
                  {daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {slot.startTime} - {slot.endTime}
                        </span>
                        <span className="px-2.5 py-0.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium rounded">
                          {slot.type === "course" ? slot.courseCode : slot.skillName}
                        </span>
                        {slot._count && slot._count.sessions > 0 && (
                          <span className="text-xs text-gray-500">
                            · {slot._count.sessions} booked
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => confirmDelete(slot.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {modal}
      {deleteConfirmModal}
    </GlowCard>
  );
}
