"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { 
  Edit3, 
  Check, 
  X, 
  Camera,
  Mail,
  MapPin,
  Clock,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ProfileHeaderProps {
  user: {
    name?: string;
    email?: string;
    university?: string;
    timezone?: string;
  };
  onUpdateProfile?: (updates: Partial<{
    name: string;
    university: string;
    timezone: string;
  }>) => Promise<void>;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  onUpdateProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    university: user.university || "AUI",
    timezone: user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const avatar = avatarRef.current;
    
    if (card && avatar) {
      gsap.fromTo(
        card,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
      
      gsap.fromTo(
        avatar,
        { scale: 0 },
        { scale: 1, duration: 0.6, delay: 0.3, ease: "back.out(1.7)" }
      );
    }
  }, []);

  const handleEdit = () => {
    setFormData({
      name: user.name || "",
      university: user.university || "AUI",
      timezone: user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user.name || "",
      university: user.university || "AUI",
      timezone: user.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  const handleSave = async () => {
    if (!onUpdateProfile) return;
    
    // Validate password change if attempted
    if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
      if (!formData.currentPassword) {
        toast.error("Current password is required to change password");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords do not match");
        return;
      }
      if (formData.newPassword.length < 8) {
        toast.error("New password must be at least 8 characters");
        return;
      }
    }
    
    setLoading(true);
    try {
      // Update profile info
      await onUpdateProfile(formData);
      
      // Update password if provided
      if (formData.newPassword && formData.currentPassword) {
        const response = await fetch('/api/user/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword
          })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to change password');
        }
      }
      
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return user.email?.[0]?.toUpperCase() || "U";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div ref={cardRef}>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Avatar and Basic Info */}
        <div className="flex items-center space-x-6">
          {/* Avatar */}
          <div className="relative group">
            <div
              ref={avatarRef}
              className="w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl lg:text-3xl shadow-lg"
            >
              {getInitials(user.name)}
            </div>
            
            {/* Camera overlay on hover */}
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-2">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your full name"
                  className="text-lg font-semibold"
                />
                <Input
                  value={formData.university}
                  onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                  placeholder="University"
                />
                <Input
                  value={formData.timezone}
                  onChange={(e) => setFormData(prev => ({ ...prev, timezone: e.target.value }))}
                  placeholder="Timezone"
                />
                
                {/* Password Change Section */}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <div className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <Lock className="w-4 h-4" />
                    <span>Change Password (Optional)</span>
                  </div>
                  
                  <Input
                    type="password"
                    value={formData.currentPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Current password"
                  />
                  <Input
                    type="password"
                    value={formData.newPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="New password (min 8 characters)"
                  />
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {user.name || "Your Profile"}
                </h1>
                
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  
                  {user.university && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{user.university}</span>
                    </div>
                  )}
                  
                  {user.timezone && (
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{user.timezone}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
                className="flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </Button>
              <Button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                <span>{loading ? "Saving..." : "Save"}</span>
              </Button>
            </>
          ) : (
            <Button
              onClick={handleEdit}
              variant="outline"
              className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profile</span>
            </Button>
          )}
        </div>
      </div>

      {/* Profile Completion Indicator */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Profile Completion</span>
          <span className="text-sm text-gray-500">75%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500" style={{ width: "75%" }}></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Add more skills and courses to complete your profile
        </p>
      </div>
      </div>
    </div>
  );
};

export default ProfileHeader;