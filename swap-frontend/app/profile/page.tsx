"use client";

import React, { useEffect, useState } from "react";
import { useSwap } from "@/lib/store";
import { SimpleProfileStats } from "@/components/profile/SimpleProfileStats";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SkillsManager, CoursesManager } from "@/components/profile/SkillsCoursesManager";
import { toast } from "sonner";
import TranscriptUploader from "./TranscriptUploader";
import PasswordCard from "./PasswordCard";
import AvailabilityManager from "@/components/profile/AvailabilityManager";

export default function ProfilePage() {
  const me = useSwap((s) => s.me);
  const seed = useSwap((s) => s.seed);

  const mySkills = useSwap((s) => s.mySkills);
  const myCourses = useSwap((s) => s.myCourses);

  const addSkill = useSwap((s) => s.addSkill);
  const removeSkill = useSwap((s) => s.removeSkill);
  const addCourse = useSwap((s) => s.addCourse);
  const removeCourse = useSwap((s) => s.removeCourse);

  // Profile state
  const [profileData, setProfileData] = useState({
    name: me?.name || "",
    university: me?.university || "AUI",
    timezone: me?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  useEffect(() => {
    if (me?.email) seed(me.email);
  }, [me?.email, seed]);

  // Calculate profile stats
  const stats = React.useMemo(() => {
    const profileCompletion = Math.min(100, 
      (me?.name ? 25 : 0) + 
      (mySkills.length > 0 ? 25 : 0) + 
      (myCourses.length > 0 ? 25 : 0) + 
      (me?.university ? 25 : 0)
    );

    return {
      totalSkills: mySkills.length,
      totalCourses: myCourses.length,
      completionRate: 95, // This could be calculated from actual session data
      teachingHours: Math.floor(Math.random() * 50) + 20, // Mock data
      profileCompletion,
      activeRequests: Math.floor(Math.random() * 5) + 1, // Mock data
    };
  }, [mySkills.length, myCourses.length, me]);

  // Handle profile update
  const handleUpdateProfile = async (updates: Partial<typeof profileData>) => {
    // This would call your API to update the profile
    setProfileData(prev => ({ ...prev, ...updates }));
    toast.success("Profile updated successfully!");
    // In a real app, you'd call: await updateProfile(updates);
  };

  // Handle skill management
  const handleAddSkill = async (name: string, level: string) => {
    await addSkill(name, level as any);
    toast.success("Skill added");
  };

  const handleRemoveSkill = async (skill: string) => {
    await removeSkill(skill);
    toast.success(`Removed ${skill}`);
  };

  // Handle course management
  const handleAddCourse = async (code: string, grade: string) => {
    await addCourse(code.toUpperCase(), grade);
    toast.success("Course added");
  };

  const handleRemoveCourse = async (course: string) => {
    await removeCourse(course);
    toast.success(`Removed ${course}`);
  };

  if (!me) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Please sign in</h2>
          <p className="text-gray-500">You need to be signed in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="container mx-auto px-6 py-8 max-w-7xl space-y-6">
        {/* Profile Header */}
        <ProfileHeader 
          user={{
            name: profileData.name,
            email: me.email,
            university: profileData.university,
            timezone: profileData.timezone,
          }}
          onUpdateProfile={handleUpdateProfile}
        />

        {/* Stats Overview */}
        <SimpleProfileStats stats={stats} />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column */}
          <div className="space-y-6 flex flex-col">
            {/* Skills Manager */}
            <SkillsManager
              skills={mySkills}
              onAddSkill={handleAddSkill}
              onRemoveSkill={handleRemoveSkill}
            />

            {/* Courses Manager */}
            <CoursesManager
              courses={myCourses}
              onAddCourse={handleAddCourse}
              onRemoveCourse={handleRemoveCourse}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-6 flex flex-col">
            {/* Availability Manager */}
            <AvailabilityManager />

            {/* Transcript Uploader */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Add courses from transcript</h3>
              <p className="text-sm text-gray-500 font-medium mb-4">
                Upload your transcript (PDF) to automatically extract and add courses with A/A+ grades.
              </p>
              <TranscriptUploader />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}