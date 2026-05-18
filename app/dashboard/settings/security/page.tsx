"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Shield,
} from "lucide-react";
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
      setSavedMessage("Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

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
      setTwoFactorEnabled((prev) => !prev);

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
      <Card animate={false}>
        <div className="mb-8 flex items-center gap-4 border-b border-white/5 pb-8">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neon-cyan/10 text-neon-cyan">
            <Lock size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-black">Password Management</h2>
            <p className="mt-1 text-sm text-white/40">
              Update your account password regularly
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div className="relative">
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
              icon={Lock}
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute bottom-3 right-4 text-white/40 transition hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="relative">
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
                icon={Lock}
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute bottom-3 right-4 text-white/40 transition hover:text-white"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

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
              icon={Lock}
            />
          </div>

          {savedMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-400"
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

      <Card animate={false}>
        <div className="mb-8 flex items-center gap-4 border-b border-white/5 pb-8">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neon-purple/10 text-neon-purple">
            <Shield size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-black">
              Two-Factor Authentication
            </h2>
            <p className="mt-1 text-sm text-white/40">
              Add an extra layer of security to your account
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-6">
          <div>
            <h3 className="font-bold text-white">2FA Status</h3>
            <p className="mt-1 text-sm text-white/40">
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
            className="mt-6 flex items-start gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-4"
          >
            <AlertCircle
              size={16}
              className="mt-0.5 flex-shrink-0 text-blue-400"
            />

            <div>
              <p className="text-sm font-medium text-blue-400">
                Authentication enabled
              </p>
              <p className="mt-1 text-xs text-blue-300/70">
                You&apos;ll need to provide a verification code when logging in.
              </p>
            </div>
          </motion.div>
        )}
      </Card>

      <Card animate={false}>
        <div className="mb-8 flex items-center gap-4 border-b border-white/5 pb-8">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-neon-pink/10 text-neon-pink">
            <AlertCircle size={24} />
          </div>

          <div>
            <h2 className="text-2xl font-black">Danger Zone</h2>
            <p className="mt-1 text-sm text-white/40">
              Irreversible account actions
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            variant="secondary"
            className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10"
          >
            Sign Out All Sessions
          </Button>

          <Button
            variant="secondary"
            className="w-full border-red-500/20 text-red-400 hover:bg-red-500/10"
          >
            Delete Account
          </Button>
        </div>
      </Card>
    </div>
  );
}