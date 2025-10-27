"use client";

import React, { useEffect, useState } from "react";
import { useSwap } from "@/lib/store";
import { ProfileStatsCarousel } from "@/components/profile/ProfileStatsCarousel";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { SkillsManager, CoursesManager } from "@/components/profile/SkillsCoursesManager";
import { GlowCard } from "@/components/ui/enhanced-components";
import { toast } from "sonner";
import TranscriptUploader from "./TranscriptUploader";
import PasswordCard from "./PasswordCard";

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
    <div className="space-y-8 p-6">
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

      {/* Stats Carousel */}
      <ProfileStatsCarousel stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Skills and Courses */}
        <div className="lg:col-span-2 space-y-8">
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

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Transcript Uploader */}
          <GlowCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Add courses from transcript</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload your transcript (PDF) to automatically extract and add courses with A/A+ grades.
            </p>
            <TranscriptUploader />
          </GlowCard>

          {/* Security Card */}
          <GlowCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Security</h3>
            <p className="text-sm text-gray-600 mb-4">
              Manage your account security and password settings.
            </p>
            <PasswordCard hasPassword={false} />
          </GlowCard>

          {/* Profile Tips */}
          <GlowCard className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Profile Tips</h3>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Add at least 3 skills to increase your visibility</p>
              <p>• Upload your transcript to showcase academic achievements</p>
              <p>• Complete your profile to get better match recommendations</p>
              <p>• Update your timezone for accurate session scheduling</p>
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}