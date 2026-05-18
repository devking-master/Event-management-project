"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Shield } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";

export default function SecuritySettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement password change API endpoint
      setSavedMessage("Password changed successfully");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSavedMessage(""), 3000);
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTwoFactor = async () => {
    setLoading(true);
    try {
      // TODO: Implement 2FA toggle API endpoint
      setTwoFactorEnabled(!twoFactorEnabled);
      setSavedMessage(
        !twoFactorEnabled
          ? "Two-factor authentication enabled"
          : "Two-factor authentication disabled"
      );
      setTimeout(() => setSavedMessage(""), 3000);
    } catch (error) {
      console.error("Error toggling 2FA:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Password Change Section */}
      <Card animate={false}>
        <div className="flex items-center gap-4 border-b border-white/5 pb-8 mb-8">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neon-cyan/10 text-neon-cyan">
            <Lock size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black">Password Management</h2>
            <p className="text-sm text-white/40 mt-1">Update your account password regularly</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <Input
            label="Current Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter current password"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm({
                ...passwordForm,
                currentPassword: e.target.value,
              })
            }
            icon={showPassword ? EyeOff : Eye}
            onIconClick={() => setShowPassword(!showPassword)}
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  newPassword: e.target.value,
                })
              }
              icon={showNewPassword ? EyeOff : Eye}
              onIconClick={() => setShowNewPassword(!showNewPassword)}
            />

            <Input
              label="Confirm New Password"
              type={showNewPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm({
                  ...passwordForm,
                  confirmPassword: e.target.value,
                })
              }
            />
          </div>

          {savedMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm"
            >
              <CheckCircle2 size={16} />
              {savedMessage}
            </motion.div>
          )}

          <Button type="submit" variant="neon" loading={loading}>
            Update Password
          </Button>
        </form>
      </Card>

      {/* Two-Factor Authentication Section */}
      <Card animate={false}>
        <div className="flex items-center gap-4 border-b border-white/5 pb-8 mb-8">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neon-purple/10 text-neon-purple">
            <Shield size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black">Two-Factor Authentication</h2>
            <p className="text-sm text-white/40 mt-1">Add an extra layer of security to your account</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10">
          <div>
            <h3 className="font-bold text-white">2FA Status</h3>
            <p className="text-sm text-white/40 mt-1">
              {twoFactorEnabled ? "Enabled" : "Disabled"}
            </p>
          </div>
          <Button
            onClick={toggleTwoFactor}
            loading={loading}
            variant={twoFactorEnabled ? "secondary" : "neon"}
          >
            {twoFactorEnabled ? "Disable" : "Enable"}
          </Button>
        </div>

        {twoFactorEnabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-3"
          >
            <AlertCircle size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-400 font-medium">Authentication enabled</p>
              <p className="text-xs text-blue-300/70 mt-1">
                You'll need to provide a verification code when logging in
              </p>
            </div>
          </motion.div>
        )}
      </Card>

      {/* Active Sessions Section */}
      <Card animate={false}>
        <div className="flex items-center gap-4 border-b border-white/5 pb-8 mb-8">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neon-pink/10 text-neon-pink">
            <AlertCircle size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black">Danger Zone</h2>
            <p className="text-sm text-white/40 mt-1">Irreversible account actions</p>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            variant="secondary"
            className="w-full text-red-400 border-red-500/20 hover:bg-red-500/10"
          >
            Sign Out All Sessions
          </Button>
          <Button
            variant="secondary"
            className="w-full text-red-400 border-red-500/20 hover:bg-red-500/10"
          >
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
}
