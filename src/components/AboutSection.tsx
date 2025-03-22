            {/* Floating badge */}
            <motion.div 
              className="absolute top-1/4 left-1/2 z-20 bg-white dark:bg-gray-800 shadow-xl rounded-full py-3 px-5 font-bold text-primary"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              animate={{
                y: [0, -10],
                rotate: [0, 5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              Since 2014
            </motion.div> 