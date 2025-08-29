import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiUser, FiCalendar, FiEdit2, FiAward } from "react-icons/fi";
import Card, { CardContent, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { Separator } from "@/components/ui/separator.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Skeleton } from "@/components/ui/skeleton.jsx";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

function stringToInitials(name, email) {
  if (name) {
    const parts = name.split(" ");
    return (parts[0][0] || "").toUpperCase() + (parts[1]?.[0] || "").toUpperCase();
  }
  return email?.[0]?.toUpperCase() || "U";
}

const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="flex flex-col items-center space-y-4">
      <Skeleton className="h-28 w-28 rounded-full" />
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-6 w-24" />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-5 w-5/6" />
    </div>
  </div>
);

export default function Profile() {
  const { token } = useAuth();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:8080/protected/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Erreur d'accès au profil");
        }
        return res.json();
      })
      .then(setUser)
      .catch((err) => setError(err.message));
  }, [token]);

  if (!token) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-[70vh]"
    >
      <div className="text-center p-8 max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-zinc-800 dark:text-white">Accès non autorisé</h2>
        <p className="text-zinc-600 dark:text-zinc-300 mb-6">Veuillez vous connecter pour accéder à votre profil.</p>
        <Button variant="primary" onClick={() => window.location.href = '/login'}>
          Se connecter
        </Button>
      </div>
    </motion.div>
  );
  
  if (error) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center min-h-[70vh]"
    >
      <div className="text-center p-8 max-w-md bg-red-50 dark:bg-red-900/20 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-400">Erreur</h2>
        <p className="text-red-500 dark:text-red-300 mb-6">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Réessayer
        </Button>
      </div>
    </motion.div>
  );
  
  if (!user) return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <Card className="w-full max-w-md p-8">
        <LoadingSkeleton />
      </Card>
    </div>
  );

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50 to-white dark:from-zinc-900 dark:to-zinc-800 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div variants={fadeIn} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 h-48 rounded-2xl shadow-lg" />
          <div className="relative px-6 pt-16 pb-20 sm:px-8">
            <div className="flex flex-col items-center">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div className="relative flex h-32 w-32 md:h-36 md:w-36 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-xl ring-4 ring-white dark:ring-zinc-800 items-center justify-center text-5xl font-bold text-white">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || user.email}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">{stringToInitials(user.name, user.email)}</span>
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <FiEdit2 className="w-6 h-6 text-white" />
                </div>
              </motion.div>
              
              <motion.div variants={fadeIn} className="mt-6 text-center">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                  {user.name || user.email}
                </h1>
                <Badge 
                  variant="primary" 
                  className="mt-3 px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-md"
                >
                  <FiAward className="mr-1.5 h-4 w-4" />
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Badge>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={fadeIn}
          className="mt-8 bg-white dark:bg-zinc-900 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="px-6 py-8 sm:px-10 space-y-6">
            <div className="space-y-5">
              <motion.div 
                variants={fadeIn}
                className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/50"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                  <FiMail className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Email</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-300">{user.email}</p>
                </div>
              </motion.div>

              <motion.div 
                variants={fadeIn}
                className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800/50"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                  <FiUser className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">Identifiant</h3>
                  <p className="text-sm text-purple-600 dark:text-purple-300 font-mono">{user.user_id}</p>
                </div>
              </motion.div>

              <motion.div 
                variants={fadeIn}
                className="flex items-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/50"
              >
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                  <FiCalendar className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-emerald-800 dark:text-emerald-200">Membre depuis</h3>
                  <p className="text-sm text-emerald-600 dark:text-emerald-300">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : "-"}
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div 
              variants={fadeIn}
              className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-700 text-center"
            >
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Pour modifier vos informations de profil, veuillez contacter l'administrateur.
              </p>
              <Button 
                variant="outline" 
                className="mt-4 border-blue-500 text-blue-600 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                onClick={() => window.location.href = 'mailto:admin@example.com'}
              >
                <FiMail className="mr-2 h-4 w-4" />
                Contacter l'administrateur
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
