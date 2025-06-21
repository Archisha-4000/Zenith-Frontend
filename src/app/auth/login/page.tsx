"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Building, UserCheck, Loader2, ArrowRight, Zap } from "lucide-react"
import { useUser } from "@civic/auth/react"
import { useRouter } from "next/navigation"

type UserRole = "admin" | "manager" | "employee"
type AuthMode = "signin" | "signup"

const roleConfig = {
    admin: {
        icon: Shield,
        title: "Admin Portal",
        description: "Manage organization settings and users",
        color: "from-red-500 to-rose-600",
        borderColor: "border-red-500/20",
        bgColor: "bg-red-500/10",
        textColor: "text-red-400",
        hoverColor: "hover:bg-red-500/20"
    },
    manager: {
        icon: Users,
        title: "Manager Dashboard",
        description: "Oversee teams and assign tasks",
        color: "from-blue-500 to-indigo-600",
        borderColor: "border-blue-500/20",
        bgColor: "bg-blue-500/10",
        textColor: "text-blue-400",
        hoverColor: "hover:bg-blue-500/20"
    },
    employee: {
        icon: UserCheck,
        title: "Employee Hub",
        description: "View and manage your tasks",
        color: "from-emerald-500 to-green-600",
        borderColor: "border-emerald-500/20",
        bgColor: "bg-emerald-500/10",
        textColor: "text-emerald-400",
        hoverColor: "hover:bg-emerald-500/20"
    }
}


export default function LoginPage() {
    const [authMode, setAuthMode] = useState<AuthMode>("signin")
    const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const { signIn, signOut, isLoading } = useUser()
    const router = useRouter()
    const { user } = useUser()

    useEffect(() => {
        if (!isLoading && user) {
            handleAuthenticatedUser(user)
        }
    }, [isLoading, user])

    const handleAuthenticatedUser = async (user: any) => {
        if (!user?.email) {
            setError("No email found in authentication")
            return
        }

        setIsProcessing(true)
        try {
            if (authMode === "signup") {
                // For signup, redirect to setup regardless of role
                router.push("/setup")
                return
            }

            // For signin, fetch user from database and check role
            const response = await fetch("/api/auth/me", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: user.email,
                    chosen_role: selectedRole
                }),
            })

            if (!response.ok) {
                if (response.status === 404) {
                    setError("Please contact your administrator or register your organization first")
                } else if (response.status === 403) {
                    setError("You do not have permission to access this application")
                } else {
                    setError("Failed to fetch user data")
                }
                await signOut()
                return
            }

            // Redirect based on user's actual role from database
            switch (selectedRole) {
                case "admin":
                    router.push("/admin")
                    break
                case "manager":
                    router.push("/manager")
                    break
                case "employee":
                    router.push("/employee")
                    break
                default:
                    setError("Invalid user role")
                    await signOut()
            }
        } catch (err) {
            console.error("Authentication error:", err)
            setError("Authentication failed. Please try again.")
            await signOut()
        } finally {
            setIsProcessing(false)
        }
    }

    const handleRoleSelect = async (role?: UserRole) => {
        setError(null)

        try {
            setIsProcessing(true)
            setSelectedRole(role || null)
            await signIn()
        } catch (err) {
            setSelectedRole(null)
            console.error("Login error:", err)
            setError("Failed to connect with Civic. Please try again.")
            setIsProcessing(false)
        }
    }

    const RoleCard = ({ role, config }: { role: UserRole; config: typeof roleConfig.admin }) => {
        const Icon = config.icon

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: Object.keys(roleConfig).indexOf(role) * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
            >
                <Card
                    className={`
            relative overflow-hidden cursor-pointer transition-all duration-300 
            bg-zinc-900/50 border-zinc-700 ${config.borderColor} 
            ${config.hoverColor} group backdrop-blur-sm
            ${selectedRole === role ? `ring-2 ring-${config.textColor.split('-')[1]}-500 ${config.bgColor}` : ''}
          `}
                    onClick={() => handleRoleSelect(role)}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <CardHeader className="relative z-10">
                        <div className={`w-16 h-16 rounded-xl ${config.bgColor} ${config.borderColor} border-2 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className={`w-8 h-8 ${config.textColor}`} />
                        </div>
                        <CardTitle className="text-xl font-bold text-white group-hover:text-zinc-100 transition-colors">
                            {config.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
                            {config.description}
                        </p>
                        <div className="mt-4 flex items-center text-sm font-medium text-zinc-500 group-hover:text-zinc-400 transition-colors">
                            <span>Continue</span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    const OrganizationSignupCard = () => {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="max-w-md mx-auto"
            >
                <Card
                    className="relative overflow-hidden cursor-pointer transition-all duration-300 bg-zinc-900/50 border border-red-500/20 hover:bg-red-500/20 group backdrop-blur-sm"
                    onClick={() => handleRoleSelect()}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <CardHeader className="relative z-10 text-center">
                        <div className="w-20 h-20 rounded-xl bg-red-500/10 border-red-500/20 border-2 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                            <Building className="w-10 h-10 text-red-400" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-white group-hover:text-zinc-100 transition-colors mb-2">
                            Sign Up as Organization
                        </CardTitle>
                        <p className="text-lg text-red-400 font-medium">Admin Access</p>
                    </CardHeader>
                    <CardContent className="relative z-10 text-center">
                        <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors mb-6">
                            Create your organization account and gain admin access to manage teams, settings, and users.
                        </p>
                        <div className="flex items-center justify-center text-sm font-medium text-zinc-500 group-hover:text-zinc-400 transition-colors">
                            <span>Get Started</span>
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        )
    }

    if (isLoading || isProcessing) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-rose-500 mx-auto mb-4" />
                    <p className="text-zinc-400 text-lg">Authenticating...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 flex items-center justify-center shadow-lg">
                                <Zap className="w-8 h-8 text-white" />
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-[Kagitingan]">
                            Welcome to <span className="bg-gradient-to-r from-rose-400 to-red-500 bg-clip-text text-transparent">Zenith</span>
                        </h1>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                            Choose your access level to continue with secure Civic authentication
                        </p>
                    </motion.div>

                    {/* Auth Mode Toggle */}
                    <motion.div
                        className="flex justify-center mb-8"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="bg-zinc-800/50 backdrop-blur-sm border border-zinc-700 rounded-xl p-1 flex">
                            <button
                                onClick={() => setAuthMode("signin")}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${authMode === "signin"
                                        ? "bg-rose-600 text-white shadow-lg"
                                        : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
                                    }`}
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setAuthMode("signup")}
                                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${authMode === "signup"
                                        ? "bg-rose-600 text-white shadow-lg"
                                        : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
                                    }`}
                            >
                                Sign Up as Organization
                            </button>
                        </div>
                    </motion.div>

                    {/* Error Message */}
                    {error && (
                        <motion.div
                            className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center backdrop-blur-sm"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    {/* Role Selection or Organization Signup */}
                    {authMode === "signin" ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {Object.entries(roleConfig).map(([role, config]) => (
                                <RoleCard
                                    key={role}
                                    role={role as UserRole}
                                    config={config}
                                />
                            ))}
                        </div>
                    ) : (
                        <OrganizationSignupCard />
                    )}

                    {/* Footer */}
                    <motion.div
                        className="text-center mt-12 text-zinc-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <p className="mb-2">Secured by Civic Identity Verification</p>
                        <p className="text-sm">
                            By continuing, you agree to our Terms of Service and Privacy Policy
                        </p>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
